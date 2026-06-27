
-- 1) Remove free-member grace period from community read access.
--    Account-age based grace was abusable by creating new free accounts.
DROP POLICY IF EXISTS "Paid and admin can read posts" ON public.community_posts;
CREATE POLICY "Paid and admin can read posts"
  ON public.community_posts
  FOR SELECT
  TO authenticated
  USING (public.is_paid_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Paid and admin can read comments" ON public.post_comments;
CREATE POLICY "Paid and admin can read comments"
  ON public.post_comments
  FOR SELECT
  TO authenticated
  USING (public.is_paid_or_admin(auth.uid()));

-- 2) Tighten RFQ read access: exclude hidden and expired listings for
--    non-owners / non-admins to minimise exposure of delivery_location,
--    origin_country, and grade_variety.
DROP POLICY IF EXISTS "Paid and admin can read RFQs" ON public.rfq_listings;
CREATE POLICY "Paid and admin can read RFQs"
  ON public.rfq_listings
  FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR posted_by = auth.uid()
    OR (
      public.is_paid_or_admin(auth.uid())
      AND is_hidden = false
      AND valid_until >= CURRENT_DATE
    )
  );
