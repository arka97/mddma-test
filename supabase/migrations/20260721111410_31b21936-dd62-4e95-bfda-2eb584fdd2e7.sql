
-- Fix 1: Remove anon public read on community-media bucket
DROP POLICY IF EXISTS "community_media_public_read" ON storage.objects;

-- Fix 2: Scope circular-assets reads to admins or files referenced by published circulars
DROP POLICY IF EXISTS "Authenticated users can read circular-assets" ON storage.objects;

CREATE POLICY "Circular assets readable when published or admin"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'circular-assets'
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR EXISTS (
      SELECT 1 FROM public.circulars c, jsonb_array_elements(COALESCE(c.attachments, '[]'::jsonb)) att
      WHERE c.is_published = true
        AND (att->>'url') LIKE '%' || storage.objects.name
    )
  )
);
