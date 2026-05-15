-- Make companies_public view bypass RLS on the base table so we can fully
-- revoke anon access to the sensitive base table. View definition already
-- structurally excludes email/phone/gstin and filters to approved, non-hidden rows.
ALTER VIEW public.companies_public SET (security_invoker = off, security_barrier = on);

-- Ensure view is readable by anon and authenticated.
GRANT SELECT ON public.companies_public TO anon, authenticated;

-- Drop the anon RLS policy on the base companies table so anon can no longer
-- reach sensitive columns even if column-level grants drift.
DROP POLICY IF EXISTS "Anon can view approved non-hidden companies" ON public.companies;

-- Revoke any direct anon access to the base table.
REVOKE ALL ON TABLE public.companies FROM anon;