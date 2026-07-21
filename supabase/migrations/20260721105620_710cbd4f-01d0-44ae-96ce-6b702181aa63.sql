
DROP POLICY IF EXISTS "community-media: paid read all" ON storage.objects;
DROP POLICY IF EXISTS "community-media: paid insert own folder" ON storage.objects;

CREATE POLICY "community-media: member read all"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'community-media'
    AND (public.is_features_open() OR public.is_paid_or_admin(auth.uid()))
  );

CREATE POLICY "community-media: member insert own folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'community-media'
    AND (public.is_features_open() OR public.is_paid_or_admin(auth.uid()))
    AND (storage.foldername(name))[1] = 'posts'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );
