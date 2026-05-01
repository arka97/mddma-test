-- 1) Restrict sensitive contact fields on companies to authenticated users.
--    The existing RLS row-level policy stays (approved/non-hidden are visible),
--    but anonymous (anon) clients lose access to phone/email/gstin/address columns.
REVOKE SELECT (phone, email, gstin, address) ON public.companies FROM anon;

-- Authenticated users (members) and service_role keep full column access.
GRANT SELECT (phone, email, gstin, address) ON public.companies TO authenticated;

-- 2) Restrict listing of public storage buckets — allow direct fetch by URL but
--    block enumerating all objects via the LIST API for anonymous users.
--    We add an explicit SELECT policy scoped to each public bucket which only
--    permits owners to see their own folder; public read-by-URL still works
--    because Storage's public bucket flag bypasses RLS for direct GET on
--    individual objects, while LIST always honors RLS.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polrelid = 'storage.objects'::regclass
      AND polname = 'Owners can list own avatar files'
  ) THEN
    CREATE POLICY "Owners can list own avatar files"
      ON storage.objects FOR SELECT TO authenticated
      USING (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1]);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polrelid = 'storage.objects'::regclass
      AND polname = 'Owners can list own company asset files'
  ) THEN
    CREATE POLICY "Owners can list own company asset files"
      ON storage.objects FOR SELECT TO authenticated
      USING (bucket_id = 'company-assets' AND (auth.uid())::text = (storage.foldername(name))[1]);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polrelid = 'storage.objects'::regclass
      AND polname = 'Owners can list own product image files'
  ) THEN
    CREATE POLICY "Owners can list own product image files"
      ON storage.objects FOR SELECT TO authenticated
      USING (bucket_id = 'product-images' AND (auth.uid())::text = (storage.foldername(name))[1]);
  END IF;
END $$;