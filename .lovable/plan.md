## Goal
Ensure that once a member upgrades to **Paid**, they are no longer counted/treated as a Free member anywhere — while keeping all Free benefits (which Paid already inherits via `rolePermissions`).

## Current behavior (verified)
- On signup, `handle_new_user()` inserts a `free_member` row in `user_roles`.
- On payment success (`activate_membership` RPC, called by Razorpay webhook + admin manual activate), a `paid_member` row is **added** but the `free_member` row is **never removed**.
- Result: a paid user holds **both** roles in the DB. `RoleContext` resolves to `paid_member` (correct), and `paid_member` permissions are already a superset of `free_member` (correct). But:
  - Admin Moderation shows the user as both Free + Paid.
  - Any future analytics / RLS / filter that checks `role = 'free_member'` will mis-classify them.
  - On downgrade/expiry, there is no clean way to "fall back" to free because the role row is mixed up.

## Plan

### 1. Database — make Paid replace Free atomically
Migration that:
- Updates `public.activate_membership(uuid, jsonb)` so that, in addition to inserting `paid_member`, it deletes any `free_member` row for the same `profile_id`. Wrap in the existing function body (still SECURITY DEFINER, service_role only).
- Adds a companion function `public.downgrade_to_free(uuid)` (SECURITY DEFINER, admin/service_role only) that removes `paid_member` + `broker` and re-inserts `free_member`. Used by:
  - admin "cancel membership" flow
  - a future expiry sweep (out of scope to schedule, just expose the helper)
- Backfill: one-time `DELETE FROM user_roles WHERE role = 'free_member' AND user_id IN (SELECT user_id FROM user_roles WHERE role = 'paid_member')` so existing dual-role users are cleaned up immediately.
- Audit `rolePermissions.paid_member` to confirm it includes every `free_member` permission (it does today: `browse_directory, view_commodities, view_products, storefront, product_listings, crm_dashboard, community` are all present).

### 2. App code — guarantee Paid ⊇ Free everywhere
- `src/contexts/RoleContext.tsx`: add a unit-style assertion in code (a const + comment) that paid permissions are a strict superset of free permissions, so future edits can't regress. No behavior change.
- `src/lib/membership.ts`: add `downgradeMembershipToFree(userId)` wrapper around the new RPC, used by `cancelMembership` so that when an admin cancels a paid membership the role row also reverts.
- `src/pages/account/AdminModeration.tsx`:
  - In the role-toggle UI, when an admin grants `paid_member` or `broker`, automatically remove `free_member` (and vice versa: granting `free_member` removes paid/broker). Keeps the DB consistent with the new invariant.
  - Adjust the row label so a user with `paid_member` is shown only as "Paid Member" (don't also render the "Free Member" chip).

### 3. Search-and-replace audit
Grep the repo for any place that filters or counts on `role = 'free_member'` or `hasRole("free_member")`. Today there are none in app code beyond display — confirmed. If any are added later, the migration's invariant (a user has *either* free *or* paid, never both) makes them correct by construction.

### Out of scope
- No changes to `/apply`, Razorpay webhook payload, or pricing.
- No automatic expiry cron — just the helper function so it's available when scheduled later.

## Files affected
- `supabase/migrations/<new>__paid_replaces_free.sql` (new)
- `src/lib/membership.ts`
- `src/pages/account/AdminModeration.tsx`
- `src/contexts/RoleContext.tsx` (comment + invariant only)
- `mem://features/user-roles` (note the new invariant)

## Technical detail
Updated `activate_membership` body adds, just before `RETURN`:
```sql
DELETE FROM public.user_roles
 WHERE user_id = v_row.profile_id
   AND role    = 'free_member';
```
New function:
```sql
CREATE OR REPLACE FUNCTION public.downgrade_to_free(_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  DELETE FROM public.user_roles
   WHERE user_id = _user_id AND role IN ('paid_member','broker');
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'free_member')
  ON CONFLICT DO NOTHING;
END $$;
REVOKE ALL ON FUNCTION public.downgrade_to_free(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.downgrade_to_free(uuid) TO service_role;
```
