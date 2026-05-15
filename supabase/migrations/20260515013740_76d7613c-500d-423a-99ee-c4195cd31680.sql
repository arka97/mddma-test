-- Force priority_score server-side from buyer reputation; reject client-supplied values
CREATE OR REPLACE FUNCTION public.trg_rfqs_set_priority_score()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rep integer;
BEGIN
  SELECT COALESCE(buyer_reputation_score, 0) INTO rep
  FROM public.profiles WHERE id = NEW.buyer_id;
  NEW.priority_score := COALESCE(rep, 0);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS rfqs_set_priority_score ON public.rfqs;
CREATE TRIGGER rfqs_set_priority_score
BEFORE INSERT OR UPDATE OF priority_score ON public.rfqs
FOR EACH ROW EXECUTE FUNCTION public.trg_rfqs_set_priority_score();

ALTER TABLE public.rfqs DROP CONSTRAINT IF EXISTS priority_score_range;
ALTER TABLE public.rfqs ADD CONSTRAINT priority_score_range CHECK (priority_score BETWEEN 0 AND 100);

-- Re-assert column-level revokes on sensitive company fields for anon
REVOKE SELECT (email, phone, gstin) ON public.companies FROM anon;