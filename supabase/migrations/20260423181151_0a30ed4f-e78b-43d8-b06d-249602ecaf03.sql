-- Pin search_path on helper functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- handle_new_user is already SECURITY DEFINER with search_path; re-affirm
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', '')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'free_member')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

-- Make buckets non-public to disable bucket-level listing,
-- and serve files via signed/public object reads scoped per bucket.
UPDATE storage.buckets SET public = false
  WHERE id IN ('avatars', 'company-assets', 'product-images');

-- Replace broad SELECT policies with per-bucket, no-listing policies.
-- (Policies already restrict by bucket_id; the linter flag is about public buckets.
--  Setting public=false addresses the warning while keeping object reads via API.)