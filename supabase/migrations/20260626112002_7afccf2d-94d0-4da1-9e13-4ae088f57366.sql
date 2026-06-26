
-- =========================================================
-- COMMUNITY FEED + RFQ BOARD
-- =========================================================

-- Profiles: muted flag
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_muted boolean NOT NULL DEFAULT false;

-- Helper: is current user paid (paid_member or broker) or admin?
CREATE OR REPLACE FUNCTION public.is_paid_or_admin(_uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_uid, 'admin'::app_role)
      OR public.has_role(_uid, 'paid_member'::app_role)
      OR public.has_role(_uid, 'broker'::app_role);
$$;

-- Helper: is current user a free member still inside the 7-day grace window?
CREATE OR REPLACE FUNCTION public.is_free_within_grace(_uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_uid, 'free_member'::app_role)
     AND EXISTS (
       SELECT 1 FROM public.profiles p
       WHERE p.id = _uid
         AND p.created_at > now() - interval '7 days'
     );
$$;

-- Helper: muted?
CREATE OR REPLACE FUNCTION public.is_muted(_uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT is_muted FROM public.profiles WHERE id = _uid), false);
$$;

-- =========================================================
-- community_posts
-- =========================================================
CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_type text NOT NULL DEFAULT 'general'
    CHECK (post_type IN ('general','price_signal','market_alert','sourcing_ask','member_news','poll','admin_rate_update')),
  content text NOT NULL DEFAULT '',
  structured_data jsonb,
  topic_tag text
    CHECK (topic_tag IS NULL OR topic_tag IN ('price_signals','market_alerts','sourcing','member_news','polls')),
  is_anonymous boolean NOT NULL DEFAULT false,
  is_pinned boolean NOT NULL DEFAULT false,
  is_hidden boolean NOT NULL DEFAULT false,
  anonymous_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_community_posts_created_at ON public.community_posts (created_at DESC);
CREATE INDEX idx_community_posts_topic ON public.community_posts (topic_tag);
CREATE INDEX idx_community_posts_pinned ON public.community_posts (is_pinned) WHERE is_pinned = true;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;
GRANT ALL ON public.community_posts TO service_role;

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Paid and admin can read posts"
ON public.community_posts FOR SELECT TO authenticated
USING (
  public.is_paid_or_admin(auth.uid())
  OR (public.is_free_within_grace(auth.uid()) AND is_hidden = false)
);

CREATE POLICY "Paid and admin can create posts when not muted"
ON public.community_posts FOR INSERT TO authenticated
WITH CHECK (
  author_id = auth.uid()
  AND public.is_paid_or_admin(auth.uid())
  AND NOT public.is_muted(auth.uid())
);

CREATE POLICY "Authors can update their own non-pinned posts"
ON public.community_posts FOR UPDATE TO authenticated
USING (author_id = auth.uid() AND is_pinned = false)
WITH CHECK (author_id = auth.uid());

