## Goal
Remove **Market Average price**, **Stock band**, and **Trend** completely from the platform — UI, code, and database. Connect MarketTicker to live data only (no sample fallback, no trend_direction).

## 1. Product Form (`src/pages/account/ProductsPage.tsx`)
- Remove the **Stock** dropdown (Available / Out of stock).
- Remove any **Market Average** and **Trend** fields/state.
- Stop sending `stock_band`, `trend_direction`, `market_avg_price` on insert/update.

## 2. Product Cards & Listings (UI)
Strip StockBadge, TrendBadge, and "Market Avg" line from:
- `src/components/products/RecentListings.tsx`
- `src/components/home/RecentListingsSection.tsx`
- `src/pages/Products.tsx`
- `src/pages/Storefront.tsx`
- `src/pages/ProductPage.tsx` — remove the entire "Market Signals" card; keep "Indicative price" line.
- `src/components/MarketSignals.tsx` — delete `StockBadge`, `TrendBadge`, the `MarketSignals` composite, "Market Avg" line in `PriceRange`. Keep `DemandIndicator` only if still referenced; otherwise delete the file.
- `src/components/behavioral/BehavioralCues.tsx` — `ScarcityCue` and `PriceAnchorCue` lose their `stockBand`/`trendDirection`/`marketAvgPrice` branches. Remove the cues entirely if they become empty; update call sites.
- `src/components/commodity/GuardedPrice.tsx` — drop any market-avg display.
- `src/components/products/VariantManager.tsx` — drop `stock_band` field from variant form.

## 3. MarketTicker — live-only, no trend
Update `src/components/layout/MarketTicker.tsx`:
- Remove `trend_direction` from select and from `ProductLite`.
- Remove `pctForProduct` / trend-based sign logic.
- Render each item as `<Name> · <Origin> · ₹min–₹max/<unit>` with a neutral indicator (or computed deterministic delta from `id` alone if a percent is still desired — confirm in implementation; default = drop the percent).
- Add `unit` to the select so the suffix is correct (no hardcoded `/kg`).
- No sample fallback: if the live query returns < 1 item, render nothing (current behavior already does this).

## 4. Sample data cleanup
- `src/data/productListings.ts`: remove `marketAvgPrice`, `stockBand`, `trendDirection`, `demandScore`, related label/color maps, and the `StockBand`/`TrendDirection`/`DemandLevel` types if unused.
- `src/lib/dataSource.ts`: drop the same fields from `ProductEntry` and any sample merger logic.
- Remove now-unused imports across the codebase.

## 5. Database migration
Drop columns and enums:
- `ALTER TABLE public.products DROP COLUMN stock_band, DROP COLUMN trend_direction, DROP COLUMN market_avg_price, DROP COLUMN demand_score;`
- `ALTER TABLE public.product_variants DROP COLUMN stock_band;`
- `DROP TYPE IF EXISTS public.stock_band;`
- `DROP TYPE IF EXISTS public.trend_direction;`

After migration, `src/integrations/supabase/types.ts` will regenerate; update `src/repositories/products.ts` `PRODUCT_COLUMNS` and `ProductRow` to drop the fields.

## 6. Docs
Light edits to remove stale references in:
- `src/content/docs/07-database-reference.md`
- `src/content/docs/11-decisions-log.md`
- `src/content/docs/14-roadmap-and-glossary.md`

## Files Touched
- migration file (new)
- `src/repositories/products.ts`
- `src/pages/account/ProductsPage.tsx`
- `src/pages/Products.tsx`, `src/pages/ProductPage.tsx`, `src/pages/Storefront.tsx`
- `src/components/products/RecentListings.tsx`, `VariantManager.tsx`
- `src/components/home/RecentListingsSection.tsx`
- `src/components/layout/MarketTicker.tsx`
- `src/components/MarketSignals.tsx` (likely deleted)
- `src/components/behavioral/BehavioralCues.tsx`
- `src/components/commodity/GuardedPrice.tsx`
- `src/data/productListings.ts`, `src/lib/dataSource.ts`
- 3 doc files

## Memory update
Update Core memory: remove "stock bands (High/Med/Low), demand trends" — Controlled Transparency now = price ranges only.
