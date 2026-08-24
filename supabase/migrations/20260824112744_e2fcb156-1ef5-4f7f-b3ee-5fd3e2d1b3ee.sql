DROP EXTENSION IF EXISTS pg_net;
CREATE EXTENSION pg_net WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION private.call_push(_payload jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = private, public, extensions AS $$
DECLARE _url text; _secret text;
BEGIN
  SELECT value INTO _url FROM private.app_config WHERE key = 'functions_base_url';
  SELECT value INTO _secret FROM private.app_config WHERE key = 'push_hook_secret';
  IF _url IS NULL OR _secret IS NULL THEN RETURN; END IF;
  PERFORM extensions.http_post(
    url := _url || '/send-push',
    headers := jsonb_build_object('Content-Type','application/json','x-push-secret', _secret),
    body := _payload
  );
EXCEPTION WHEN OTHERS THEN
  RETURN;
END; $$;

REVOKE EXECUTE ON FUNCTION public.notify_push_on_notification() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.notify_on_post_like() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.notify_on_post_repost() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.notify_on_post_comment() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.notify_on_follow() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.notify_on_deal_message() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.notify_on_quotation() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.broadcast_on_circular() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.broadcast_on_market_post() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.list_my_notifications(integer, timestamptz) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.count_my_unread_notifications() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.mark_notifications_read(uuid[]) FROM anon, public;