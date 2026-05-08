## Goal

Rework `/products` so users see **product categories first** (Almond, Pista, Cashew, …). Clicking a category drills into its **listings** (Almond Variety 1, Pista Jumbo, …). Filters apply within the category, not across the whole catalog. Below the category grid, show a **Recent Listings** strip across all categories.

## New flow

```text
/products                       → Category grid + Recent listings
/products?cat=Almond            → Listings within Almond
/products?cat=Pista&origin=Iran → Filtered listings within Pista
```

Single route, two visual modes driven by the `cat` query param. Back button works naturally.

## Layout

### Mode A — Browse (no `cat` selected)

1. **Hero header**: "Browse Categories"
2. **Search bar**: searches categories (name + aliases like "Kaju" → Cashew). Submitting a free-text search that matches nothing in categories falls through to listing search by switching to Mode B with `q=`.
3. **Category grid** from `product_categories` (active only, sorted by `sort_order`):
   - Image (`image_url` with fallback)
   - Name + short description
   - Live count of listings in that category
   - Featured categories pinned on top via `is_featured`
   - Click → navigate to `?cat=<name>`
4. **Ad banner** (existing `category-banner` placement) between sections
5. **Recent Listings section** below the grid:
   - Heading: "Recent Listings" + small "View all" hint
   - Latest 8–12 products across all categories (existing card design)
   - Sorted by `created_at desc`, `is_featured` first (already the default in `listProducts`)
   - Each card: same RFQ button, GuardedPrice, StockBadge, etc.
   - On mobile: horizontal scroll; on desktop: 3–4 col grid

### Mode B — Category detail (`?cat=<name>`)

- Breadcrumb: `Categories / Almond` + "Back to categories" button
- Category header strip: image thumb + name + description + listing count
- Filters reduced to within-category:
  - Search (matches listing name / variant)
  - Origin (only origins present in this category's listings)
  - Stock level
- Listings grid (existing card design, untouched)
- Empty state: "No listings yet in <category>"

## Implementation notes (technical)

- **Single page** `src/pages/Products.tsx` — branch on `searchParams.get("cat")`.
- New components:
  - `src/components/products/CategoryGrid.tsx` — Mode A grid with counts.
  - `src/components/products/RecentListings.tsx` — recent products strip; takes `limit` prop.
- Reuse `useProductCategories({ activeOnly: true })` for Mode A.
- Reuse `useProducts({ category })` for Mode B (already supports server-side filtering).
- Recent listings: call `useProducts()` (no filter) and slice to N most recent. No new query needed.
- Listing counts per category: add `countProductsByCategory()` in `src/repositories/products.ts` returning `Record<string, number>`. One grouped count query.
- Alias-aware category search in Mode A: filter `curatedCats` by name + `aliases` array.
- URL state: clicking a category card sets `?cat=<name>`; "Back to categories" clears all query params.
- Keep RFQ modal, ad banner, cart FAB integrations exactly as-is.
- No DB changes. No backend changes. No changes to product detail pages, Storefront, Home, Header, Footer.

## Files to edit / add

- Edit: `src/pages/Products.tsx` (split into two render modes; mount `RecentListings` in Mode A)
- Add: `src/components/products/CategoryGrid.tsx`
- Add: `src/components/products/RecentListings.tsx`
- Edit: `src/repositories/products.ts` (add `countProductsByCategory`)

## Out of scope

- No DB schema changes
- No changes to homepage "Featured Categories" or "Recent Listings" sections
- No changes to category admin CMS
- Docs / memory updates not required for this UI rework