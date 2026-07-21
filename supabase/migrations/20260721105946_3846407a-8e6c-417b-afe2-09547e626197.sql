
CREATE OR REPLACE FUNCTION public.is_paid_or_admin(_uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    _uid IS NOT NULL
    AND (
      public.is_features_open()
      OR public.has_role(_uid, 'admin'::app_role)
      OR public.has_role(_uid, 'paid_member'::app_role)
      OR public.has_role(_uid, 'broker'::app_role)
    );
$$;
