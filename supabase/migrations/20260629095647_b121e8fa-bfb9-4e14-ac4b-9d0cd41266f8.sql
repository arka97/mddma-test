
DROP POLICY IF EXISTS "community-media: paid update own" ON storage.objects;

CREATE POLICY "community-media: paid update own"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'community-media'
  AND (storage.foldername(name))[2] = (auth.uid())::text
  AND (public.is_paid_or_admin(auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role))
)
WITH CHECK (
  bucket_id = 'community-media'
  AND (storage.foldername(name))[2] = (auth.uid())::text
  AND (public.is_paid_or_admin(auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role))
);
