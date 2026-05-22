-- Add slug column to circulars for public /circulars/<slug> routes
ALTER TABLE public.circulars ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Slug generator function
CREATE OR REPLACE FUNCTION public.slugify(_title text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT regexp_replace(
           regexp_replace(
             lower(coalesce(_title, '')),
             '[^a-z0-9]+', '-', 'g'
           ),
           '(^-+)|(-+$)', '', 'g'
         )
$$;

-- BEFORE INSERT/UPDATE trigger to auto-assign a unique slug from title
CREATE OR REPLACE FUNCTION public.circulars_set_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  base text;
  candidate text;
  n int := 1;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    base := public.slugify(NEW.title);
    IF base = '' THEN
      base := 'circular';
    END IF;
    candidate := base;
    WHILE EXISTS (
      SELECT 1 FROM public.circulars
       WHERE slug = candidate
         AND id IS DISTINCT FROM NEW.id
    ) LOOP
      n := n + 1;
      candidate := base || '-' || n;
    END LOOP;
    NEW.slug := candidate;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS circulars_set_slug_trg ON public.circulars;
CREATE TRIGGER circulars_set_slug_trg
BEFORE INSERT OR UPDATE OF title ON public.circulars
FOR EACH ROW
EXECUTE FUNCTION public.circulars_set_slug();

-- Backfill existing rows
DO $$
DECLARE
  r record;
  base text;
  candidate text;
  n int;
BEGIN
  FOR r IN SELECT id, title FROM public.circulars WHERE slug IS NULL ORDER BY created_at LOOP
    base := public.slugify(r.title);
    IF base = '' THEN base := 'circular'; END IF;
    candidate := base;
    n := 1;
    WHILE EXISTS (SELECT 1 FROM public.circulars WHERE slug = candidate) LOOP
      n := n + 1;
      candidate := base || '-' || n;
    END LOOP;
    UPDATE public.circulars SET slug = candidate WHERE id = r.id;
  END LOOP;
END $$;