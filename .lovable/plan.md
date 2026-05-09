
# Refactor Plan — Tech Debt + Dead Code Trim

Scope you picked: clean up tech debt + trim unused features. Constraint: **preserve all DB data**. No feature changes visible to end users.

## What I found

**Code referencing tables that don't exist in the DB** (stubs that silently fail):
- `src/lib/tradeSignals.ts` → reads `seller_trade_signals` (table missing)
- `src/lib/kyc.ts` + `src/components/account/KYCDocsSection.tsx` + `VerificationCenter.tsx` → reads `kyc_documents` (missing)
- `src/lib/membership.ts` reads `memberships` (missing — table exists in TS types only)
- `supabase/functions/promote-verification` references `verification_submissions` (missing)

**Sample/dummy data still wired into live pages:**
- `src/data/sampleData.ts` + `src/data/productListings.ts` consumed by `Storefront`, `MembershipPlans`, `MarketSignals`, `pitch/PitchSection`, `GuardedPrice`, `dataSource.ts`
- `dataSource.ts` still has merge-with-demo branches even though the memo says "no dummy fallback"

**Pages/components not linked from anywhere** (dead routes / orphan components):
- `src/components/pitch/PitchSection.tsx` — only imported by itself; `/pitch` route already redirects to `/documents/vision-and-pitch`
- `src/components/MarketSignals.tsx` — no live consumer
- `src/components/home/IndustryFeed.tsx`, `MarketplacePulse.tsx`, `AdBanner.tsx`, `FooterCTA.tsx` — verify against `Index.tsx` before removing (some may be legacy)
- Legacy redirect routes (`/pitch`, `/mvp-canvas`, `/brd`, `/sow`, `/prd`, `/fsd`, `/sdd`, `/tsd`, `/changelog`) — kept as redirects, fine to leave

**Pages with no data behind them** (look real, render empty):
- `Circulars` → `circulars` table has 0 rows
- `Community` → `posts` has 0 rows (works, just empty)
- `Market`, `Broker`, `Dashboard`, `About`, `Forms` — review whether each is still in product scope per memory; `Dashboard` is 361 lines and not linked from header

**Schema-level cleanup candidates** (preserving all rows):
- View `public_profiles` — confirm consumers, drop if unused
- `inquiry_products` and `rfq_responses` have 0 rows but are part of the live RFQ contract — keep
- `companies.review_status`, `is_hidden`, `membership_tier` — all in use, keep

**Code structure issues:**
- `AdminModeration.tsx` is 767 lines — split per resource (companies / categories / circulars / ads / users)
- `Storefront.tsx` (411), `ProductsPage` (420), `About` (380), `Dashboard` (361) are large; extract sub-components
- `dataSource.ts` carries a `source: "live" | "demo"` field that no UI uses — remove
- `tradeSignals` / `kyc` libs are dead — delete or actually back them with tables

## Decision needed before I implement

The `kyc_documents` / `seller_trade_signals` / `memberships` / `verification_submissions` tables are referenced in code but missing in DB. Two ways to resolve:

- **A. Delete the dead code** — drop `lib/kyc.ts`, `lib/tradeSignals.ts`, `KYCDocsSection`, `VerificationCenter`, `promote-verification` edge fn, and the dead `lib/membership.ts` accessors. Simpler. Loses the verification UI scaffolding.
- **B. Create the tables** — add migrations to make these real. Bigger lift. Turns scope into "schema redesign," which you said no to.

I'll assume **A** unless you say otherwise.

## Plan

