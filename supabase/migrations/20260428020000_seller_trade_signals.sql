-- Phase C: seller_trade_signals — denormalized scoreboard powering the
-- microsite + directory + listing cards. Recomputed by trigger on every
-- rfqs / rfq_responses write so reads are O(1) per company.
--
-- Columns are deliberately limited to what the existing schema can derive:
--   • trades_completed / trades_in_pipeline / rfqs_received → from rfqs.status
--   • response_pct / rejection_pct                          → from rfqs.status
--   • avg_response_minutes                                  → from rfq_responses
--   • repeat_buyer_count / last_response_at                 → derived
-- GMV and on-time-pct require quantity + delivery-confirmation flows that
-- don't exist yet — they're explicitly NOT scaffolded as zero-default columns
-- to avoid the "scoreboard always reads 0" credibility hit.

-- =========================================================
-- 1. TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.seller_trade_signals (
  company_id            uuid PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  rfqs_received         int NOT NULL DEFAULT 0,
  trades_completed      int NOT NULL DEFAULT 0,
  trades_in_pipeline    int NOT NULL DEFAULT 0,
  response_pct          numeric(5,2) NOT NULL DEFAULT 0,
  rejection_pct         numeric(5,2) NOT NULL DEFAULT 0,
  avg_response_minutes  int NOT NULL DEFAULT 0,
  repeat_buyer_count    int NOT NULL DEFAULT 0,
  last_response_at      timestamptz,
  last_active_at        timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.seller_trade_signals ENABLE ROW LEVEL SECURITY;

-- Public scoreboard: any visitor (signed-in or guest) can read any seller's
-- signals. There are no direct INSERT / UPDATE policies — only the
-- SECURITY DEFINER recompute function is allowed to write.
DROP POLICY IF EXISTS "trade_signals_read_authenticated" ON public.seller_trade_signals;
CREATE POLICY "trade_signals_read_authenticated"
  ON public.seller_trade_signals FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "trade_signals_read_anon" ON public.seller_trade_signals;
CREATE POLICY "trade_signals_read_anon"
  ON public.seller_trade_signals FOR SELECT
  TO anon
  USING (true);

-- =========================================================
-- 2. RECOMPUTE FUNCTION
-- =========================================================
CREATE OR REPLACE FUNCTION public.recompute_seller_trade_signals(_company_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_received      int := 0;
  v_completed     int := 0;
  v_pipeline      int := 0;
  v_responded     int := 0;
  v_closed        int := 0;
  v_response_pct  numeric(5,2) := 0;
  v_rejection_pct numeric(5,2) := 0;
  v_avg_minutes   int := 0;
  v_repeat        int := 0;
  v_last_resp     timestamptz;
BEGIN
  -- Aggregate rfq counts per status bucket.
  SELECT
    COUNT(*) FILTER (WHERE TRUE),
    COUNT(*) FILTER (WHERE status = 'converted'),
    COUNT(*) FILTER (WHERE status IN ('responded', 'negotiating')),
    COUNT(*) FILTER (WHERE status NOT IN ('new')),
    COUNT(*) FILTER (WHERE status = 'closed')
  INTO v_received, v_completed, v_pipeline, v_responded, v_closed
  FROM public.rfqs
  WHERE company_id = _company_id;

  IF v_received > 0 THEN
    v_response_pct := ROUND(100.0 * v_responded / v_received, 2);
  END IF;

  IF (v_completed + v_closed) > 0 THEN
    v_rejection_pct := ROUND(100.0 * v_closed / (v_completed + v_closed), 2);
  END IF;

  -- Average response latency (minutes) from rfq creation to first response row.
  SELECT
    COALESCE(ROUND(AVG(EXTRACT(EPOCH FROM (resp.first_at - r.created_at)) / 60))::int, 0)
  INTO v_avg_minutes
  FROM public.rfqs r
  JOIN LATERAL (
    SELECT MIN(rr.created_at) AS first_at
    FROM public.rfq_responses rr
    WHERE rr.rfq_id = r.id
  ) resp ON resp.first_at IS NOT NULL
  WHERE r.company_id = _company_id;

  -- Repeat buyers — DISTINCT buyers with >1 RFQ to this company.
  SELECT COUNT(*) INTO v_repeat
  FROM (
    SELECT buyer_id
    FROM public.rfqs
    WHERE company_id = _company_id
    GROUP BY buyer_id
    HAVING COUNT(*) > 1
  ) sub;

  SELECT MAX(rr.created_at) INTO v_last_resp
  FROM public.rfq_responses rr
  JOIN public.rfqs r ON r.id = rr.rfq_id
  WHERE r.company_id = _company_id;

  INSERT INTO public.seller_trade_signals AS s (
    company_id, rfqs_received, trades_completed, trades_in_pipeline,
    response_pct, rejection_pct, avg_response_minutes, repeat_buyer_count,
    last_response_at, last_active_at, updated_at
  ) VALUES (
    _company_id, v_received, v_completed, v_pipeline,
    v_response_pct, v_rejection_pct, v_avg_minutes, v_repeat,
    v_last_resp, now(), now()
  )
  ON CONFLICT (company_id) DO UPDATE SET
    rfqs_received        = EXCLUDED.rfqs_received,
    trades_completed     = EXCLUDED.trades_completed,
    trades_in_pipeline   = EXCLUDED.trades_in_pipeline,
    response_pct         = EXCLUDED.response_pct,
    rejection_pct        = EXCLUDED.rejection_pct,
    avg_response_minutes = EXCLUDED.avg_response_minutes,
    repeat_buyer_count   = EXCLUDED.repeat_buyer_count,
    last_response_at     = EXCLUDED.last_response_at,
    last_active_at       = EXCLUDED.last_active_at,
    updated_at           = now();
END;
$$;

REVOKE ALL ON FUNCTION public.recompute_seller_trade_signals(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.recompute_seller_trade_signals(uuid) TO authenticated, service_role;

-- =========================================================
-- 3. TRIGGERS — recompute on every relevant write
-- =========================================================
CREATE OR REPLACE FUNCTION public.trg_rfqs_recompute_signals()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.recompute_seller_trade_signals(NEW.company_id);
  -- If the company changes (rare; near-impossible given FK), clean the old row too.
  IF TG_OP = 'UPDATE' AND OLD.company_id IS DISTINCT FROM NEW.company_id THEN
    PERFORM public.recompute_seller_trade_signals(OLD.company_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS rfqs_recompute_signals ON public.rfqs;
CREATE TRIGGER rfqs_recompute_signals
  AFTER INSERT OR UPDATE OF status, company_id ON public.rfqs
  FOR EACH ROW EXECUTE FUNCTION public.trg_rfqs_recompute_signals();

CREATE OR REPLACE FUNCTION public.trg_rfq_responses_recompute_signals()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_company_id uuid;
BEGIN
  SELECT company_id INTO v_company_id FROM public.rfqs WHERE id = NEW.rfq_id;
  IF v_company_id IS NOT NULL THEN
    PERFORM public.recompute_seller_trade_signals(v_company_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS rfq_responses_recompute_signals ON public.rfq_responses;
CREATE TRIGGER rfq_responses_recompute_signals
  AFTER INSERT ON public.rfq_responses
  FOR EACH ROW EXECUTE FUNCTION public.trg_rfq_responses_recompute_signals();

-- =========================================================
-- 4. BACKFILL — seed every existing company; recompute from current data
-- =========================================================
INSERT INTO public.seller_trade_signals (company_id)
SELECT id FROM public.companies
ON CONFLICT (company_id) DO NOTHING;

DO $$
DECLARE
  c_id uuid;
BEGIN
  FOR c_id IN SELECT id FROM public.companies LOOP
    PERFORM public.recompute_seller_trade_signals(c_id);
  END LOOP;
END $$;

-- =========================================================
-- 5. NEW-COMPANY BOOTSTRAP — auto-create a zeroed signals row
-- =========================================================
CREATE OR REPLACE FUNCTION public.trg_companies_bootstrap_signals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.seller_trade_signals (company_id)
  VALUES (NEW.id)
  ON CONFLICT (company_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS companies_bootstrap_signals ON public.companies;
CREATE TRIGGER companies_bootstrap_signals
  AFTER INSERT ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.trg_companies_bootstrap_signals();
