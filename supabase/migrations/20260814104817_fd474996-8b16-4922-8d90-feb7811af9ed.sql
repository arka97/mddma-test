
-- Allow uploads under an opaque random folder; ownership tracked by objects.owner
DROP POLICY IF EXISTS "community-media: member insert own folder" ON storage.objects;
DROP POLICY IF EXISTS "community_media_verified_upload" ON storage.objects;
DROP POLICY IF EXISTS "community_media_owner_delete" ON storage.objects;
DROP POLICY IF EXISTS "community-media: public read posts" ON storage.objects;

CREATE POLICY "community-media: member insert posts"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'community-media'
  AND (storage.foldername(name))[1] = 'posts'
  AND (public.is_features_open() OR public.is_paid_or_admin(auth.uid()))
  AND owner = auth.uid()
);

CREATE POLICY "community-media: owner or admin delete"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'community-media'
  AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role))
);

-- Guests may read post media, but not legacy paths that embed a real account id
CREATE POLICY "community-media: public read posts"
ON storage.objects FOR SELECT TO anon
USING (
  bucket_id = 'community-media'
  AND (storage.foldername(name))[1] = 'posts'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id::text = (storage.foldername(name))[2]
  )
);
