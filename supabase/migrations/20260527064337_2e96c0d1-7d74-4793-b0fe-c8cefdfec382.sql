ALTER TABLE public.advertisements ADD COLUMN IF NOT EXISTS priority integer NOT NULL DEFAULT 0;
UPDATE public.advertisements SET placement = 'directory-banner' WHERE placement = 'directory-sidebar';
UPDATE public.advertisements SET placement = 'products-banner' WHERE placement = 'category-banner';
CREATE INDEX IF NOT EXISTS idx_advertisements_placement_priority ON public.advertisements(placement, priority DESC, created_at DESC);