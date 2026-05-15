# Owner Quickstart & "Where do I…?"

You're the only operator. This doc answers every "how do I do X right now" question in one place. If something here drifts from reality, fix this doc first — it's the operator's home page.

## First-time setup

1. Sign up at `/login` with `admin@mddma.org`. The `handle_new_user` trigger grants `admin` automatically.
2. Set your `DOCS_PASSWORD` secret in **Lovable Cloud → Settings → Secrets**.
3. Visit `/documents` and confirm the password works (gates `verify-doc-password`).
4. Upload your logo and brand assets via `/account/company`.
5. Publish your first circular at `/account/moderation` → **Circulars**.

## "Where do I…?" — by task

| Goal | Path | Notes |
|---|---|---|
| Add another admin | SQL only | `INSERT INTO user_roles (user_id, role) VALUES ('<uuid>', 'admin');` |
| Approve a member's company | `/account/moderation` → Companies | Set `review_status='approved'`, `is_hidden=false`. |
| Mark a member verified | `/account/moderation` → Companies | Toggle `is_verified`. |
| Promote a member's KYC tier | `/account/moderation` (or SQL) | See doc 13 §4. There is no self-serve `/account/verify` flow. |
| Publish a circular | `/account/moderation` → Circulars → New | Tick `Published`; appears on `/circulars` immediately. |
| Run an ad campaign | `/account/moderation` → Ads | Upload image to `ad-assets`, set `placement`, dates, `is_active`. |
| Pin a forum post | `/account/moderation` → Posts | Sets `posts.is_pinned = true`. |
| Cancel a member's paid status | SQL | `SELECT downgrade_to_free('<uuid>');` |
| Refund a Razorpay payment | Razorpay dashboard | Then `SELECT downgrade_to_free('<uuid>');` to remove role. |
| Change the docs password | Cloud → Settings → Secrets → `DOCS_PASSWORD` | Both `verify-doc-password` and `get-internal-doc` pick it up immediately. |
| Regenerate the sitemap | `bun run scripts/generate-sitemap.ts` | Writes `public/sitemap.xml`. |
| Simulate a different role | Header role simulator | Demo only; no server-side effect. |
| View live edge function logs | Cloud → Edge Functions → select function | Streams in real time. |
| Inspect database rows | Cloud → Tables | Or use the Supabase MCP tools from chat. |
| Rotate a secret | Cloud → Settings → Secrets → edit | Edge functions read fresh on next invocation. |
| Add a new public route | Edit `src/routes.tsx` | Then re-run sitemap script. |
| Add a new internal doc | See "Add an internal doc" below | |

## Feature → file map

When you need to touch the code, here's where each feature lives.

| Feature | Primary files |
|---|---|
| Home page | `src/pages/Index.tsx` + `src/components/home/*` |
| Directory list | `src/pages/Directory.tsx` + `src/repositories/companies.ts` |
| Member profile | `src/pages/MemberProfile.tsx` |
| Storefront | `src/pages/Storefront.tsx` |
| Products list / page | `src/pages/Products.tsx`, `src/pages/ProductPage.tsx` |
| Brands | `src/pages/Brands.tsx`, `src/pages/BrandPage.tsx` |
| RFQ cart | `src/contexts/CartContext.tsx`, `src/components/cart/*` |
| RFQ inbox | `src/pages/account/RFQInbox.tsx` |
| Apply / membership | `src/pages/Apply.tsx`, `src/pages/MembershipPlans.tsx`, `src/lib/membership.ts` |
| Forum | `src/pages/Community.tsx` + `src/repositories/posts.ts` |
| Circulars | `src/pages/Circulars.tsx` + `src/repositories/circulars.ts` |
| Admin CMS | `src/pages/account/AdminModeration.tsx` |
| Auth | `src/pages/Login.tsx`, `src/contexts/AuthContext.tsx` |
| Role simulator | `src/contexts/RoleContext.tsx`, `src/components/layout/Header.tsx` |
| Documents hub | `src/pages/DocumentsHub.tsx`, `src/pages/DocViewer.tsx`, `src/components/PasswordGate.tsx` |
| Storage / uploads | `src/lib/storage.ts` |
| Live ticker | `src/components/layout/MarketTicker.tsx` |
| SEO `<head>` | `src/components/Seo.tsx` |
| Routes table | `src/routes.tsx` |
| Design tokens | `src/index.css`, `tailwind.config.ts` |

