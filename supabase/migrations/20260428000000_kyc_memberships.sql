-- Week-1: Memberships (Razorpay-tier scaffold) + KYC document submissions
-- Builds on existing profiles/user_roles/companies. No changes to enums, RLS, or
-- privilege-escalation triggers already in place.

-- =========================================================
-- 1. ENUMS
-- =========================================================
DO $$ BEGIN
  CREATE TYPE public.membership_tier AS ENUM ('broker', 'trader', 'importer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.membership_status AS ENUM ('pending', 'active', 'expired', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.kyc_doc_type AS ENUM ('gst', 'pan', 'fssai', 'bank');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.kyc_doc_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================================================
-- 2. MEMBERSHIPS — Razorpay payment tracking, 1 active per profile
-- =========================================================
CREATE TABLE IF NOT EXISTS public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier public.membership_tier NOT NULL,
  status public.membership_status NOT NULL DEFAULT 'pending',
  starts_at timestamptz,
  expires_at timestamptz,
  founding_lock_until timestamptz,
  price_paid_inr integer,
  razorpay_payment_id text UNIQUE,
  razorpay_order_id text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS memberships_one_active_per_profile
  ON public.memberships (profile_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_memberships_profile_status
  ON public.memberships(profile_id, status);
CREATE INDEX IF NOT EXISTS idx_memberships_status_expires
  ON public.memberships(status, expires_at);

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- Self can read own membership rows; admin reads all
DROP POLICY IF EXISTS "Members read own membership" ON public.memberships;
CREATE POLICY "Members read own membership"
ON public.memberships FOR SELECT
USING (auth.uid() = profile_id OR public.has_role(auth.uid(), 'admin'));

-- Self can INSERT only a 'pending' tier-row for themselves (created at /apply).
-- Admins can insert any row. Razorpay webhook (service role) bypasses RLS.
DROP POLICY IF EXISTS "Self insert pending membership" ON public.memberships;
CREATE POLICY "Self insert pending membership"
ON public.memberships FOR INSERT
WITH CHECK (
  (auth.uid() = profile_id AND status = 'pending')
  OR public.has_role(auth.uid(), 'admin')
);

-- Only admins can mutate state (activate, expire, cancel).
DROP POLICY IF EXISTS "Admins update memberships" ON public.memberships;
CREATE POLICY "Admins update memberships"
ON public.memberships FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete memberships" ON public.memberships;
CREATE POLICY "Admins delete memberships"
ON public.memberships FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_memberships_updated_at
  BEFORE UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- 3. is_active_member() — gate paid content elsewhere
-- =========================================================
CREATE OR REPLACE FUNCTION public.is_active_member(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.memberships
    WHERE profile_id = _user_id
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > now())
  );
$$;

CREATE OR REPLACE FUNCTION public.current_membership_tier(_user_id uuid)
RETURNS public.membership_tier
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT tier FROM public.memberships
  WHERE profile_id = _user_id
    AND status = 'active'
    AND (expires_at IS NULL OR expires_at > now())
  ORDER BY starts_at DESC NULLS LAST
  LIMIT 1;
$$;

-- =========================================================
-- 4. VERIFICATION SUBMISSIONS — KYC doc uploads (GST/PAN/FSSAI/Bank)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.verification_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doc_type public.kyc_doc_type NOT NULL,
  status public.kyc_doc_status NOT NULL DEFAULT 'pending',
  -- Free-form identifier captured alongside the file (GSTIN, PAN no., FSSAI no., bank acct last4)
  doc_number text,
  bank_account_last4 text,
  bank_ifsc text,
  bank_holder_name text,
  file_path text NOT NULL,
  rejection_reason text,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_verif_profile_doctype
  ON public.verification_submissions(profile_id, doc_type);
CREATE INDEX IF NOT EXISTS idx_verif_status
  ON public.verification_submissions(status);

ALTER TABLE public.verification_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Self read own KYC" ON public.verification_submissions;
CREATE POLICY "Self read own KYC"
ON public.verification_submissions FOR SELECT
USING (auth.uid() = profile_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Self insert own KYC" ON public.verification_submissions;
CREATE POLICY "Self insert own KYC"
ON public.verification_submissions FOR INSERT
WITH CHECK (auth.uid() = profile_id AND status = 'pending');

-- Self can replace own submission ONLY while it is still pending
-- (e.g. fix a bad upload). Once admin reviews, only admin can change it.
DROP POLICY IF EXISTS "Self update pending KYC" ON public.verification_submissions;
CREATE POLICY "Self update pending KYC"
ON public.verification_submissions FOR UPDATE
USING (
  (auth.uid() = profile_id AND status = 'pending')
  OR public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Admins delete KYC" ON public.verification_submissions;
CREATE POLICY "Admins delete KYC"
ON public.verification_submissions FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_verif_submissions_updated_at
  BEFORE UPDATE ON public.verification_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- 5. STORAGE BUCKET — verification-docs (PRIVATE)
-- Path convention: {user_id}/{doc_type}/{timestamp}-{random}.{ext}
-- Direct CDN access still uses signed URLs because public=false.
-- =========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-docs', 'verification-docs', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Self upload own KYC docs" ON storage.objects;
CREATE POLICY "Self upload own KYC docs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'verification-docs'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Self read own KYC docs" ON storage.objects;
CREATE POLICY "Self read own KYC docs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'verification-docs'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR public.has_role(auth.uid(), 'admin')
  )
);

DROP POLICY IF EXISTS "Self replace own KYC docs" ON storage.objects;
CREATE POLICY "Self replace own KYC docs"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'verification-docs'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Admin delete KYC docs" ON storage.objects;
CREATE POLICY "Admin delete KYC docs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'verification-docs'
  AND public.has_role(auth.uid(), 'admin')
);
