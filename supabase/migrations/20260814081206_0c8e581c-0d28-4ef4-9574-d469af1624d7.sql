DROP POLICY IF EXISTS community_posts_public_read ON public.community_posts;

CREATE POLICY community_posts_public_read
ON public.community_posts
FOR SELECT
TO anon, authenticated
USING (
  is_hidden = false
  AND (
    COALESCE(is_anonymous, false) = false
    OR author_id = auth.uid()
  )
);