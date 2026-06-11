
-- 1. Drop unused public_profiles view (lint: security definer view)
DROP VIEW IF EXISTS public.public_profiles;

-- 2. Rebuild companies_public with security_invoker and minimal column set
DROP VIEW IF EXISTS public.companies_public;
CREATE VIEW public.companies_public
WITH (security_invoker = true) AS
SELECT
  id, owner_id, slug, name, tagline, description, logo_url, cover_url,
  city, state, country, website, established_year, categories, certifications,
  social_links, is_verified, is_hidden, membership_tier, review_status,
  is_sponsored, verification_tier_label, languages, hours, markets,
  created_at, updated_at
FROM public.companies
WHERE (NOT is_hidden) AND review_status = 'approved'::review_status;

GRANT SELECT ON public.companies_public TO anon, authenticated;

-- 3. Column-level grants on companies for anon (RLS row policy still applies).
-- Revoke broad SELECT and re-grant only non-sensitive columns to anon.
REVOKE SELECT ON public.companies FROM anon;
GRANT SELECT (
  id, owner_id, slug, name, tagline, description, logo_url, cover_url,
  city, state, country, website, established_year, categories, certifications,
  social_links, is_verified, is_hidden, membership_tier, review_status,
  is_sponsored, verification_tier_label, languages, hours, markets,
  created_at, updated_at
) ON public.companies TO anon;

-- 4. Prevent non-admin owners from changing admin-only company fields
CREATE OR REPLACE FUNCTION public.prevent_company_admin_field_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  IF NEW.is_verified            IS DISTINCT FROM OLD.is_verified
  OR NEW.review_status          IS DISTINCT FROM OLD.review_status
  OR NEW.rejection_reason       IS DISTINCT FROM OLD.rejection_reason
  OR NEW.is_sponsored           IS DISTINCT FROM OLD.is_sponsored
  OR NEW.membership_tier        IS DISTINCT FROM OLD.membership_tier
  OR NEW.verification_tier_label IS DISTINCT FROM OLD.verification_tier_label
  OR NEW.owner_id               IS DISTINCT FROM OLD.owner_id
  THEN
    RAISE EXCEPTION 'Only admins can change moderation, sponsorship, or membership fields on a company.'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS companies_prevent_admin_field_changes ON public.companies;
CREATE TRIGGER companies_prevent_admin_field_changes
BEFORE UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION public.prevent_company_admin_field_changes();

-- 5. analyst_reports — gate requires_paid rows to paid members & admins
DROP POLICY IF EXISTS "Public can view active analyst reports" ON public.analyst_reports;
CREATE POLICY "Public can view active analyst reports"
ON public.analyst_reports
FOR SELECT
TO public
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (
    is_active
    AND (
      NOT requires_paid
      OR has_role(auth.uid(), 'paid_member'::app_role)
      OR has_role(auth.uid(), 'broker'::app_role)
    )
  )
);

-- 6. market_signals — gate requires_paid rows to paid members & admins
DROP POLICY IF EXISTS "Public can view active market signals" ON public.market_signals;
CREATE POLICY "Public can view active market signals"
ON public.market_signals
FOR SELECT
TO public
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (
    is_active
    AND (
      NOT requires_paid
      OR has_role(auth.uid(), 'paid_member'::app_role)
      OR has_role(auth.uid(), 'broker'::app_role)
    )
  )
);

-- 7. circular-assets bucket — require authentication for reads
DROP POLICY IF EXISTS "Public can read circular-assets" ON storage.objects;
CREATE POLICY "Authenticated users can read circular-assets"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'circular-assets');