CREATE POLICY "Admins can update any post"
ON public.community_posts FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authors and admins can delete posts"
ON public.community_posts FOR DELETE TO authenticated
USING (author_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

-- Updated_at trigger
CREATE TRIGGER trg_community_posts_updated_at
BEFORE UPDATE ON public.community_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enforce safe defaults: only admins can pin / hide / post admin_rate_update
CREATE OR REPLACE FUNCTION public.enforce_community_post_defaults()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.is_pinned := false;
    NEW.is_hidden := false;
    IF NEW.post_type = 'admin_rate_update' THEN
      RAISE EXCEPTION 'Only admins can post admin rate updates.' USING ERRCODE = '42501';
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.is_pinned IS DISTINCT FROM OLD.is_pinned
       OR NEW.is_hidden IS DISTINCT FROM OLD.is_hidden
       OR NEW.post_type IS DISTINCT FROM OLD.post_type THEN
      RAISE EXCEPTION 'Only admins can change pin / hide / type fields.' USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_community_posts_enforce_defaults
BEFORE INSERT OR UPDATE ON public.community_posts
FOR EACH ROW EXECUTE FUNCTION public.enforce_community_post_defaults();

-- =========================================================
-- anonymous_identity_log
-- =========================================================
CREATE TABLE public.anonymous_identity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  real_author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.anonymous_identity_log TO authenticated;
GRANT ALL ON public.anonymous_identity_log TO service_role;

ALTER TABLE public.anonymous_identity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read identity log"
ON public.anonymous_identity_log FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- No INSERT/UPDATE/DELETE policies — only the SECURITY DEFINER trigger writes.

CREATE OR REPLACE FUNCTION public.log_anonymous_identity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_anonymous THEN
    INSERT INTO public.anonymous_identity_log (post_id, real_author_id)
    VALUES (NEW.id, NEW.author_id);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_community_posts_log_anonymous
AFTER INSERT ON public.community_posts
FOR EACH ROW EXECUTE FUNCTION public.log_anonymous_identity();

-- =========================================================
-- post_comments
-- =========================================================
CREATE TABLE public.post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_hidden boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_post_comments_post_id ON public.post_comments (post_id, created_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_comments TO authenticated;
GRANT ALL ON public.post_comments TO service_role;

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Paid and admin can read comments"
ON public.post_comments FOR SELECT TO authenticated
USING (
  public.is_paid_or_admin(auth.uid())
  OR (public.is_free_within_grace(auth.uid()) AND is_hidden = false)
);

CREATE POLICY "Paid and admin can create comments when not muted"
ON public.post_comments FOR INSERT TO authenticated
WITH CHECK (
  author_id = auth.uid()
  AND public.is_paid_or_admin(auth.uid())
  AND NOT public.is_muted(auth.uid())
);

CREATE POLICY "Authors can update own comments"
ON public.post_comments FOR UPDATE TO authenticated
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

CREATE POLICY "Admins can update any comment"
ON public.post_comments FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authors and admins can delete comments"
ON public.post_comments FOR DELETE TO authenticated
USING (author_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

-- =========================================================
-- post_likes
-- =========================================================
CREATE TABLE public.post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

CREATE INDEX idx_post_likes_post_id ON public.post_likes (post_id);

GRANT SELECT, INSERT, DELETE ON public.post_likes TO authenticated;
GRANT ALL ON public.post_likes TO service_role;

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read likes"
ON public.post_likes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Self can like"
ON public.post_likes FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND public.is_paid_or_admin(auth.uid()));

CREATE POLICY "Self can unlike"
ON public.post_likes FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- =========================================================
-- post_views
-- =========================================================
CREATE TABLE public.post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

CREATE INDEX idx_post_views_post_id ON public.post_views (post_id);

GRANT SELECT, INSERT ON public.post_views TO authenticated;
GRANT ALL ON public.post_views TO service_role;

ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read views"
ON public.post_views FOR SELECT TO authenticated USING (true);

CREATE POLICY "Self can record view"
ON public.post_views FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- =========================================================
-- rfq_listings
-- =========================================================
CREATE TABLE public.rfq_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  posted_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_type text NOT NULL CHECK (listing_type IN ('buy','sell')),
  commodity text NOT NULL,
  quantity_min numeric NOT NULL,
  quantity_max numeric NOT NULL,
  quantity_unit text NOT NULL CHECK (quantity_unit IN ('kg','MT','box')),
  price_min numeric NOT NULL,
  price_max numeric NOT NULL,
  price_unit text NOT NULL CHECK (price_unit IN ('per kg','per MT')),
  valid_until date NOT NULL,
  grade_variety text,
  origin_country text,
  delivery_location text,
  is_hidden boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_rfq_listings_active ON public.rfq_listings (created_at DESC) WHERE is_hidden = false;
CREATE INDEX idx_rfq_listings_type ON public.rfq_listings (listing_type);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.rfq_listings TO authenticated;
GRANT ALL ON public.rfq_listings TO service_role;

ALTER TABLE public.rfq_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Paid and admin can read RFQs"
ON public.rfq_listings FOR SELECT TO authenticated
USING (public.is_paid_or_admin(auth.uid()));

CREATE POLICY "Paid and admin can create RFQs"
ON public.rfq_listings FOR INSERT TO authenticated
WITH CHECK (
  posted_by = auth.uid()
  AND public.is_paid_or_admin(auth.uid())
);

CREATE POLICY "Authors can update own RFQs"
ON public.rfq_listings FOR UPDATE TO authenticated
USING (posted_by = auth.uid())
WITH CHECK (posted_by = auth.uid());

CREATE POLICY "Admins can update any RFQ"
ON public.rfq_listings FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authors and admins can delete RFQs"
ON public.rfq_listings FOR DELETE TO authenticated
USING (posted_by = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_rfq_listings_updated_at
BEFORE UPDATE ON public.rfq_listings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: validate ranges, enforce 1..90-day window, force is_hidden=false on non-admin insert
CREATE OR REPLACE FUNCTION public.enforce_rfq_listing_rules()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.price_min >= NEW.price_max THEN
    RAISE EXCEPTION 'Price minimum must be less than price maximum.' USING ERRCODE = '22023';
  END IF;
  IF NEW.quantity_min >= NEW.quantity_max THEN
    RAISE EXCEPTION 'Quantity minimum must be less than quantity maximum.' USING ERRCODE = '22023';
  END IF;
  IF TG_OP = 'INSERT' THEN
    IF NEW.valid_until < (CURRENT_DATE + 1) OR NEW.valid_until > (CURRENT_DATE + 90) THEN
      RAISE EXCEPTION 'valid_until must be between tomorrow and 90 days from today.' USING ERRCODE = '22023';
    END IF;
    IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
      NEW.is_hidden := false;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
      IF NEW.is_hidden IS DISTINCT FROM OLD.is_hidden THEN
        RAISE EXCEPTION 'Only admins can change hidden flag.' USING ERRCODE = '42501';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_rfq_listings_enforce
BEFORE INSERT OR UPDATE ON public.rfq_listings
FOR EACH ROW EXECUTE FUNCTION public.enforce_rfq_listing_rules();

-- =========================================================
-- rfq_contact_reveals
-- =========================================================
CREATE TABLE public.rfq_contact_reveals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id uuid NOT NULL REFERENCES public.rfq_listings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  revealed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_rfq_reveals_rfq ON public.rfq_contact_reveals (rfq_id);

GRANT SELECT, INSERT ON public.rfq_contact_reveals TO authenticated;
GRANT ALL ON public.rfq_contact_reveals TO service_role;

ALTER TABLE public.rfq_contact_reveals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Self or admin can read reveals"
ON public.rfq_contact_reveals FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Paid and admin can record reveal"
ON public.rfq_contact_reveals FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND public.is_paid_or_admin(auth.uid()));
