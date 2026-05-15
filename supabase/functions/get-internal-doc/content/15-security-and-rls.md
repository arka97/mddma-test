# Security, RLS & Threat Model

The complete security posture of MDDMA in one place. If a finding seems to contradict this doc, this doc is the authority — update it before adjusting policy.

## Access-control model in one sentence

Every table has Row-Level Security ON; every policy that grants admin access calls the `SECURITY DEFINER` function `has_role(auth.uid(), 'admin'::app_role)` so role checks never recurse on `user_roles`.

## Roles

`app_role` enum: `admin`, `broker`, `paid_member`, `free_member`. Stored in the dedicated `public.user_roles` table — **never** on `profiles` or `companies`.

| Role | How it's granted |
|---|---|
| `free_member` | Auto-inserted by `handle_new_user` trigger on signup |
| `paid_member` | Inserted by `activate_membership` RPC when Razorpay webhook fires; or manually by an admin |
| `broker` | Same as `paid_member`, plus `profiles.is_broker = true` |
| `admin` | Auto-granted to `admin@mddma.org` on first signup; otherwise inserted by an existing admin |

The trigger `remove_free_when_upgraded` deletes the user's `free_member` row whenever `paid_member` or `broker` is inserted (ROLE-001). `downgrade_to_free()` does the inverse on cancellation.

## What is intentionally public (no auth required)

These are **deliberate** — anonymous reads are required for SEO and discovery:

| Table | Filter | Reason |
|---|---|---|
| `product_categories` | `is_active = true` | Catalogue navigation |
| `circulars` | `is_published = true` | Public announcements |
| `advertisements` | `is_active AND start_date ≤ today AND (end_date IS NULL OR end_date ≥ today)` | Sponsored placement |
| `products` | `NOT is_hidden` | Discovery |
| `product_variants` | `is_active = true` | Pricing range data |
| `brands` | `is_active = true` | Brand discovery |
| `posts`, `comments` | always | Public forum archive (read-only after Discourse migration) |

Companies are gated to `authenticated` users (`Members can view approved non-hidden companies`) — guests see directory previews but not full company rows.

## Per-table RLS matrix

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `advertisements` | public if active+in-window OR admin | admin | admin | admin |
| `brands` | public if `is_active` OR admin | company owner OR admin | company owner OR admin | company owner OR admin |
| `circulars` | public if published OR admin | admin (and `auth.uid() = created_by`) | admin | admin |
| `comments` | public | author (`auth.uid() = author_id`) | author OR admin | author OR admin |
| `companies` | authenticated, approved+non-hidden OR self OR admin | self (`auth.uid() = owner_id`) | owner OR admin | owner OR admin |
| `inquiry_products` | participants of the parent RFQ | RFQ buyer | — (blocked) | — (blocked) |
| `posts` | public | author | author OR admin | author OR admin |
| `product_categories` | public if active OR admin | admin | admin | admin |
| `product_variants` | public if active OR seller OR admin | seller of parent product | seller OR admin | seller OR admin |
| `products` | public if not hidden OR seller OR admin | seller (`companies.owner_id`) | seller OR admin | seller OR admin |
| `profiles` | self OR admin | self | self (with trigger guard) | — (blocked) |
| `rfq_responses` | RFQ buyer OR responder OR admin | seller of the targeted company | — (blocked) | — (blocked) |
| `rfqs` | buyer OR seller OR admin | self (`auth.uid() = buyer_id`) | seller OR admin | — (blocked) |
| `user_roles` | self OR admin | admin only | — (blocked) | admin only |

## Critical guard triggers

### `prevent_profile_privilege_escalation`

`BEFORE UPDATE ON profiles` — non-admins cannot change any of the 11 protected fields:

`verification_tier`, `buyer_reputation_score`, `is_broker`, `gstin`, `company_name`, `email_verified_at`, `company_verified_at`, `gst_verified_at`, `rfq_count`, `rfq_response_rate`.

