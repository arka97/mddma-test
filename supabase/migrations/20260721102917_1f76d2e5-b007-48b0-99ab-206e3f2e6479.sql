
-- 1) Companies: drop the misleadingly-named row-only "non-PII columns" policies.
-- Direct SELECT on public.companies is not granted to anon and remains owner/admin-only for authenticated via the existing "Owners and admins can view full company" policy.
-- All public consumers must read through the public.companies_public view, which enumerates safe columns only.
DROP POLICY IF EXISTS "Anon can view approved companies (non-PII columns only)" ON public.companies;
DROP POLICY IF EXISTS "Authenticated can view approved companies (non-PII columns only" ON public.companies;
DROP POLICY IF EXISTS "Authenticated can view approved companies (non-PII columns only)" ON public.companies;

-- 2) app_settings: replace the "readable by all" policy with a key-scoped policy.
DROP POLICY IF EXISTS "app_settings readable by all" ON public.app_settings;

CREATE POLICY "app_settings public flag readable"
  ON public.app_settings
  FOR SELECT
  TO anon, authenticated
  USING (key = 'features_open_to_all');

CREATE POLICY "app_settings admin readable"
  ON public.app_settings
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
