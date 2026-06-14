## Problem

Visiting `/store/:slug` shows "Storefront Not Found" even for the valid slug `kgvpl`. The page queries the `companies_public` view, which returns:

```
403 — permission denied for table companies (code 42501)
```

## Root cause

`companies_public` is defined with `security_invoker=true`, so the caller's role (`authenticated` / `anon`) must have SELECT on the underlying `public.companies` table. Today, neither role has any SELECT privilege on `companies` — the table only grants `INSERT/UPDATE/DELETE` to `authenticated`. The view therefore fails for every signed-in user and every guest.

The intent (per `src/repositories/companies.ts`) was that public reads go through the view, while sensitive columns (`email`, `phone`, `gstin`, `address`) stay locked to owners only via the `get_my_company` RPC. The column-level grants that would implement this were never added.

## Fix

Add a migration that grants column-level SELECT on the safe, public-facing columns of `public.companies` to `anon` and `authenticated`. Sensitive columns (`email`, `phone`, `gstin`, `address`) get no SELECT grant — they remain readable only via the existing `get_my_company` security-definer RPC for the row's owner.

Columns to grant SELECT on (anon + authenticated):
`id, owner_id, slug, name, tagline, description, logo_url, cover_url, city, state, country, website, established_year, categories, certifications, social_links, is_verified, is_hidden, membership_tier, review_status, is_sponsored, verification_tier_label, languages, hours, markets, created_at, updated_at`

Columns intentionally NOT granted: `email, phone, gstin, address`.

`service_role` keeps full access (already granted).

Existing RLS policies on `companies` continue to scope row visibility; the grant only fixes the table-level permission gate the view trips on.

## Why this is safe

- The four sensitive columns stay unreadable to `anon`/`authenticated` at the column-grant layer, so even a direct `select email from companies` returns 403.
- The `companies_public` view definition already excludes those columns, so nothing downstream changes.
- RLS on `companies` is unchanged, so row visibility rules are unaffected.

## Verification

After the migration:
1. Reload `/store/kgvpl` — header, About, Catalog, Contact, Location cards render.
2. The `/directory` listing keeps working (already used the same view).
3. A direct `select email,phone,gstin from companies` from the browser still returns 403, confirming sensitive columns stay locked.

No frontend code changes.
