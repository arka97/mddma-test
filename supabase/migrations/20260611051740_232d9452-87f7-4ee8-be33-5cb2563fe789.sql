
CREATE TABLE public.market_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  body text,
  source_name text,
  source_url text,
  category text,
  image_url text,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.market_news TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.market_news TO authenticated;
GRANT ALL ON public.market_news TO service_role;
ALTER TABLE public.market_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published market_news"
  ON public.market_news FOR SELECT
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert market_news"
  ON public.market_news FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update market_news"
  ON public.market_news FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete market_news"
  ON public.market_news FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_market_news_updated_at
  BEFORE UPDATE ON public.market_news
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


CREATE TABLE public.humor_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  image_url text,
  attribution text,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.humor_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.humor_posts TO authenticated;
GRANT ALL ON public.humor_posts TO service_role;
ALTER TABLE public.humor_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published humor_posts"
  ON public.humor_posts FOR SELECT
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert humor_posts"
  ON public.humor_posts FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update humor_posts"
  ON public.humor_posts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete humor_posts"
  ON public.humor_posts FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_humor_posts_updated_at
  BEFORE UPDATE ON public.humor_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
