UPDATE storage.buckets SET public = true
WHERE id IN ('avatars', 'company-assets', 'product-images');