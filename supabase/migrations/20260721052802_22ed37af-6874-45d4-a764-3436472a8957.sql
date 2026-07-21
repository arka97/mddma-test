
CREATE TABLE public.follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  followed_company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (follower_user_id, followed_company_id)
);

CREATE INDEX follows_follower_idx ON public.follows(follower_user_id);
CREATE INDEX follows_followed_idx ON public.follows(followed_company_id);

GRANT SELECT, INSERT, DELETE ON public.follows TO authenticated;
GRANT ALL ON public.follows TO service_role;

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own follows"
  ON public.follows FOR SELECT
  TO authenticated
  USING (auth.uid() = follower_user_id);

CREATE POLICY "Users can follow companies"
  ON public.follows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_user_id);

CREATE POLICY "Users can unfollow companies"
  ON public.follows FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_user_id);
