CREATE OR REPLACE FUNCTION public.get_public_profiles(_ids uuid[])
RETURNS TABLE(id uuid, full_name text, avatar_url text, company_name text, verification_tier verification_tier)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.full_name, p.avatar_url, p.company_name, p.verification_tier
  FROM public.profiles p
  WHERE p.id = ANY(_ids)
    AND auth.uid() IS NOT NULL
$$;

GRANT EXECUTE ON FUNCTION public.get_public_profiles(uuid[]) TO authenticated;

CREATE OR REPLACE FUNCTION private.call_push(_payload jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = private, public, net, extensions
AS $$
DECLARE _url text; _secret text;
BEGIN
  SELECT value INTO _url FROM private.app_config WHERE key = 'functions_base_url';
  SELECT value INTO _secret FROM private.app_config WHERE key = 'push_hook_secret';
  IF _url IS NULL OR _secret IS NULL THEN
    RAISE WARNING 'call_push: push config missing';
    RETURN;
  END IF;
  PERFORM net.http_post(
    url := _url || '/send-push',
    headers := jsonb_build_object('Content-Type','application/json','x-push-secret', _secret),
    body := _payload
  );
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'call_push failed: %', SQLERRM;
END;
$$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;