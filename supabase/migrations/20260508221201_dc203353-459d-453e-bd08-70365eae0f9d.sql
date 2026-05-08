ALTER TABLE public.products ALTER COLUMN stock_band SET DEFAULT 'available'::stock_band;
ALTER TABLE public.product_variants ALTER COLUMN stock_band SET DEFAULT 'available'::stock_band;