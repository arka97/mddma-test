DROP POLICY IF EXISTS "Authenticated can post" ON public.posts;
CREATE POLICY "Authenticated can post" ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Author or admin can update" ON public.posts;
CREATE POLICY "Author or admin can update" ON public.posts FOR UPDATE TO authenticated USING ((auth.uid() = author_id) OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Author or admin can delete" ON public.posts;
CREATE POLICY "Author or admin can delete" ON public.posts FOR DELETE TO authenticated USING ((auth.uid() = author_id) OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Authenticated can comment" ON public.comments;
CREATE POLICY "Authenticated can comment" ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Author or admin can update comment" ON public.comments;
CREATE POLICY "Author or admin can update comment" ON public.comments FOR UPDATE TO authenticated USING ((auth.uid() = author_id) OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Author or admin can delete comment" ON public.comments;
CREATE POLICY "Author or admin can delete comment" ON public.comments FOR DELETE TO authenticated USING ((auth.uid() = author_id) OR public.has_role(auth.uid(), 'admin'::app_role));