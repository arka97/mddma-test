
-- product_categories
ALTER TABLE public.product_categories
  ADD COLUMN IF NOT EXISTS emoji text,
  ADD COLUMN IF NOT EXISTS is_hot boolean NOT NULL DEFAULT false;

-- companies
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS is_sponsored boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS verification_tier_label text,
  ADD COLUMN IF NOT EXISTS iec text,
  ADD COLUMN IF NOT EXISTS languages text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS hours text,
  ADD COLUMN IF NOT EXISTS markets text[] NOT NULL DEFAULT '{}'::text[];

-- products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS lead_time_hours integer,
  ADD COLUMN IF NOT EXISTS stock_kg numeric,
  ADD COLUMN IF NOT EXISTS caliber text,
  ADD COLUMN IF NOT EXISTS moisture text,
  ADD COLUMN IF NOT EXISTS shelf_life text,
  ADD COLUMN IF NOT EXISTS inquiry_count_7d integer NOT NULL DEFAULT 0;

-- market_signals
CREATE TABLE IF NOT EXISTS public.market_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity_name text NOT NULL,
  origin text,
  category text,
  price_min numeric,
  price_max numeric,
  unit text NOT NULL DEFAULT 'kg',
  trend text NOT NULL DEFAULT 'flat' CHECK (trend IN ('up','down','flat')),
  demand text NOT NULL DEFAULT 'medium' CHECK (demand IN ('high','medium','low')),
  supply text NOT NULL DEFAULT 'stable' CHECK (supply IN ('tight','tightening','stable','increasing')),
  inquiries_week integer NOT NULL DEFAULT 0,
  analyst_note text,
  requires_paid boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.market_signals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active market signals" ON public.market_signals;
CREATE POLICY "Public can view active market signals"
  ON public.market_signals FOR SELECT
  USING (is_active OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can insert market signals" ON public.market_signals;
CREATE POLICY "Admins can insert market signals"
  ON public.market_signals FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update market signals" ON public.market_signals;
CREATE POLICY "Admins can update market signals"
  ON public.market_signals FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete market signals" ON public.market_signals;
CREATE POLICY "Admins can delete market signals"
  ON public.market_signals FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP TRIGGER IF EXISTS trg_market_signals_updated_at ON public.market_signals;
CREATE TRIGGER trg_market_signals_updated_at
  BEFORE UPDATE ON public.market_signals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- analyst_reports
CREATE TABLE IF NOT EXISTS public.analyst_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'price' CHECK (kind IN ('supply','demand','price','policy')),
  title text NOT NULL,
  body text,
  requires_paid boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.analyst_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active analyst reports" ON public.analyst_reports;
CREATE POLICY "Public can view active analyst reports"
  ON public.analyst_reports FOR SELECT
  USING (is_active OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can insert analyst reports" ON public.analyst_reports;
CREATE POLICY "Admins can insert analyst reports"
  ON public.analyst_reports FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update analyst reports" ON public.analyst_reports;
CREATE POLICY "Admins can update analyst reports"
  ON public.analyst_reports FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete analyst reports" ON public.analyst_reports;
CREATE POLICY "Admins can delete analyst reports"
  ON public.analyst_reports FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP TRIGGER IF EXISTS trg_analyst_reports_updated_at ON public.analyst_reports;
CREATE TRIGGER trg_analyst_reports_updated_at
  BEFORE UPDATE ON public.analyst_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