If a non-admin attempts an UPDATE on any of these, the trigger raises `42501` (insufficient privilege). Admins (resolved via `has_role(auth.uid(), 'admin')`) pass through.

### `enforce_product_gallery_limit`

`BEFORE INSERT/UPDATE ON products` — `gallery` array must be ≤ 3 entries. Combined with the cover image, that caps a product at 4 visual assets.

### `remove_free_when_upgraded`

`AFTER INSERT ON user_roles` — when `paid_member` or `broker` is inserted, the user's `free_member` row is deleted. Enforces ROLE-001.

### `trg_rfqs_set_priority_score`

`BEFORE INSERT ON rfqs` — copies the buyer's current `buyer_reputation_score` into `rfqs.priority_score` so the seller's inbox can sort by buyer reputation without a join.

## Authentication

- **Email + password** and **Google** sign-in via Lovable Cloud Auth.
- Sessions live in `localStorage` (handled by `@supabase/supabase-js`).
- `AuthContext` subscribes via `onAuthStateChange` and **never `await`s inside the callback** — async work is deferred with `setTimeout(..., 0)`.
- Founder admin (`admin@mddma.org`) is granted `admin` automatically by `handle_new_user`.
- Recommended: enable **Leaked Password Protection (HIBP)** in Cloud → Users → Auth Settings.

## Storage security

| Bucket | Public read | Write |
|---|---|---|
| `avatars` | yes | owner (path prefix `<userId>/`) |
| `company-assets` | yes | company owner |
| `product-images` | yes | company owner |
| `ad-assets` | yes | **admin only** |

Validation in `src/lib/storage.ts`:

- SVG explicitly rejected (script-injection vector).
- Allowed images: JPEG, PNG, WEBP, GIF (≤ 10 MB).
- Allowed videos: MP4, WebM, MOV (≤ 100 MB) — only on `product-images`.

## Threat surfaces & mitigations

| Surface | Threat | Mitigation |
|---|---|---|
| `/documents` | Unauthorised disclosure of business spec | Body never bundled to client; verified per request via `verify-doc-password` + `get-internal-doc`; constant-time secret compare |
| Profile fields | Self-promotion to admin / verified | `prevent_profile_privilege_escalation` blocks 11 sensitive columns |
| `user_roles` | Privilege escalation | INSERT/DELETE policies require `has_role(auth.uid(), 'admin')`; UPDATE blocked entirely |
| RFQ inbox | Cross-tenant read | RLS scopes `rfqs`/`inquiry_products`/`rfq_responses` to buyer or seller's company `owner_id` |
| Storage | Malicious uploads | SVG block + MIME allowlist + size limit; admin-only write on `ad-assets` |
| Webhook | Forged Razorpay events | HMAC-SHA256 of raw body verified with `RAZORPAY_WEBHOOK_SECRET` |
| Edge functions | Token replay | `razorpay-create-payment-link` re-validates JWT and re-checks role on every call |
| Forum spam | Anonymous posts | INSERT requires `auth.uid() = author_id`; soft-deletion is admin/author only |

## Acknowledged risks

- **`memberships` table not yet migrated** — Razorpay functions will fail at first DB lookup until the migration ships. Risk: documented and intentional during pilot.
- **Founder admin (`admin@mddma.org`) is hard-coded** in `handle_new_user`. If that email is ever compromised, every protection in this doc is bypassable. Treat the inbox like a production secret.
- **No CAPTCHA** on signup. Acceptable while the user base is < 1000; revisit before public launch.

## Security review checklist (run before each public release)

1. Re-run `supabase--linter` and resolve all errors.
2. `select count(*) from user_roles where role = 'admin'` — no surprise admins.
3. `select count(*) from user_roles ur1 join user_roles ur2 using (user_id) where ur1.role='free_member' and ur2.role in ('paid_member','broker')` — must be 0 (ROLE-001).
4. Storage bucket `ad-assets` policy still admin-only write.
5. All edge function secrets present (`DOCS_PASSWORD`, `RAZORPAY_*`).
6. HIBP toggle still enabled in Cloud → Users → Auth Settings.
