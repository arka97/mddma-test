ALTER TABLE public.product_categories
  ADD COLUMN IF NOT EXISTS aliases text[] NOT NULL DEFAULT '{}'::text[];

CREATE INDEX IF NOT EXISTS idx_product_categories_aliases
  ON public.product_categories USING GIN (aliases);