### Phase 1 — Delete dead code (no DB changes)
1. Remove `src/data/sampleData.ts` and `src/data/productListings.ts`. Update consumers (`Storefront`, `MembershipPlans`, `MarketSignals`, `PitchSection`, `GuardedPrice`, `dataSource.ts`) to either use live data or hardcoded UI-only constants where appropriate.
2. Delete `src/components/pitch/PitchSection.tsx` and `src/components/MarketSignals.tsx` (no live consumer).
3. Delete `src/lib/tradeSignals.ts`, `src/lib/kyc.ts`, `src/lib/__tests__/kyc.test.ts`, `src/lib/__tests__/tradeSignals.test.ts`. Remove imports in `SellerScoreboard`, `SellerSignals`, `account/VerificationCenter`, `account/KYCDocsSection`.
4. Delete `src/components/account/KYCDocsSection.tsx`, `src/pages/account/VerificationCenter.tsx`, the `/account/verify` route, the verification dropdown link in `Header.tsx`.
5. Delete `supabase/functions/promote-verification/` and remove its `[functions.promote-verification]` block in `supabase/config.toml`.
6. Strip the `source: "live" | "demo"` plumbing from `lib/dataSource.ts` — it's never read.
7. Decide per-page (need your call): keep or drop `About`, `Forms`, `Market`, `Broker`, `Dashboard`, `Install` — see "Open questions" below.

### Phase 2 — Tighten existing code
1. Split `AdminModeration.tsx` (767 lines) into:
   `pages/account/moderation/CompaniesTab.tsx`, `CategoriesTab.tsx`, `CircularsTab.tsx`, `AdsTab.tsx`, `UsersTab.tsx`, with a thin parent.
2. Extract sub-components from `Storefront.tsx`, `ProductsPage.tsx`, `Dashboard.tsx` (header / filters / list / detail panels).
3. Consolidate the two `useToast` exports (`hooks/use-toast.ts` and `components/ui/use-toast.ts` — pick one re-export).
4. Replace ad-hoc `as unknown as` casts in `companies.ts` (uses `as never` then `(q as any).eq`) with proper typed query builders now that all tables are in `types.ts`.
5. Verify every `from("...")` call hits a real table (post-cleanup) and remove the `as never` laundering pattern in `tradeSignals`/`kyc` (those files will be gone).

### Phase 3 — DB hygiene (data-preserving migrations)
1. Drop unused view `public_profiles` if no consumer in code (verify first).
2. Drop unused tables that exist only in TS types but never get rows and have no UI: confirm against `types.ts` — likely candidates: `memberships`, `seller_trade_signals`, `verification_submissions`, `kyc_documents` (some of these may not exist in DB at all; if so just remove from generated types — actually `types.ts` is auto-generated, so removing tables in DB will remove them from types automatically).
3. Add missing `updated_at` triggers anywhere absent (audit `companies`, `products`, `profiles`, `posts`, etc.).
4. Re-run `supabase--linter` and fix critical findings.

### Phase 4 — Verify
- Build clean.
- Run vitest.
- Smoke-test: home, /directory, /directory/:slug, /store/:slug, /products, /products/:slug, /community, /circulars, /account/* as paid_member and admin via role simulator.
- Confirm RFQ create still works (cart → drawer → submit).

## Open questions

I need 5 quick answers before I start swinging the axe:

1. **Verification flow** — option A (delete it entirely) or B (build the table)? I'm recommending A.
2. **Pages to keep**: `About`, `Forms`, `Market`, `Broker`, `Dashboard`, `Install` — which of these are still in scope? `Dashboard` is 361 lines but not in the nav; `Market` is in nav but the data sources are stubs.
3. **Sample data** — OK to delete `sampleData.ts` / `productListings.ts` outright? Pages that currently read them will switch to live DB and may show empty states until rows are seeded.
4. **`/pitch` and other legacy redirect routes** — keep as redirects (low cost) or drop entirely?
5. **Home sections** — `IndustryFeed`, `MarketplacePulse`, `AdBanner`, `FooterCTA` — confirm each is still mounted in `Index.tsx` and which (if any) you want trimmed.

Answer those and I'll execute Phase 1 → 4 in order. No DB destructive ops without an explicit "go" — every drop will be a reviewed migration.