## Add an internal doc (e.g. doc 18)

1. Create `supabase/functions/get-internal-doc/content/18-<slug>.md`.
2. Add to `SLUG_TO_FILE` in `supabase/functions/get-internal-doc/index.ts`:
   ```ts
   "<slug>": "18-<slug>.md",
   ```
3. Add a `DocMeta` row in `src/content/docs/_meta.ts` with `internal: true`. Don't import the body — internal docs aren't bundled.
4. Save. The edge function redeploys automatically. Visit `/documents/<slug>` to verify.

## Add a public doc

Public docs ARE bundled. In `src/content/docs/_meta.ts`:
1. Drop the `.md` in `src/content/docs/`.
2. Import it: `import x from "./NN-<slug>.md?raw";`
3. Add to `DOCS` (no `internal` flag) and to `SOURCES`.

## "I broke X, where do I look?"

| Symptom | First check |
|---|---|
| White screen on load | Browser console; if "Cloud not ready", wait or run `cloud_status` |
| Login redirect loop | `AuthContext` — make sure no `await` lives inside `onAuthStateChange` callback |
| RFQ submit silently fails | Network tab → `rfqs` POST; usually RLS denial because user has no `paid_member` role |
| Image upload "fails" | `UploadValidationError` in console (size / SVG / MIME); see doc 16 |
| Product not appearing in list | `is_hidden = true` OR `companies.review_status != 'approved'` |
| Ad not showing on home | `is_active=false` OR outside `start_date`/`end_date` window |
| Webhook failing | Razorpay dashboard → Webhooks → most recent delivery; see doc 13 §7 |
| Docs page shows 401 | `DOCS_PASSWORD` secret unset or mismatched |
| New role doesn't take effect | Sign out + back in; `RoleContext` re-reads `user_roles` on session change |

## Backups & data ownership

- Lovable Cloud takes daily snapshots of Postgres. Restore via Cloud panel.
- Export to your laptop occasionally (`pg_dump` via `SUPABASE_DB_URL`).
- Storage objects are not in the snapshot — for critical assets, mirror to your own S3 / Drive.
- `auth.users` is owned by Cloud Auth; you cannot edit those rows directly. Use the Cloud → Users panel.

## Glossary of operator terms

- **Paid member** — `user_roles.role = 'paid_member'`. Same fee whether broker or not.
- **Broker** — A Paid member with `profiles.is_broker = true`. Listed on `/broker`.
- **Verified** — `companies.is_verified = true` AND/OR `profiles.verification_tier ≥ 'gst'`. Two independent badges.
- **Founder admin** — Hard-coded `admin@mddma.org`. Bypasses paid checks.
- **Live ticker** — Top-of-page scrolling band. Reads priced products. If empty, seed a product with `price_min` + `price_max`.
- **Role simulator** — Header dropdown for demos only. Server ignores it.

## What to revisit quarterly

- Run `supabase--linter` and resolve any new findings (doc 15).
- Confirm HIBP password protection still on (Cloud → Users → Auth).
- Audit `user_roles` for surprise admins.
- Bump dependencies (`bun update`) and run `bunx vitest run`.
- Update "Last verified" stamp at the top of doc 01.

## Single-pane release checklist

Before publishing to `mddma.org`:

1. ☐ `bunx vitest run` passes.
2. ☐ Spot-check `/`, `/directory`, `/products`, `/community`, `/documents` as Guest, Free, Paid, Admin (use simulator).
3. ☐ Live ticker shows ≥ 1 priced product.
4. ☐ Sitemap regenerated if new public routes were added.
5. ☐ No console errors on the home page.
6. ☐ `cloud_status` returns `ACTIVE_HEALTHY`.
7. ☐ Publish via Lovable.
