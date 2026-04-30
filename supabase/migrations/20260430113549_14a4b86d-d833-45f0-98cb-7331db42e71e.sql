-- 1. Table
CREATE TABLE public.product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_categories_active ON public.product_categories(is_active);
CREATE INDEX idx_product_categories_featured ON public.product_categories(is_featured);
CREATE INDEX idx_product_categories_sort ON public.product_categories(sort_order);

-- 2. updated_at trigger
CREATE TRIGGER update_product_categories_updated_at
BEFORE UPDATE ON public.product_categories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active categories"
ON public.product_categories FOR SELECT
USING (is_active OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert categories"
ON public.product_categories FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update categories"
ON public.product_categories FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete categories"
ON public.product_categories FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- 4. Seed from existing products.category values
INSERT INTO public.product_categories (name, slug, sort_order, is_active, is_featured)
SELECT
  category AS name,
  lower(regexp_replace(trim(category), '[^a-zA-Z0-9]+', '-', 'g')) AS slug,
  (row_number() OVER (ORDER BY category)) * 10 AS sort_order,
  true,
  true
FROM (
  SELECT DISTINCT trim(category) AS category
  FROM public.products
  WHERE category IS NOT NULL AND trim(category) <> ''
) c
ON CONFLICT (name) DO NOTHING;