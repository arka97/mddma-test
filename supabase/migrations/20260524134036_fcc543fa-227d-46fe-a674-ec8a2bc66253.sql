-- 1. Companies: revoke column-level SELECT on sensitive contact fields
REVOKE SELECT (email, phone, gstin) ON public.companies FROM anon, authenticated;

-- 2. Profiles: enforce privilege escalation guard on INSERT as well as UPDATE
CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    -- Force safe defaults on self-insert; reject attempts to seed trust fields
    IF NEW.verification_tier      IS DISTINCT FROM 'unverified'::verification_tier
    OR COALESCE(NEW.buyer_reputation_score, 0) <> 0
    OR COALESCE(NEW.is_broker, false) <> false
    OR NEW.gstin                  IS NOT NULL
    OR NEW.email_verified_at      IS NOT NULL
    OR NEW.company_verified_at    IS NOT NULL
    OR NEW.gst_verified_at        IS NOT NULL
    OR COALESCE(NEW.rfq_count, 0) <> 0
    OR COALESCE(NEW.rfq_response_rate, 0) <> 0
    THEN
      RAISE EXCEPTION 'Cannot set protected profile fields on insert. Use the verification flow.'
        USING ERRCODE = '42501';
    END IF;
    RETURN NEW;
  END IF;

  -- UPDATE path
  IF NEW.verification_tier        IS DISTINCT FROM OLD.verification_tier
  OR NEW.buyer_reputation_score   IS DISTINCT FROM OLD.buyer_reputation_score
  OR NEW.is_broker                IS DISTINCT FROM OLD.is_broker
  OR NEW.gstin                    IS DISTINCT FROM OLD.gstin
  OR NEW.company_name             IS DISTINCT FROM OLD.company_name
  OR NEW.email_verified_at        IS DISTINCT FROM OLD.email_verified_at
  OR NEW.company_verified_at      IS DISTINCT FROM OLD.company_verified_at
  OR NEW.gst_verified_at          IS DISTINCT FROM OLD.gst_verified_at
  OR NEW.rfq_count                IS DISTINCT FROM OLD.rfq_count
  OR NEW.rfq_response_rate        IS DISTINCT FROM OLD.rfq_response_rate
  THEN
    RAISE EXCEPTION 'Cannot modify protected profile fields. Use the verification flow.'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS prevent_profile_privilege_escalation_ins ON public.profiles;
CREATE TRIGGER prevent_profile_privilege_escalation_ins
  BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

-- 3. Products: revoke price columns from anon (members still see prices)
REVOKE SELECT (price_min, price_max) ON public.products FROM anon;

-- 4. Product variants: revoke price/MOQ/lead-time/sku from anon
REVOKE SELECT (price_min, price_max, moq, moq_unit, lead_time_days, sku) ON public.product_variants FROM anon;