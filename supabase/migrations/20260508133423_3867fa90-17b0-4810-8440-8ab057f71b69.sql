-- Drop previous view (which used SECURITY DEFINER semantics)
DROP VIEW IF EXISTS public.companies_public;

-- Recreate as security_invoker so it respects caller RLS / column grants
CREATE VIEW public.companies_public
WITH (security_invoker = on, security_barrier = on) AS
SELECT
  id,
  owner_id,
  slug,
  name,
  tagline,
  description,
  logo_url,
  cover_url,
  city,
  state,
  country,
  address,
  website,
  established_year,
  categories,
  certifications,
  social_links,
  is_verified,
  is_hidden,
  membership_tier,
  review_status,
  created_at,
  updated_at
FROM public.companies
WHERE (NOT is_hidden) AND (review_status = 'approved'::review_status);

GRANT SELECT ON public.companies_public TO anon, authenticated;

-- Allow anon to read approved non-hidden rows from the base table (RLS),
-- but column grants below restrict which columns anon can actually read.
CREATE POLICY "Anon can view approved non-hidden companies"
ON public.companies
FOR SELECT
TO anon
USING ((NOT is_hidden) AND (review_status = 'approved'::review_status));

-- Lock down sensitive columns at the privilege layer for anon.
REVOKE SELECT ON public.companies FROM anon;
GRANT SELECT (
  id, owner_id, slug, name, tagline, description, logo_url, cover_url,
  city, state, country, address, website, established_year, categories,
  certifications, social_links, is_verified, is_hidden, membership_tier,
  review_status, created_at, updated_at
) ON public.companies TO anon;