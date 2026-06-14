GRANT SELECT (
  id, owner_id, slug, name, tagline, description, logo_url, cover_url,
  city, state, country, website, established_year, categories, certifications,
  social_links, is_verified, is_hidden, membership_tier, review_status,
  is_sponsored, verification_tier_label, languages, hours, markets,
  created_at, updated_at
) ON public.companies TO anon, authenticated;