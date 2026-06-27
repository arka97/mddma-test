DROP POLICY IF EXISTS "Authors can update their own non-pinned posts" ON public.community_posts;
CREATE POLICY "Authors can update their own non-pinned posts"
ON public.community_posts
FOR UPDATE
TO authenticated
USING (author_id = auth.uid() AND is_pinned = false)
WITH CHECK (author_id = auth.uid() AND is_pinned = false);