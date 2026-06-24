-- Split the dual-role public SELECT policy on public.companies so the
-- anon-facing surface is clearly distinct from the authenticated one.
-- Column-level GRANTs (already in place) prevent anon from reading
-- email/phone/gstin/address/iec/fssai; this migration makes the role
-- separation explicit at the policy layer as well.

DROP POLICY IF EXISTS "Public can view approved companies (row level)" ON public.companies;

-- Anonymous visitors: row predicate identical, but column-level GRANTs
-- restrict the readable surface to non-PII discovery columns only.
CREATE POLICY "Anon can view approved companies (non-PII columns only)"
  ON public.companies
  FOR SELECT
  TO anon
  USING ((NOT is_hidden) AND (review_status = 'approved'::review_status));

-- Authenticated members: same row predicate; PII columns (email, phone,
-- gstin, address, iec, fssai) are NOT granted to the `authenticated` role
-- at the column level for arbitrary rows. Owners/admins still see the
-- full row via the existing "Owners and admins can view full company"
-- policy, and the contact-reveal SECURITY DEFINER functions
-- (get_company_whatsapp, get_company_contact_admin) gate reveals.
CREATE POLICY "Authenticated can view approved companies (non-PII columns only)"
  ON public.companies
  FOR SELECT
  TO authenticated
  USING ((NOT is_hidden) AND (review_status = 'approved'::review_status));

-- Re-assert column grants so the protection is explicit in this migration
-- and not dependent on a prior one. Safe (non-PII) columns only.
DO $$
DECLARE
  safe_cols text := 'id, owner_id, slug, name, tagline, description, logo_url, cover_url, '
                 || 'city, state, country, website, established_year, categories, '
                 || 'certifications, social_links, is_verified, is_hidden, '
                 || 'membership_tier, review_status, is_sponsored, '
                 || 'verification_tier_label, languages, hours, markets, '
                 || 'created_at, updated_at';
BEGIN
  -- Revoke any prior table-level SELECT to ensure column-level grants are
  -- the only path for anon/authenticated to read companies directly.
  EXECUTE 'REVOKE SELECT ON public.companies FROM anon';
  EXECUTE 'REVOKE SELECT ON public.companies FROM authenticated';

  EXECUTE format('GRANT SELECT (%s) ON public.companies TO anon', safe_cols);
  EXECUTE format('GRANT SELECT (%s) ON public.companies TO authenticated', safe_cols);
END $$;

-- Owners/admins still need full-row SELECT; the existing policy handles
-- the row predicate, and these grants provide the column privileges.
GRANT SELECT ON public.companies TO service_role;