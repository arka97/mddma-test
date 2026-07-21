
CREATE POLICY community_posts_member_insert ON public.community_posts
FOR INSERT TO authenticated
WITH CHECK (
  author_id = auth.uid()
  AND (
    public.is_features_open()
    OR public.has_role(auth.uid(), 'admin'::app_role)
    OR public.has_role(auth.uid(), 'paid_member'::app_role)
    OR public.has_role(auth.uid(), 'broker'::app_role)
  )
);
