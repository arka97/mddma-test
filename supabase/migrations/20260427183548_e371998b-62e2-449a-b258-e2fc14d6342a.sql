-- 1. inquiry_products junction (multi-product RFQs)
CREATE TABLE public.inquiry_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id uuid NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.inquiry_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View RFQ line items if you can view the RFQ"
ON public.inquiry_products FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.rfqs r
    LEFT JOIN public.companies c ON c.id = r.company_id
    WHERE r.id = inquiry_products.rfq_id
      AND (r.buyer_id = auth.uid() OR c.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);

CREATE POLICY "Buyer of RFQ can insert line items"
ON public.inquiry_products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.rfqs r WHERE r.id = inquiry_products.rfq_id AND r.buyer_id = auth.uid())
);

CREATE INDEX idx_inquiry_products_rfq ON public.inquiry_products(rfq_id);

-- 2. circulars
CREATE TABLE public.circulars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  category text DEFAULT 'general',
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.circulars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published circulars"
ON public.circulars FOR SELECT USING (is_published OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert circulars"
ON public.circulars FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin') AND auth.uid() = created_by);

CREATE POLICY "Admins can update circulars"
ON public.circulars FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete circulars"
ON public.circulars FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_circulars_updated_at
BEFORE UPDATE ON public.circulars
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. advertisements
CREATE TABLE public.advertisements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  link_url text,
  placement text NOT NULL DEFAULT 'homepage-banner',
  start_date date NOT NULL DEFAULT current_date,
  end_date date,
  is_active boolean NOT NULL DEFAULT true,
  impressions integer NOT NULL DEFAULT 0,
  clicks integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active in-window ads"
ON public.advertisements FOR SELECT USING (
  (is_active AND start_date <= current_date AND (end_date IS NULL OR end_date >= current_date))
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can manage ads insert"
ON public.advertisements FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage ads update"
ON public.advertisements FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage ads delete"
ON public.advertisements FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_ads_updated_at
BEFORE UPDATE ON public.advertisements
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. forum posts
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  category text NOT NULL DEFAULT 'Trade Discussions',
  is_pinned boolean NOT NULL DEFAULT false,
  view_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts public read" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Authenticated can post" ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Author or admin can update" ON public.posts FOR UPDATE
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Author or admin can delete" ON public.posts FOR DELETE
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. forum comments
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments public read" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated can comment" ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Author or admin can update comment" ON public.comments FOR UPDATE
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Author or admin can delete comment" ON public.comments FOR DELETE
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_comments_post ON public.comments(post_id);

-- 6. companies.review_status (member application flow)
DO $$ BEGIN
  CREATE TYPE public.review_status AS ENUM ('pending','approved','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS review_status public.review_status NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Existing public-view policy already handles is_hidden; tighten so pending apps don't leak:
DROP POLICY IF EXISTS "Public can view non-hidden companies" ON public.companies;
CREATE POLICY "Public can view approved non-hidden companies"
ON public.companies FOR SELECT USING (
  ((NOT is_hidden) AND review_status = 'approved')
  OR auth.uid() = owner_id
  OR public.has_role(auth.uid(), 'admin')
);