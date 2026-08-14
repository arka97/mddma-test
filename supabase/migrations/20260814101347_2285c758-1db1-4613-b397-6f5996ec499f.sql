ALTER TABLE public.advertisements
  ADD COLUMN IF NOT EXISTS image_aspect numeric,
  ADD COLUMN IF NOT EXISTS mobile_image_url text,
  ADD COLUMN IF NOT EXISTS focal_y numeric DEFAULT 50 CHECK (focal_y IS NULL OR (focal_y >= 0 AND focal_y <= 100));

COMMENT ON COLUMN public.advertisements.image_aspect IS 'Natural width / height of the uploaded creative, measured client-side on upload.';
COMMENT ON COLUMN public.advertisements.mobile_image_url IS 'Optional phone-sized creative. Falls back to image_url when absent.';
COMMENT ON COLUMN public.advertisements.focal_y IS 'Vertical focal point (0-100) used as object-position when cropping is unavoidable.';