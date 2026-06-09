## Goal
Remove the RFQ (Request for Quote) feature end-to-end from the app: UI, routes, cart, contexts, queries, repositories, types references, and database tables. Sellers and buyers will continue to interact via the directory / storefront / contact details (per role), but no RFQ submission, RFQ cart, or RFQ inbox will exist anywhere.

## Scope of removal

### 1. UI pages & components (delete)
- `src/pages/account/RFQInbox.tsx`
- `src/components/RFQModal.tsx`
- `src/components/cart/CartDrawer.tsx`
- `src/components/cart/CartFab.tsx`
- `src/contexts/CartContext.tsx` (the cart exists solely to assemble multi-item RFQs)

### 2. UI wiring (edit, remove all RFQ/cart references)
- `src/App.tsx` — drop `<CartFab/>` and `<CartDrawer/>`.
- `src/providers/AppProviders.tsx` — drop `CartProvider` if present.
- `src/routes.tsx` — remove `/account/rfqs` route + lazy import.
- `src/components/layout/Header.tsx` — remove "RFQ Center" dropdown item and `Inbox` import.
- `src/components/layout/MobileBottomTabBar.tsx` — replace "RFQs" tab with another existing tab (proposal: "Brands" → `/brands`) so we keep 5 tabs.
- `src/components/products/ListingRow.tsx`, `src/pages/ProductPage.tsx`, `src/pages/Storefront.tsx`, `src/pages/Products.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Index.tsx`, `src/pages/About.tsx`, `src/pages/Apply.tsx`, `src/pages/Install.tsx`, `src/pages/MembershipPlans.tsx`, `src/components/account/MembershipStatusCard.tsx`, `src/components/home/today/AuthorityBlurb.tsx`, `src/components/home/today/MembershipCTA.tsx`, `src/components/home/today/TodayHeader.tsx` — strip RFQ buttons, copy, counters, and any "Send RFQ"/"Post RFQ"/"RFQ Center" links. Replace primary contact CTA on product/storefront with a member-only "View seller contact" reveal (no new logic — uses the existing contact fields already shown to members).

### 3. Data layer
- `src/lib/queryKeys.ts` — remove `qk.rfqs`.
- `src/contexts/AuthContext.tsx`, `src/contexts/RoleContext.tsx` — remove any RFQ counts / RFQ-related role gates (keep role enum unchanged).
- `src/integrations/supabase/types.ts` — auto-regenerated after migration; no manual edit needed.

### 4. Database (single migration)
Drop in dependency order:
```sql
DROP TABLE IF EXISTS public.inquiry_products CASCADE;
DROP TABLE IF EXISTS public.rfq_responses CASCADE;
DROP TABLE IF EXISTS public.rfqs CASCADE;
DROP FUNCTION IF EXISTS public.trg_rfqs_set_priority_score() CASCADE;
```
The `priority_score` trigger function is RFQ-specific and goes with the tables.

### 5. Static assets / metadata
- `index.html`, `public/manifest.json`, `scripts/prerender-public.ts` — remove RFQ shortcuts, OG copy, and any prerender entries referencing RFQ.

### 6. Documentation
- Public docs (`src/content/docs/00..06`): edit to remove RFQ as a feature, replacing with the simpler "verified directory + direct contact" flow.
- Internal docs (`supabase/functions/get-internal-doc/content/*.md`): same treatment, then run `bunx tsx scripts/build-internal-docs-bundle.ts` to regen the bundle.
- Update memory: edit `mem://features/rfq-engine` to a tombstone ("RFQ removed — do not reintroduce") and update `mem://index.md` Core line that mentions multi-item RFQ Cart.

## Out of scope / preserved
- Member directory, storefronts, products, brands, circulars, community, ads, admin moderation, market signals — all kept as-is.
- `companies.email/phone/gstin` admin RPC and contact reveal for members stays.
- `profiles.rfq_count` / `profiles.rfq_response_rate` columns: leave the columns (cheap, avoids touching the privilege-escalation trigger), just stop reading/writing them from the client. If you'd rather drop them too, say so and I'll add it to the migration.

## Confirmation needed before I build
1. OK to drop the three DB tables (`rfqs`, `rfq_responses`, `inquiry_products`) and lose all historical RFQ data? There is no export step in this plan.
2. OK to replace the mobile "RFQs" tab with "Brands"? (Alternative: "Market".)
3. Keep `profiles.rfq_count` / `rfq_response_rate` columns, or drop them too?
