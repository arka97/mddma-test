-- v3.1.1: Product variants (SKU rows under parent products)

CREATE TABLE public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku text,
  name text NOT NULL,
  grade text,
  packaging text,
  moq numeric,
  moq_unit text DEFAULT 'kg',
  price_min numeric,
  price_max numeric,
  price_unit text DEFAULT 'kg',
  stock_band public.stock_band DEFAULT 'medium',
  lead_time_days integer,
  certifications text[] DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX idx_product_variants_active ON public.product_variants(is_active) WHERE is_active = true;

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Public can view active variants of non-hidden products
CREATE POLICY "Public can view active variants"
ON public.product_variants FOR SELECT
USING (
  is_active OR
  public.has_role(auth.uid(), 'admin') OR
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.companies c ON c.id = p.company_id
    WHERE p.id = product_variants.product_id AND c.owner_id = auth.uid()
  )
);

-- Sellers can insert variants on their own products
CREATE POLICY "Sellers can insert variants"
ON public.product_variants FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.companies c ON c.id = p.company_id
    WHERE p.id = product_variants.product_id AND c.owner_id = auth.uid()
  )
);

-- Sellers and admins can update
CREATE POLICY "Sellers and admins can update variants"
ON public.product_variants FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin') OR
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.companies c ON c.id = p.company_id
    WHERE p.id = product_variants.product_id AND c.owner_id = auth.uid()
  )
);

-- Sellers and admins can delete
CREATE POLICY "Sellers and admins can delete variants"
ON public.product_variants FOR DELETE
USING (
  public.has_role(auth.uid(), 'admin') OR
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.companies c ON c.id = p.company_id
    WHERE p.id = product_variants.product_id AND c.owner_id = auth.uid()
  )
);

CREATE TRIGGER trg_product_variants_updated_at
BEFORE UPDATE ON public.product_variants
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();