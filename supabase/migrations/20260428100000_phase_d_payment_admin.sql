-- Phase D: payment & admin queue plumbing
-- 1. RFQ daily-quota enforcement at the database level (was client-side only)
-- 2. Admin SELECT on verification_submissions (was missing — admin queue read)
-- 3. activate_membership(uuid, jsonb) helper called by the Razorpay webhook
--    (so the webhook can SECURITY DEFINER-flip status without leaking
--    service-role logic into edge function code)

-- =========================================================
-- 1. RFQ DAILY QUOTA TRIGGER
-- =========================================================
-- Tier-derived limits mirror the client-side DAILY_LIMITS table in
-- src/components/RFQModal.tsx so the two stay aligned. The trigger
-- always wins; the client check is now just UI courtesy.
CREATE OR REPLACE FUNCTION public.rfq_daily_quota_for(_uid uuid)
RETURNS int
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE COALESCE(p.verification_tier, 'unverified')
    WHEN 'gst'     THEN 999
    WHEN 'company' THEN 10
    WHEN 'email'   THEN 3
    ELSE 1
  END
  FROM public.profiles p
  WHERE p.id = _uid;
$$;

CREATE OR REPLACE FUNCTION public.trg_rfqs_enforce_quota()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today_count int;
  v_limit int;
BEGIN
  -- Admins bypass.
  IF public.has_role(NEW.buyer_id, 'admin') THEN RETURN NEW; END IF;

  v_limit := COALESCE(public.rfq_daily_quota_for(NEW.buyer_id), 1);

  SELECT COUNT(*) INTO v_today_count
  FROM public.rfqs
  WHERE buyer_id = NEW.buyer_id
    AND created_at >= date_trunc('day', now());

  IF v_today_count >= v_limit THEN
    RAISE EXCEPTION 'RFQ daily quota reached (%/% per day). Verify your account to send more.',
      v_today_count, v_limit
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS rfqs_enforce_quota ON public.rfqs;
CREATE TRIGGER rfqs_enforce_quota
  BEFORE INSERT ON public.rfqs
  FOR EACH ROW EXECUTE FUNCTION public.trg_rfqs_enforce_quota();

-- =========================================================
-- 2. ADMIN SELECT ON verification_submissions
-- (Week-1 missed admin from the SELECT policy, so admin queue couldn't read.)
-- =========================================================
DROP POLICY IF EXISTS "Self read own KYC" ON public.verification_submissions;
CREATE POLICY "Self or admin read KYC"
ON public.verification_submissions FOR SELECT
USING (
  auth.uid() = profile_id
  OR public.has_role(auth.uid(), 'admin')
);

-- =========================================================
-- 3. payment_link_url column on memberships (so the seller sees a
--    "Pay now" CTA once admin generates the link).
-- =========================================================
ALTER TABLE public.memberships
  ADD COLUMN IF NOT EXISTS payment_link_url text;

-- =========================================================
-- 4. activate_membership(uuid, jsonb) — called by Razorpay webhook
-- Webhook runs as service_role (bypasses RLS) but goes through this SDF
-- so all activation logic stays in one auditable place.
-- jsonb payload carries razorpay_payment_id, razorpay_order_id, amount_paid_inr.
-- =========================================================
CREATE OR REPLACE FUNCTION public.activate_membership(
  _membership_id uuid,
  _payload jsonb
)
RETURNS public.memberships
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.memberships;
  v_now timestamptz := now();
  v_expires timestamptz;
BEGIN
  SELECT * INTO v_row FROM public.memberships WHERE id = _membership_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Membership % not found', _membership_id; END IF;

  -- Idempotent: if already active, just refresh payment ids and return.
  IF v_row.status = 'active' THEN
    UPDATE public.memberships SET
      razorpay_payment_id = COALESCE(_payload->>'razorpay_payment_id', razorpay_payment_id),
      razorpay_order_id   = COALESCE(_payload->>'razorpay_order_id',   razorpay_order_id),
      updated_at = v_now
    WHERE id = _membership_id
    RETURNING * INTO v_row;
    RETURN v_row;
  END IF;

  -- Founding 24-month lock unless explicitly overridden.
  v_expires := v_now + INTERVAL '24 months';

  UPDATE public.memberships SET
    status = 'active',
    starts_at = v_now,
    expires_at = v_expires,
    founding_lock_until = v_expires,
    razorpay_payment_id = COALESCE(_payload->>'razorpay_payment_id', razorpay_payment_id),
    razorpay_order_id   = COALESCE(_payload->>'razorpay_order_id',   razorpay_order_id),
    price_paid_inr = COALESCE(NULLIF(_payload->>'amount_paid_inr', '')::int, price_paid_inr),
    updated_at = v_now
  WHERE id = _membership_id
  RETURNING * INTO v_row;

  -- Side effect: grant paid_member role so RoleContext + RLS see the change.
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_row.profile_id, 'paid_member')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.activate_membership(uuid, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.activate_membership(uuid, jsonb) TO service_role;
