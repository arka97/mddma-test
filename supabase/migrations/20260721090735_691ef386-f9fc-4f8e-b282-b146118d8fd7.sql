
CREATE OR REPLACE FUNCTION public.get_company_follower_count(_company_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::int
  FROM public.follows
  WHERE followed_company_id = _company_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_company_follower_count(uuid) TO anon, authenticated;
