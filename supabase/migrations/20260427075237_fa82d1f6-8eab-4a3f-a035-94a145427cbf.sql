
-- =========================================================
-- 1. PROFILES: restrict SELECT to owner/admin, add public view
-- =========================================================
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Profiles viewable by self or admin"
ON public.profiles
FOR SELECT
USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

-- Public-safe view (no sensitive fields)
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = true)
AS
SELECT id, full_name, avatar_url, bio, designation, verification_tier, created_at
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- =========================================================
-- 2. PROFILES: prevent self-promotion of sensitive fields
-- =========================================================
CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admins (or the SECURITY DEFINER edge function path) can update anything
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  -- Block changes to sensitive trust/identity fields by non-admins
  IF NEW.verification_tier        IS DISTINCT FROM OLD.verification_tier
  OR NEW.buyer_reputation_score   IS DISTINCT FROM OLD.buyer_reputation_score
  OR NEW.is_broker                IS DISTINCT FROM OLD.is_broker
  OR NEW.gstin                    IS DISTINCT FROM OLD.gstin
  OR NEW.company_name             IS DISTINCT FROM OLD.company_name
  OR NEW.email_verified_at        IS DISTINCT FROM OLD.email_verified_at
  OR NEW.company_verified_at      IS DISTINCT FROM OLD.company_verified_at
  OR NEW.gst_verified_at          IS DISTINCT FROM OLD.gst_verified_at
  OR NEW.rfq_count                IS DISTINCT FROM OLD.rfq_count
  OR NEW.rfq_response_rate        IS DISTINCT FROM OLD.rfq_response_rate
  THEN
    RAISE EXCEPTION 'Cannot modify protected profile fields. Use the verification flow.'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_escalation ON public.profiles;
CREATE TRIGGER profiles_prevent_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

-- =========================================================
-- 3. STORAGE: prevent anonymous listing of public buckets
-- =========================================================
-- Drop overly broad listing policies if present
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND cmd = 'SELECT'
      AND policyname ILIKE 'Public read %'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- Direct file access (by exact name) is still public — Supabase public-bucket fetch
-- bypasses RLS via the storage CDN endpoint. We only restrict LIST (which calls
-- storage.objects SELECT via PostgREST). So we add no SELECT policy for these
-- buckets; direct CDN URLs continue to work.
