-- Storage bucket for advertisement creatives
INSERT INTO storage.buckets (id, name, public)
VALUES ('ad-assets', 'ad-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
CREATE POLICY "Ad assets public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'ad-assets');

-- Admins can upload / update / delete
CREATE POLICY "Admins can upload ad assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ad-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update ad assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'ad-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete ad assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'ad-assets' AND public.has_role(auth.uid(), 'admin'));
