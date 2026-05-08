-- Tighten companies table SELECT policy: no more public access to raw rows.
DROP POLICY IF EXISTS "Public can view approved non-hidden companies" ON public.companies;

CREATE POLICY "Members can view approved non-hidden companies"
ON public.companies
FOR SELECT
TO authenticated
USING (
  ((NOT is_hidden) AND (review_status = 'approved'::review_status))
  OR (auth.uid() = owner_id)
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Public-safe view: masks email/phone/gstin for anonymous viewers.
CREATE OR REPLACE VIEW public.companies_public
WITH (security_invoker = off, security_barrier = on) AS
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
  CASE WHEN auth.uid() IS NOT NULL THEN email ELSE NULL END AS email,
  CASE WHEN auth.uid() IS NOT NULL THEN phone ELSE NULL END AS phone,
  website,
  CASE WHEN auth.uid() IS NOT NULL THEN gstin ELSE NULL END AS gstin,
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