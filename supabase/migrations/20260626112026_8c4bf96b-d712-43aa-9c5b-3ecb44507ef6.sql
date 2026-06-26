
REVOKE EXECUTE ON FUNCTION public.is_paid_or_admin(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_free_within_grace(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_muted(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_paid_or_admin(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_free_within_grace(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_muted(uuid) TO authenticated, service_role;
