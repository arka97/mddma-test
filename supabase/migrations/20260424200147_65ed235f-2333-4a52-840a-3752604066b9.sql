-- Verification tier enum
CREATE TYPE public.verification_tier AS ENUM ('unverified', 'email', 'company', 'gst');

-- Extend profiles with buyer trust fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS verification_tier public.verification_tier NOT NULL DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS buyer_reputation_score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS company_name text,
  ADD COLUMN IF NOT EXISTS gstin text,
  ADD COLUMN IF NOT EXISTS rfq_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rfq_response_rate numeric(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_broker boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS company_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS gst_verified_at timestamptz;

-- Constrain reputation score to 0..100
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_buyer_reputation_score_range;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_buyer_reputation_score_range CHECK (buyer_reputation_score BETWEEN 0 AND 100);

-- Helper: bucket score into a label (for UI gating)
CREATE OR REPLACE FUNCTION public.get_buyer_reputation_tier(_score integer)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE
    WHEN _score >= 80 THEN 'trusted'
    WHEN _score >= 50 THEN 'established'
    WHEN _score >= 20 THEN 'emerging'
    ELSE 'new'
  END
$$;

-- Index to query top buyers / sort by reputation
CREATE INDEX IF NOT EXISTS idx_profiles_reputation ON public.profiles (buyer_reputation_score DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_verification_tier ON public.profiles (verification_tier);