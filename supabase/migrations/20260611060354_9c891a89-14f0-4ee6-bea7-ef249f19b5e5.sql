
ALTER TABLE public.circulars
  ADD COLUMN IF NOT EXISTS attachments jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE OR REPLACE FUNCTION public.enforce_circular_attachments_limit()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.attachments IS NOT NULL
     AND jsonb_typeof(NEW.attachments) = 'array'
     AND jsonb_array_length(NEW.attachments) > 5 THEN
    RAISE EXCEPTION 'A circular cannot have more than 5 attachments.'
      USING ERRCODE = '22023';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_circular_attachments_limit_tr ON public.circulars;
CREATE TRIGGER enforce_circular_attachments_limit_tr
  BEFORE INSERT OR UPDATE ON public.circulars
  FOR EACH ROW EXECUTE FUNCTION public.enforce_circular_attachments_limit();

-- Storage policies for circular-assets bucket
CREATE POLICY "Public can read circular-assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'circular-assets');

CREATE POLICY "Admins can upload to circular-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'circular-assets' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update circular-assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'circular-assets' AND public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'circular-assets' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete circular-assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'circular-assets' AND public.has_role(auth.uid(), 'admin'::app_role));
