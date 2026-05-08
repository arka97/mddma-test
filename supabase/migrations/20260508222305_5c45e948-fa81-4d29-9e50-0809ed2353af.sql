ALTER TABLE public.products
  DROP COLUMN IF EXISTS stock_band,
  DROP COLUMN IF EXISTS trend_direction,
  DROP COLUMN IF EXISTS market_avg_price,
  DROP COLUMN IF EXISTS demand_score;

ALTER TABLE public.product_variants
  DROP COLUMN IF EXISTS stock_band;

DROP TYPE IF EXISTS public.stock_band;
DROP TYPE IF EXISTS public.trend_direction;