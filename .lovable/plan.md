## Goal
Add an admin-controlled global toggle that opens all paid features to everyone (guests + free members) temporarily, bypassing the subscription paywall. Toggle lives in Admin Moderation.

## Approach
A single app-wide feature flag `features_open_to_all` stored in a new `app_settings` key/value table. When ON, every paywalled gate in the frontend behaves as if the user is a paid member. Admins can flip it from the Moderation page.

## Database
New migration:
- `app_settings` table: `key text primary key`, `value jsonb`, `updated_at timestamptz`, `updated_by uuid`.
- GRANT SELECT to `anon`, `authenticated`; GRANT ALL to `service_role`.
- RLS: SELECT allowed to everyone (it's a public flag); INSERT/UPDATE/DELETE only via `has_role(auth.uid(),'admin')`.
- Seed row: `('features_open_to_all', 'false'::jsonb)`.

## Frontend
1. `src/hooks/useAppSettings.ts` — subscribes to `app_settings` (initial fetch + realtime channel) and exposes `{ openToAll, loading }`.
2. `src/contexts/RoleContext.tsx` — expose a derived `effectiveRole` / helper `isEffectivePaid` that returns true when `openToAll` is on, even for guests/free members. Existing `role` value stays unchanged so admin UI still reflects reality.
3. Update paywall gates to use the effective check:
   - `src/pages/Market.tsx` (`isPaid`, `canRead`, `canEngage`, `isGuest` paywall overlay).
   - `src/pages/Rfq.tsx` paid-only gate.
   - `src/components/market/PaywallOverlay.tsx` / `GuestTeaser` — skip rendering when open.
   - Any contact-reveal / compose gating that currently checks `role === 'paid_member' | 'broker' | 'admin'`.
   - Note: DB-side RLS for `community_posts` / `rfq_listings` still restricts to paid+admin. To keep parity when the flag is on, the read queries that gate on RLS need to remain readable — these tables already allow `is_paid_or_admin` + free-in-grace. We will NOT loosen RLS; the flag only removes client-side gates so existing paid/admin/free-grace users see content. (Document this caveat.)
4. Admin toggle UI: new tab/section in `src/pages/account/AdminModeration.tsx` called "Feature Access" with a `Switch` bound to the flag and an "All features open to everyone" label + helper text. Writes via supabase update.

## Files Touched
- New: `supabase/migrations/*_app_settings.sql`, `src/hooks/useAppSettings.ts`, `src/components/admin/FeatureAccessTab.tsx`.
- Edit: `src/contexts/RoleContext.tsx`, `src/pages/Market.tsx`, `src/pages/Rfq.tsx`, `src/pages/account/AdminModeration.tsx`, `src/components/market/PaywallOverlay.tsx` (conditional render).

## Out of Scope
- No changes to RLS or pricing pages.
- No per-feature granular toggles — single global switch only.
