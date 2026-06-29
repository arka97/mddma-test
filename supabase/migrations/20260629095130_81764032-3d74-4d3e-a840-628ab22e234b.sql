
CREATE OR REPLACE FUNCTION public.is_features_open()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT value = 'true'::jsonb FROM public.app_settings WHERE key = 'features_open_to_all'), false);
$$;

GRANT EXECUTE ON FUNCTION public.is_features_open() TO anon, authenticated;

-- community_posts: extend read policy
DROP POLICY IF EXISTS "Paid and admin can read posts" ON public.community_posts;
CREATE POLICY "Paid admin or open flag can read posts"
  ON public.community_posts FOR SELECT
  USING (public.is_paid_or_admin(auth.uid()) OR public.is_features_open());

-- rfq_listings: extend read policy
DROP POLICY IF EXISTS "Paid and admin can read RFQs" ON public.rfq_listings;
CREATE POLICY "Paid admin author or open flag can read RFQs"
  ON public.rfq_listings FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR (posted_by = auth.uid())
    OR (public.is_paid_or_admin(auth.uid()) AND is_hidden = false AND valid_until >= CURRENT_DATE)
    OR (public.is_features_open() AND is_hidden = false AND valid_until >= CURRENT_DATE)
  );

-- Allow anon SELECT on these tables only via the open flag (RLS still gates rows).
GRANT SELECT ON public.community_posts TO anon;
GRANT SELECT ON public.rfq_listings TO anon;
