
-- 1) Restrict SELECT on post_likes and post_views to owner + admin
DROP POLICY IF EXISTS "Authenticated can read likes" ON public.post_likes;
CREATE POLICY "Owner or admin can read likes"
  ON public.post_likes FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Authenticated can read views" ON public.post_views;
CREATE POLICY "Owner or admin can read views"
  ON public.post_views FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

-- 2) Aggregate RPCs so feed counts still work without exposing identities
CREATE OR REPLACE FUNCTION public.get_post_like_summary(_ids uuid[])
RETURNS TABLE(post_id uuid, like_count bigint, liked boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT p.post_id,
         COUNT(*)::bigint AS like_count,
         BOOL_OR(p.user_id = auth.uid()) AS liked
  FROM public.post_likes p
  WHERE p.post_id = ANY(_ids)
  GROUP BY p.post_id;
$$;

CREATE OR REPLACE FUNCTION public.get_post_view_summary(_ids uuid[])
RETURNS TABLE(post_id uuid, view_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT p.post_id, COUNT(*)::bigint
  FROM public.post_views p
  WHERE p.post_id = ANY(_ids)
  GROUP BY p.post_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_post_like_summary(uuid[]) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_post_view_summary(uuid[]) TO anon, authenticated;

-- 3) Enforce safe URL scheme for member_news links
CREATE OR REPLACE FUNCTION public.enforce_member_news_link_scheme()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  link_val text;
BEGIN
  IF NEW.post_type = 'member_news' AND NEW.structured_data IS NOT NULL THEN
    link_val := NEW.structured_data->>'link';
    IF link_val IS NOT NULL AND length(link_val) > 0
       AND link_val !~* '^https?://' THEN
      RAISE EXCEPTION 'member_news link must start with http:// or https://'
        USING ERRCODE = '22023';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_member_news_link_scheme ON public.community_posts;
CREATE TRIGGER trg_member_news_link_scheme
  BEFORE INSERT OR UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.enforce_member_news_link_scheme();
