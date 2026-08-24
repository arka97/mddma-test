-- Extensions & private config -------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE SCHEMA IF NOT EXISTS private;

CREATE TABLE IF NOT EXISTS private.app_config (
  key text PRIMARY KEY,
  value text NOT NULL
);
REVOKE ALL ON private.app_config FROM anon, authenticated;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;

-- Tables -----------------------------------------------------------------------
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL,
  actor_id uuid,
  type text NOT NULL,
  post_id uuid,
  room_id uuid,
  rfq_id uuid,
  circular_id uuid,
  title text NOT NULL,
  body text,
  url text,
  group_count integer NOT NULL DEFAULT 1,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own notifications read" ON public.notifications
  FOR SELECT TO authenticated USING (recipient_id = auth.uid());
CREATE POLICY "own notifications update" ON public.notifications
  FOR UPDATE TO authenticated USING (recipient_id = auth.uid()) WITH CHECK (recipient_id = auth.uid());
CREATE POLICY "own notifications delete" ON public.notifications
  FOR DELETE TO authenticated USING (recipient_id = auth.uid());

CREATE INDEX notifications_recipient_created_idx ON public.notifications (recipient_id, created_at DESC);
CREATE INDEX notifications_unread_idx ON public.notifications (recipient_id) WHERE read_at IS NULL;

