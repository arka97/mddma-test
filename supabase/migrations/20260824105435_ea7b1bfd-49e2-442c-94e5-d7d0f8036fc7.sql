REVOKE ALL ON FUNCTION public.create_business_post(text, text, jsonb, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.create_business_post(text, text, jsonb, text) TO authenticated;