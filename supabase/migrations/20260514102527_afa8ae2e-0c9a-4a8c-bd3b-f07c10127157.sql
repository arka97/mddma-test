
-- Brands table
CREATE TABLE public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text,
  story text,
  logo_url text,
  cover_url text,
  gallery text[] NOT NULL DEFAULT '{}',
  b2c_url text,
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  categories text[] NOT NULL DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_brands_company_id ON public.brands(company_id);
CREATE INDEX idx_brands_featured ON public.brands(is_featured) WHERE is_featured = true;

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active brands"
  ON public.brands FOR SELECT
  USING (is_active OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners and admins can insert brands"
  ON public.brands FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (SELECT 1 FROM public.companies c WHERE c.id = brands.company_id AND c.owner_id = auth.uid())
  );

CREATE POLICY "Owners and admins can update brands"
  ON public.brands FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (SELECT 1 FROM public.companies c WHERE c.id = brands.company_id AND c.owner_id = auth.uid())
  );

CREATE POLICY "Owners and admins can delete brands"
  ON public.brands FOR DELETE
  USING (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (SELECT 1 FROM public.companies c WHERE c.id = brands.company_id AND c.owner_id = auth.uid())
  );

CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Extend products
ALTER TABLE public.products
  ADD COLUMN brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL,
  ADD COLUMN is_branded boolean NOT NULL DEFAULT false,
  ADD COLUMN retail_pack_size text,
  ADD COLUMN b2c_url text;

CREATE INDEX idx_products_brand_id ON public.products(brand_id);
CREATE INDEX idx_products_is_branded ON public.products(is_branded) WHERE is_branded = true;
