CREATE TABLE public.post_reposts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

GRANT SELECT, INSERT, DELETE ON public.post_reposts TO authenticated;
GRANT ALL ON public.post_reposts TO service_role;

ALTER TABLE public.post_reposts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "post_reposts_select_own" ON public.post_reposts
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "post_reposts_insert_own" ON public.post_reposts
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND NOT public.is_muted(auth.uid()));

CREATE POLICY "post_reposts_delete_own" ON public.post_reposts
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX post_reposts_post_id_idx ON public.post_reposts(post_id);

CREATE OR REPLACE FUNCTION public.set_business_post_repost(_post_id uuid, _reposted boolean)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not signed in';
  END IF;
  IF public.is_muted(auth.uid()) THEN
    RAISE EXCEPTION 'Account is muted';
  END IF;
  IF _reposted THEN
    INSERT INTO public.post_reposts (post_id, user_id)
    VALUES (_post_id, auth.uid())
    ON CONFLICT (post_id, user_id) DO NOTHING;
  ELSE
    DELETE FROM public.post_reposts WHERE post_id = _post_id AND user_id = auth.uid();
  END IF;
  RETURN _reposted;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_post_repost_summary(_ids uuid[])
RETURNS TABLE(post_id uuid, repost_count bigint, reposted boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.post_id,
         count(*)::bigint AS repost_count,
         bool_or(r.user_id = auth.uid()) AS reposted
  FROM public.post_reposts r
  WHERE r.post_id = ANY(_ids)
  GROUP BY r.post_id
$$;

GRANT EXECUTE ON FUNCTION public.set_business_post_repost(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_post_repost_summary(uuid[]) TO anon, authenticated;