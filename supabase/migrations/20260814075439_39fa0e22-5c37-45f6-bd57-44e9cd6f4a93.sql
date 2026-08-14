CREATE POLICY "community-media: public read posts"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'community-media' AND (storage.foldername(name))[1] = 'posts');