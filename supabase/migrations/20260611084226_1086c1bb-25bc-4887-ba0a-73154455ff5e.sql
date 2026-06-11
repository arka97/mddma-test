
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS fssai text,
  ADD COLUMN IF NOT EXISTS pincode text,
  ADD COLUMN IF NOT EXISTS latitude numeric(9,6),
  ADD COLUMN IF NOT EXISTS longitude numeric(9,6),
  ADD COLUMN IF NOT EXISTS place_id text;

DROP VIEW IF EXISTS public.companies_public;

CREATE VIEW public.companies_public AS
SELECT id, owner_id, slug, name, tagline, description, logo_url, cover_url,
       city, state, country, address, pincode, latitude, longitude, place_id,
       website, fssai, established_year, categories, certifications, social_links,
       is_verified, is_hidden, membership_tier, review_status, created_at, updated_at
FROM public.companies
WHERE NOT is_hidden AND review_status = 'approved'::review_status;

GRANT SELECT ON public.companies_public TO anon, authenticated;
