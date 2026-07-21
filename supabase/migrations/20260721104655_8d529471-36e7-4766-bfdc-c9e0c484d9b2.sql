
-- Allow public/anon read access to non-hidden, approved companies via RLS,
-- limited to non-PII columns. The companies_public view (security_invoker) already
-- filters columns; this policy + column grants make anon reads through the view work.

CREATE POLICY "Public can view approved non-hidden companies"
  ON public.companies
  FOR SELECT
  TO anon, authenticated
  USING (is_hidden = false AND review_status = 'approved'::review_status);

-- Column-level SELECT grants (PII columns like email, phone, gstin, iec, fssai,
-- address, pincode, latitude, longitude, place_id, rejection_reason are excluded).
GRANT SELECT
  (id, owner_id, slug, name, tagline, description, logo_url, cover_url,
   city, state, country, website, established_year, categories, certifications,
   social_links, is_verified, is_hidden, membership_tier, review_status,
   is_sponsored, verification_tier_label, languages, hours, markets,
   created_at, updated_at)
  ON public.companies TO anon, authenticated;
