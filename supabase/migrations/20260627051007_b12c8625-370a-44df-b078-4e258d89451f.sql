
-- =========================================
-- POLL TABLES
-- =========================================
CREATE TABLE public.post_polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL UNIQUE REFERENCES public.community_posts(id) ON DELETE CASCADE,
  question text NOT NULL,
  closes_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.post_poll_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid NOT NULL REFERENCES public.post_polls(id) ON DELETE CASCADE,
  idx int NOT NULL,
  label text NOT NULL,
  UNIQUE (poll_id, idx)
);

CREATE TABLE public.post_poll_votes (
  poll_id uuid NOT NULL REFERENCES public.post_polls(id) ON DELETE CASCADE,
  option_id uuid NOT NULL REFERENCES public.post_poll_options(id) ON DELETE CASCADE,
  voter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (poll_id, voter_id)
);

CREATE INDEX post_poll_options_poll_idx ON public.post_poll_options(poll_id);
CREATE INDEX post_poll_votes_option_idx ON public.post_poll_votes(option_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_polls TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_poll_options TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_poll_votes TO authenticated;
GRANT ALL ON public.post_polls TO service_role;
GRANT ALL ON public.post_poll_options TO service_role;
GRANT ALL ON public.post_poll_votes TO service_role;

ALTER TABLE public.post_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_poll_votes ENABLE ROW LEVEL SECURITY;

-- Read: same access as parent post (paid + admin + free-grace) - mirror community_posts read rule via is_paid_or_admin OR is_free_within_grace
CREATE POLICY "polls readable by post audience" ON public.post_polls
  FOR SELECT TO authenticated
  USING (
    public.is_paid_or_admin(auth.uid())
    OR public.is_free_within_grace(auth.uid())
  );

CREATE POLICY "poll options readable by post audience" ON public.post_poll_options
  FOR SELECT TO authenticated
  USING (
    public.is_paid_or_admin(auth.uid())
    OR public.is_free_within_grace(auth.uid())
  );

CREATE POLICY "poll votes readable by post audience" ON public.post_poll_votes
  FOR SELECT TO authenticated
  USING (
    public.is_paid_or_admin(auth.uid())
    OR public.is_free_within_grace(auth.uid())
  );

-- Write: only paid_member / broker / admin can create polls (must own parent post)
CREATE POLICY "poll insert by post author paid" ON public.post_polls
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_paid_or_admin(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.community_posts cp
      WHERE cp.id = post_polls.post_id AND cp.author_id = auth.uid()
    )
  );

CREATE POLICY "poll options insert by post author paid" ON public.post_poll_options
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_paid_or_admin(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.post_polls pp
      JOIN public.community_posts cp ON cp.id = pp.post_id
      WHERE pp.id = post_poll_options.poll_id AND cp.author_id = auth.uid()
    )
  );

-- Votes: paid only, must vote as themselves, poll not closed
CREATE POLICY "poll vote insert paid only" ON public.post_poll_votes
  FOR INSERT TO authenticated
  WITH CHECK (
    voter_id = auth.uid()
    AND public.is_paid_or_admin(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.post_polls pp
      WHERE pp.id = post_poll_votes.poll_id AND pp.closes_at > now()
    )
    AND EXISTS (
      SELECT 1 FROM public.post_poll_options po
      WHERE po.id = post_poll_votes.option_id AND po.poll_id = post_poll_votes.poll_id
    )
  );

-- Admin delete (moderation)
CREATE POLICY "polls admin all" ON public.post_polls
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "poll options admin all" ON public.post_poll_options
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "poll votes admin all" ON public.post_poll_votes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- =========================================
-- STORAGE RLS for community-media bucket
-- Path convention: posts/{user_id}/...
-- =========================================
CREATE POLICY "community-media: paid read all"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'community-media'
    AND public.is_paid_or_admin(auth.uid())
  );

CREATE POLICY "community-media: paid insert own folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'community-media'
    AND public.is_paid_or_admin(auth.uid())
    AND (storage.foldername(name))[1] = 'posts'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

CREATE POLICY "community-media: paid update own"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'community-media'
    AND (storage.foldername(name))[2] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'community-media'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

CREATE POLICY "community-media: paid delete own"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'community-media'
    AND (
      (storage.foldername(name))[2] = auth.uid()::text
      OR public.has_role(auth.uid(), 'admin'::app_role)
    )
  );
