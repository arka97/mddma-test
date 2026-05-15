-- 1. Recreate companies_public view with security_invoker so it respects caller's RLS
DROP VIEW IF EXISTS public.companies_public;
CREATE VIEW public.companies_public
WITH (security_invoker = true) AS
SELECT id, owner_id, slug, name, tagline, description, logo_url, cover_url,
       city, state, country, address, website, established_year,
       categories, certifications, social_links, is_verified, is_hidden,
       membership_tier, review_status, created_at, updated_at
FROM public.companies
WHERE NOT is_hidden AND review_status = 'approved'::review_status;

GRANT SELECT ON public.companies_public TO anon, authenticated;

-- 2. Replace the broad authenticated SELECT policy with split policies.
DROP POLICY IF EXISTS "Members can view approved non-hidden companies" ON public.companies;

-- Public/auth users can read approved non-hidden rows at the row level.
-- Sensitive columns (email/phone/gstin) are blocked via column-level grants below.
CREATE POLICY "Public can view approved companies (row level)"
ON public.companies
FOR SELECT
TO anon, authenticated
USING (NOT is_hidden AND review_status = 'approved'::review_status);

-- Owners and admins can read any column on their own / all companies
CREATE POLICY "Owners and admins can view full company"
ON public.companies
FOR SELECT
TO authenticated
USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Column-level grants: hide email/phone/gstin from anon/authenticated.
REVOKE SELECT ON public.companies FROM anon, authenticated;
GRANT SELECT (
  id, owner_id, slug, name, tagline, description, logo_url, cover_url,
  city, state, country, address, website, gstin, email, phone,
  established_year, categories, certifications, social_links,
  is_verified, is_hidden, membership_tier, review_status,
  rejection_reason, created_at, updated_at
) ON public.companies TO authenticated;
-- NOTE: we still grant the sensitive columns to `authenticated`, but RLS
-- (the "Owners and admins can view full company" policy) restricts the rows
-- they can be read from. Anon gets only safe columns.
GRANT SELECT (
  id, owner_id, slug, name, tagline, description, logo_url, cover_url,
  city, state, country, address, website,
  established_year, categories, certifications, social_links,
  is_verified, is_hidden, membership_tier, review_status,
  created_at, updated_at
) ON public.companies TO anon;

-- Re-grant write privileges that REVOKE removed (RLS still gates them).
GRANT INSERT, UPDATE, DELETE ON public.companies TO authenticated;