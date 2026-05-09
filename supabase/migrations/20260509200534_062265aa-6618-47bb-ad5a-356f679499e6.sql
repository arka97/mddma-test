
-- Revoke direct column-level read of sensitive contact fields from anon users.
-- Listings already go through the companies_public view which masks these.
REVOKE SELECT (email, phone, gstin) ON public.companies FROM anon;

-- Also drop the broad anon SELECT policy and replace with one that excludes
-- the need to read those columns (RLS still permits row read; column grants
-- above are the actual gate). This keeps view-based listings working.
DROP POLICY IF EXISTS "Anon can view approved non-hidden companies" ON public.companies;
CREATE POLICY "Anon can view approved non-hidden companies"
ON public.companies
FOR SELECT
TO anon
USING ((NOT is_hidden) AND (review_status = 'approved'::review_status));
