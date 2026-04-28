-- Temporarily disable the privilege escalation trigger to allow admin promotion
ALTER TABLE public.profiles DISABLE TRIGGER profiles_prevent_escalation;

-- Update adityaparmar27@gmail.com to full verified status
UPDATE public.profiles 
SET 
  verification_tier = 'gst',
  company_verified_at = COALESCE(company_verified_at, now()),
  gst_verified_at = now(),
  buyer_reputation_score = 100
WHERE id = 'f1dcfd80-1f02-4514-b889-a10ac8af0d84';

-- Re-enable the trigger
ALTER TABLE public.profiles ENABLE TRIGGER profiles_prevent_escalation;

-- Ensure user has all roles
INSERT INTO public.user_roles (user_id, role) VALUES 
  ('f1dcfd80-1f02-4514-b889-a10ac8af0d84', 'paid_member'),
  ('f1dcfd80-1f02-4514-b889-a10ac8af0d84', 'broker')
ON CONFLICT (user_id, role) DO NOTHING;