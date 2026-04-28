# MDDMA — Code Architecture Refactor Plan

A creative-process pass (DISCOVER → DIVERGE → SYNTHESIZE → CRAFT → POLISH) on the codebase as it stands at v3.1.2.

---

## 1. DISCOVER — what the audit found

A scan of `src/` (≈9.1k LOC of pages, ≈6.9k LOC of components) surfaced five structural issues holding the platform back:


| #   | Symptom                                   | Evidence                                                                                                                                                                                                                    |
| --- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **No data-fetching layer**                | `QueryClientProvider` is mounted in `App.tsx`, but **zero** files use `useQuery`/`useMutation`. Every page hand-rolls `useEffect` + `useState` + `try/catch`.                                                               |
| 2   | **Sample data leaks everywhere**          | 22 files import from `@/data/sampleData` or `@/data/productListings` directly. `directoryAdapter.ts` exists but is only used in 4 surfaces. This is the root cause of the *"KGVPL doesn't show in directory"* class of bug. |
| 3   | **Supabase calls scattered**              | 11+ files call `supabase.from(...)` inline. No repository, no shared error handling, no shared types beyond auto-generated.                                                                                                 |
| 4   | **Doc pages bloat the bundle**            | 8 doc pages (SOW, BRD, PRD, FSD, SDD, TSD, MVPCanvas, SalesPitch, ChangeLog) total **~3,800 LOC of static prose** living inside React components. They ship in the main bundle and slow every build.                        |
| 5   | **Inconsistent layout & oversized pages** | 11 pages skip `<Layout>`. `AdminModeration.tsx` is 596 LOC, `Storefront.tsx` 431, `ProductPage.tsx` 309 — each mixes fetching, mutations, and presentation.                                                                 |


architecture blueprint

---

## 2. SYNTHESIZE — the target architecture

A clean five-layer stack. Each layer only knows about the layer below it.

```text
┌─────────────────────────────────────────────────┐
│  Pages          (routing + composition only)    │
├─────────────────────────────────────────────────┤
│  Feature Modules   src/features/<domain>/...    │
│   ├─ components/   (presentational)             │
│   ├─ hooks/        (useXxxQuery, useXxxMutate)  │
│   └─ types.ts                                   │
├─────────────────────────────────────────────────┤
│  Repositories      src/repositories/*.ts        │
│   one file per table — getById, list, upsert    │
├─────────────────────────────────────────────────┤
│  Data Sources      live (Supabase) + sample     │
│   merged via src/lib/dataSource.ts adapter      │
├─────────────────────────────────────────────────┤
│  Supabase Cloud                                 │
└─────────────────────────────────────────────────┘
```

Feature folders proposed: `directory`, `storefront`, `products`, `rfq`, `community`, `admin`, `account`, `documents`.

---

## 3. CRAFT — the work, in five focused phases

Phases are independently shippable. Nothing changes user-visible behaviour unless explicitly noted.

### Phase A — Repository + React Query foundation (no UI changes)

- Create `src/repositories/` with one module per table: `companies.ts`, `products.ts`, `rfqs.ts`, `inquiryProducts.ts`, `circulars.ts`, `advertisements.ts`, `posts.ts`, `comments.ts`, `profiles.ts`, `userRoles.ts`. Each exports typed `list`, `getById`, `create`, `update`, `remove`.
- Centralise error handling through existing `src/lib/errors.ts`.
- Add `src/hooks/queries/` with `useCompanies`, `useCompany(slug)`, `useProducts`, `useRfqs`, `useCirculars`, `useAds`, `usePosts`. Built on `@tanstack/react-query` with sensible `staleTime` defaults (60s for catalogue, 10s for RFQ inbox).
- Define query-key factory: `qk.companies.list({filters})`, `qk.companies.bySlug(slug)` etc.

### Phase B — Unified data source (kills the KGVPL-class bug for good)

- Promote `directoryAdapter.ts` into `src/lib/dataSource.ts` as the **only** allowed reader of sample data.
- Rule: nothing outside `dataSource.ts` may `import "@/data/sampleData"` or `"@/data/productListings"`. Enforced by an ESLint `no-restricted-imports` rule.
- `dataSource` merges live Supabase rows with the sample seed, deduping by slug, live-wins-on-conflict. All 22 importers migrate to consume `useCompanies()` / `useProducts()` from Phase A.

### Phase C — Feature-folder migration of the four oversized surfaces

Move and split, no behaviour change:

- `pages/Storefront.tsx` (431) → `features/storefront/{StorefrontPage, StorefrontHeader, ProductGrid, AddToCartButton}.tsx`
- `pages/account/AdminModeration.tsx` (596) → `features/admin/{tabs/CircularsTab, tabs/AdsTab, tabs/RfqTab, tabs/UsersTab}.tsx`
- `pages/ProductPage.tsx` (309) → `features/products/{ProductPage, VariantPicker, PriceBand, RfqCta}.tsx`
- `pages/account/RFQInbox.tsx` (229) → `features/rfq/{InboxPage, InboxList, InboxRow, BuyerWhatsAppButton}.tsx`

Each new file caps at ~150 LOC. Pages become 30-80 LOC routing shells.

### Phase D — Docs out of the bundle

- Move all prose from SOW/BRD/PRD/FSD/SDD/TSD/MVPCanvas/SalesPitch/ChangeLog into `src/content/docs/*.mdx`.
- One generic `<DocPage slug>` component lazy-loads the MDX via `React.lazy` + `Suspense`.
- Routes registered from a single `docsManifest.ts` (title, slug, password-gated bool).
- Expected: drop ~3,500 LOC from the main chunk; faster first paint on `/`.

### Phase E — Polish

- Wrap every page in `<Layout>` (fix the 11 doc pages that skip it).
- Add `<ErrorBoundary>` around `<Routes>` in `App.tsx` with a branded fallback (navy + gold).
- Replace ad-hoc skeletons with a shared `<SectionSkeleton>` and `<CardGridSkeleton>`.
- Add `src/lib/__tests__/dataSource.test.ts` covering live-wins-on-conflict and the KGVPL regression scenario.
- ESLint rules: `no-restricted-imports` for sample data + raw `supabase.from` outside `repositories/`.

---

## 4. POLISH — guardrails so this doesn't decay

1. **Import rules** prevent regressions (sample data, raw Supabase).
2. **One file = one concern.** Pages route, features render, hooks fetch, repos talk to DB.
3. **Query keys** in a single factory — refactors stay safe.
4. **Docs as content**, not code.
5. **Layout always present** — header / ticker / trust strip are part of the brand promise.

---

## Out of scope (called out, not done here)

- Visual redesign / brand system pass — separate workstream.
- Behavioral Intelligence Layer external API (TECH-001).
- Edge function consolidation.
- Roles/RLS audit — already solid; not touched.

---

## Suggested execution order

A → B → C → D → E. Phases A + B unlock everything else and resolve the live-data invisibility class of bugs immediately. Phases C and D are pure cleanup with measurable bundle wins. Phase E locks the gains.

Approve this plan and I'll start with **Phase A (repositories + React Query foundation)**, which is invisible to users but pays back on every subsequent change.  
  
Keep in mind users are non technical non tech people who are majority boomers. Admin to have full fledeged ecommerce headless cms similar to Payload Headless CMS for Ecommerce 