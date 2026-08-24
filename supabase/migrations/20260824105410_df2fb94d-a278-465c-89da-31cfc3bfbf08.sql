ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS channel text NOT NULL DEFAULT 'updates';

ALTER TABLE public.community_posts
  DROP CONSTRAINT IF EXISTS community_posts_channel_check;

ALTER TABLE public.community_posts
  ADD CONSTRAINT community_posts_channel_check CHECK (channel IN ('updates','buzz'));

CREATE INDEX IF NOT EXISTS community_posts_channel_created_idx
  ON public.community_posts (channel, created_at DESC);

UPDATE public.community_posts
SET channel = 'buzz'
WHERE post_type = 'member_news'
   OR (
     post_type = 'general'
     AND structured_data IS NOT NULL
     AND (
       (structured_data ? 'video')
       OR (jsonb_typeof(structured_data -> 'images') = 'array'
           AND jsonb_array_length(structured_data -> 'images') > 0)
     )
   );

CREATE OR REPLACE FUNCTION public.create_business_post(
  _post_type text,
  _content text,
  _structured_data jsonb DEFAULT NULL,
  _channel text DEFAULT 'updates'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Sign in to post';
  END IF;
  IF _channel NOT IN ('updates','buzz') THEN
    _channel := 'updates';
  END IF;
  INSERT INTO public.community_posts (author_id, post_type, content, structured_data, channel)
  VALUES (auth.uid(), _post_type, _content, _structured_data, _channel)
  RETURNING id INTO _id;
  RETURN _id;
END;
$$;