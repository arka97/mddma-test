-- Revoke direct SELECT on sensitive contact columns from anon/authenticated.
-- Owners/admins read contact info via the SECURITY DEFINER function below.
REVOKE SELECT (email, phone, gstin) ON public.companies FROM anon, authenticated;

-- Owner-only accessor that returns the caller's own company row with contact fields.
CREATE OR REPLACE FUNCTION public.get_my_company()
RETURNS SETOF public.companies
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.companies
  WHERE owner_id = auth.uid()
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_my_company() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_company() TO authenticated;

-- Admin accessor for moderation flows that need contact info for a specific company.
CREATE OR REPLACE FUNCTION public.get_company_contact_admin(_company_id uuid)
RETURNS TABLE (email text, phone text, gstin text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.email, c.phone, c.gstin
  FROM public.companies c
  WHERE c.id = _company_id
    AND public.has_role(auth.uid(), 'admin'::app_role);
$$;

REVOKE ALL ON FUNCTION public.get_company_contact_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_company_contact_admin(uuid) TO authenticated;