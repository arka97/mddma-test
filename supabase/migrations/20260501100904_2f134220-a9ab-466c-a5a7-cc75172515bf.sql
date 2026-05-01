-- Add video_url column to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS video_url text;

-- Trigger to enforce gallery length <= 3 (cover image_url + 3 gallery = 4 total)
CREATE OR REPLACE FUNCTION public.enforce_product_gallery_limit()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.gallery IS NOT NULL AND array_length(NEW.gallery, 1) > 3 THEN
    RAISE EXCEPTION 'Gallery cannot have more than 3 additional images (4 total including cover).'
      USING ERRCODE = '22023';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_products_gallery_limit ON public.products;
CREATE TRIGGER trg_products_gallery_limit
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.enforce_product_gallery_limit();