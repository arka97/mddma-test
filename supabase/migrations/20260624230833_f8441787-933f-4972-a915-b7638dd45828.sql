CREATE OR REPLACE FUNCTION public.enforce_company_insert_defaults()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;
  NEW.is_verified := false;
  NEW.is_sponsored := false;
  NEW.review_status := 'pending';
  NEW.rejection_reason := NULL;
  NEW.is_hidden := true;
  NEW.membership_tier := 'free';
  NEW.verification_tier_label := NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_companies_enforce_insert_defaults ON public.companies;
CREATE TRIGGER trg_companies_enforce_insert_defaults
BEFORE INSERT ON public.companies
FOR EACH ROW EXECUTE FUNCTION public.enforce_company_insert_defaults();

ALTER TABLE public.companies ALTER COLUMN review_status SET DEFAULT 'pending';
ALTER TABLE public.companies ALTER COLUMN is_hidden SET DEFAULT true;
ALTER TABLE public.companies ALTER COLUMN is_verified SET DEFAULT false;
ALTER TABLE public.companies ALTER COLUMN is_sponsored SET DEFAULT false;