CREATE TABLE public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  user_agent text,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.push_subscriptions TO authenticated;
GRANT ALL ON public.push_subscriptions TO service_role;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own push subscriptions" ON public.push_subscriptions
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TRIGGER push_subscriptions_updated_at BEFORE UPDATE ON public.push_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.notification_preferences (
  user_id uuid PRIMARY KEY,
  personal boolean NOT NULL DEFAULT true,
  deals boolean NOT NULL DEFAULT true,
  announcements boolean NOT NULL DEFAULT true,
  market boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.notification_preferences TO authenticated;
GRANT ALL ON public.notification_preferences TO service_role;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own notification prefs" ON public.notification_preferences
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TRIGGER notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helpers ----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notification_category(_type text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT CASE
    WHEN _type IN ('like','comment','repost','follow') THEN 'personal'
    WHEN _type IN ('deal_message','quotation','rfq_reply') THEN 'deals'
    WHEN _type = 'circular' THEN 'announcements'
    ELSE 'market'
  END
$$;

CREATE OR REPLACE FUNCTION private.call_push(_payload jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = private, public AS $$
DECLARE _url text; _secret text;
BEGIN
  SELECT value INTO _url FROM private.app_config WHERE key = 'functions_base_url';
  SELECT value INTO _secret FROM private.app_config WHERE key = 'push_hook_secret';
  IF _url IS NULL OR _secret IS NULL THEN RETURN; END IF;
  PERFORM net.http_post(
    url := _url || '/send-push',
    headers := jsonb_build_object('Content-Type','application/json','x-push-secret', _secret),
    body := _payload
  );
EXCEPTION WHEN OTHERS THEN
  RETURN;
END; $$;

CREATE OR REPLACE FUNCTION public.create_notification(
  _recipient uuid, _actor uuid, _type text, _title text, _body text DEFAULT NULL,
  _url text DEFAULT NULL, _post_id uuid DEFAULT NULL, _room_id uuid DEFAULT NULL,
  _rfq_id uuid DEFAULT NULL, _circular_id uuid DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _id uuid; _existing uuid;
BEGIN
  IF _recipient IS NULL OR _recipient = _actor THEN RETURN NULL; END IF;

  IF _type IN ('like','repost') AND _post_id IS NOT NULL THEN
    SELECT id INTO _existing FROM public.notifications
     WHERE recipient_id = _recipient AND type = _type AND post_id = _post_id
       AND created_at > now() - interval '1 hour'
     ORDER BY created_at DESC LIMIT 1;
    IF _existing IS NOT NULL THEN
      UPDATE public.notifications
         SET group_count = group_count + 1, actor_id = _actor, title = _title,
             body = _body, created_at = now(), read_at = NULL
       WHERE id = _existing;
      RETURN _existing;
    END IF;
  END IF;

  INSERT INTO public.notifications (recipient_id, actor_id, type, title, body, url, post_id, room_id, rfq_id, circular_id)
  VALUES (_recipient, _actor, _type, _title, _body, _url, _post_id, _room_id, _rfq_id, _circular_id)
  RETURNING id INTO _id;
  RETURN _id;
END; $$;

REVOKE EXECUTE ON FUNCTION public.create_notification(uuid,uuid,text,text,text,text,uuid,uuid,uuid,uuid) FROM anon, authenticated, public;

CREATE OR REPLACE FUNCTION public.notify_push_on_notification()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, private AS $$
BEGIN
  PERFORM private.call_push(jsonb_build_object('kind','notification','id', NEW.id));
  RETURN NEW;
END; $$;

CREATE TRIGGER notifications_push_out AFTER INSERT ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.notify_push_on_notification();

-- Event triggers -----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notify_on_post_like()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _author uuid; _name text;
BEGIN
  SELECT author_id INTO _author FROM public.community_posts WHERE id = NEW.post_id;
  SELECT COALESCE(full_name,'Someone') INTO _name FROM public.profiles WHERE id = NEW.user_id;
  PERFORM public.create_notification(_author, NEW.user_id, 'like',
    COALESCE(_name,'Someone') || ' liked your post', NULL, '/post/' || NEW.post_id, NEW.post_id);
  RETURN NEW;
END; $$;
CREATE TRIGGER post_likes_notify AFTER INSERT ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_post_like();

CREATE OR REPLACE FUNCTION public.notify_on_post_repost()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _author uuid; _name text;
BEGIN
  SELECT author_id INTO _author FROM public.community_posts WHERE id = NEW.post_id;
  SELECT COALESCE(full_name,'Someone') INTO _name FROM public.profiles WHERE id = NEW.user_id;
  PERFORM public.create_notification(_author, NEW.user_id, 'repost',
    COALESCE(_name,'Someone') || ' reposted your post', NULL, '/post/' || NEW.post_id, NEW.post_id);
  RETURN NEW;
END; $$;
CREATE TRIGGER post_reposts_notify AFTER INSERT ON public.post_reposts
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_post_repost();

CREATE OR REPLACE FUNCTION public.notify_on_post_comment()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _author uuid; _name text;
BEGIN
  SELECT author_id INTO _author FROM public.community_posts WHERE id = NEW.post_id;
  SELECT COALESCE(full_name,'Someone') INTO _name FROM public.profiles WHERE id = NEW.author_id;
  PERFORM public.create_notification(_author, NEW.author_id, 'comment',
    COALESCE(_name,'Someone') || ' replied to your post',
    left(NEW.content, 140), '/post/' || NEW.post_id, NEW.post_id);
  RETURN NEW;
END; $$;
CREATE TRIGGER post_comments_notify AFTER INSERT ON public.post_comments
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_post_comment();

CREATE OR REPLACE FUNCTION public.notify_on_follow()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _target uuid; _name text;
BEGIN
  IF NEW.followed_user_id IS NOT NULL THEN
    _target := NEW.followed_user_id;
  ELSE
    SELECT owner_id INTO _target FROM public.companies WHERE id = NEW.followed_company_id;
  END IF;
  SELECT COALESCE(full_name,'Someone') INTO _name FROM public.profiles WHERE id = NEW.follower_user_id;
  PERFORM public.create_notification(_target, NEW.follower_user_id, 'follow',
    COALESCE(_name,'Someone') || ' started following you', NULL, '/notifications');
  RETURN NEW;
END; $$;
CREATE TRIGGER follows_notify AFTER INSERT ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_follow();

CREATE OR REPLACE FUNCTION public.notify_on_deal_message()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _room public.deal_rooms%rowtype; _other uuid; _name text; _uid uuid;
BEGIN
  SELECT * INTO _room FROM public.deal_rooms WHERE id = NEW.room_id;
  _other := CASE WHEN NEW.sender_company_id = _room.initiator_company_id
                 THEN _room.counterparty_company_id ELSE _room.initiator_company_id END;
  SELECT COALESCE(full_name,'A member') INTO _name FROM public.profiles WHERE id = NEW.sender_user_id;

  FOR _uid IN
    SELECT owner_id FROM public.companies WHERE id = _other AND owner_id IS NOT NULL
    UNION
    SELECT user_id FROM public.company_members WHERE company_id = _other AND role IN ('owner','admin','editor')
  LOOP
    PERFORM public.create_notification(_uid, NEW.sender_user_id, 'deal_message',
      COALESCE(_name,'A member') || ' sent a message', left(NEW.body, 140),
      '/messages?room=' || NEW.room_id, NULL, NEW.room_id);
  END LOOP;
  RETURN NEW;
END; $$;
CREATE TRIGGER deal_messages_notify AFTER INSERT ON public.deal_messages
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_deal_message();

CREATE OR REPLACE FUNCTION public.notify_on_quotation()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid; _commodity text;
BEGIN
  SELECT commodity INTO _commodity FROM public.rfq_listings WHERE id = NEW.rfq_id;
  FOR _uid IN
    SELECT owner_id FROM public.companies WHERE id = NEW.recipient_company_id AND owner_id IS NOT NULL
    UNION
    SELECT user_id FROM public.company_members WHERE company_id = NEW.recipient_company_id AND role IN ('owner','admin','editor')
  LOOP
    PERFORM public.create_notification(_uid, NEW.sender_user_id, 'quotation',
      'New quotation received', COALESCE(_commodity,'RFQ') || ' — a counter-offer is waiting',
      '/rfq', NULL, NULL, NEW.rfq_id);
  END LOOP;
  RETURN NEW;
END; $$;
CREATE TRIGGER rfq_quotations_notify AFTER INSERT ON public.rfq_quotations
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_quotation();

-- Broadcasts ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.broadcast_on_circular()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, private AS $$
BEGIN
  IF NEW.is_published AND (TG_OP = 'INSERT' OR COALESCE(OLD.is_published, false) = false) THEN
    PERFORM private.call_push(jsonb_build_object(
      'kind','broadcast','category','announcements','type','circular',
      'title','New bulletin: ' || NEW.title,
      'body', left(NEW.body, 140),
      'url','/circulars/' || COALESCE(NEW.slug, NEW.id::text),
      'circular_id', NEW.id));
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER circulars_broadcast AFTER INSERT OR UPDATE ON public.circulars
  FOR EACH ROW EXECUTE FUNCTION public.broadcast_on_circular();

CREATE OR REPLACE FUNCTION public.broadcast_on_market_post()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, private AS $$
BEGIN
  IF NEW.post_type IN ('price_signal','market_alert','admin_rate_update') AND NEW.is_hidden = false THEN
    PERFORM private.call_push(jsonb_build_object(
      'kind','broadcast','category','market','type','market_signal',
      'title', CASE WHEN NEW.post_type = 'market_alert' THEN 'Market alert' ELSE 'New price signal' END,
      'body', left(NEW.content, 140),
      'url','/post/' || NEW.id,
      'post_id', NEW.id,
      'actor_id', NEW.author_id));
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER community_posts_broadcast AFTER INSERT ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.broadcast_on_market_post();

-- Read APIs ------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.list_my_notifications(_limit integer DEFAULT 30, _before timestamptz DEFAULT NULL)
RETURNS TABLE(
  id uuid, type text, title text, body text, url text, group_count integer,
  read_at timestamptz, created_at timestamptz,
  actor_id uuid, actor_name text, actor_avatar text
) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT n.id, n.type, n.title, n.body, n.url, n.group_count, n.read_at, n.created_at,
         n.actor_id, p.full_name, p.avatar_url
  FROM public.notifications n
  LEFT JOIN public.profiles p ON p.id = n.actor_id
  WHERE n.recipient_id = auth.uid()
    AND (_before IS NULL OR n.created_at < _before)
  ORDER BY n.created_at DESC
  LIMIT greatest(1, least(coalesce(_limit, 30), 100));
$$;

CREATE OR REPLACE FUNCTION public.count_my_unread_notifications()
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COUNT(*)::int FROM public.notifications
   WHERE recipient_id = auth.uid() AND read_at IS NULL;
$$;

CREATE OR REPLACE FUNCTION public.mark_notifications_read(_ids uuid[])
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _n integer;
BEGIN
  IF auth.uid() IS NULL THEN RETURN 0; END IF;
  UPDATE public.notifications SET read_at = now()
   WHERE recipient_id = auth.uid() AND read_at IS NULL
     AND (_ids IS NULL OR id = ANY(_ids));
  GET DIAGNOSTICS _n = ROW_COUNT;
  RETURN _n;
END; $$;