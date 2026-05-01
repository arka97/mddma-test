# Founder admin access for admin@mddma.org

The account `admin@mddma.org` doesn't exist yet. Existing RLS already gives the `admin` role full CRUD on every table, and `ProtectedRoute requireRole="admin"` unlocks the admin UI. We just need to make sure this email is **always** treated as a founder admin — no membership fee, no verification gate, no paywalled features.

## What will change

### 1. Auto-promote on signup (DB migration)
Update the existing `handle_new_user()` trigger so that when a user signs up with email `admin@mddma.org`, they are inserted into `public.user_roles` with role `admin` instead of the default `free_member`. All other emails behave exactly as today.

Also include a one-time backfill: if that email already exists in `auth.users` at migration time, insert the admin role row. (No-op today, safe forward guard.)

### 2. Treat admin as auto-paid + fully verified (frontend, no schema change)
- `RoleContext` already returns `"admin"` first when `hasRole("admin")` is true, so admin already short-circuits the membership check. Confirm and add a comment.
- `lib/membership.ts` / membership gating: add a small helper `isFounderAdmin(roles)` and ensure any "requires paid membership" / "requires verification" UI checks (RFQ create, hidden price reveal, advanced CRM, market intelligence, broker board, premium gates) treat admin as if they were paid + GST-verified.
  - Membership status card on `/account/verify` and `/membership` will show a **"Founder — lifetime access"** badge instead of "Apply for paid membership".
  - Verification Center will show all three tiers (email / company / GST) as ✅ for admins, regardless of `verification_tier` value on the profile row.
- No exact-price unmasking changes — the platform-wide "no exact prices" rule still applies; admin only gets full **edit** access, not a different display rule.

### 3. No code changes needed for CRUD
RLS policies on companies, products, product_variants, rfqs, rfq_responses, inquiry_products, posts, comments, circulars, advertisements, product_categories, profiles, user_roles already grant full CRUD via `has_role(auth.uid(), 'admin')`. Verified — nothing to touch.

## After this ships

1. Go to `/login` → sign up with `admin@mddma.org` + any password you choose.
2. Account is created and **immediately** has the `admin` role.
3. Header role pill shows "Admin", `/account/moderation` opens, every gated page works, no payment prompt, no "verify your GST" banners.

## Files touched

- New SQL migration (updates `handle_new_user` + tiny backfill).
- `src/contexts/RoleContext.tsx` — clarifying comment only (logic already correct).
- `src/lib/membership.ts` — add `isFounderAdmin(roles)` helper + treat admin as active paid in `isMembershipActive`-aware consumers.
- `src/pages/account/VerificationCenter.tsx` — show "Founder access" state for admins.
- `src/pages/account/MembershipStatusCard.tsx` (or component used on `/membership` and `/account/verify`) — show "Founder — lifetime access" for admins instead of plan CTA.
- Any component currently gating with `canAccess("rfq_mode")` etc. is already permissioned for admin via `rolePermissions.admin` — no change.

No changes to RLS policies, no changes to pricing, no changes to other users' flows.
