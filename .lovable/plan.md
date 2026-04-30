## Goal
Eliminate logical breaks where the UI still presents fabricated data (seller counts, hardcoded category lists, "25 Products", "₹1,000 Cr", routing mismatches) now that all dummy member/product data has been removed.

## Logical breaks found

### 1. "Browse by Category" shows fake seller counts (the user's main complaint)
`src/components/home/FeaturedCategoriesSection.tsx` hardcodes 7 categories with `count: 5/3/2…` "sellers". None of these counts come from the database.

### 2. Category links route to the wrong page
The same component links each tile to `/products/{slug}` (e.g. `/products/almonds`). But in `src/App.tsx` that route is `<Route path="/products/:slug" element={<ProductPage />} />` — a single-product detail page that calls `useProductBySlug("almonds")`. Since no product has slug `almonds`, the page renders "Product Not Found", even though there is an Almond product in the DB (slug `kgvpl-almond1`, category `Almond`). That's exactly the "no listing for almonds" bug.

The Products page (`/products`) does support filtering via `?cat=`, so category tiles should link to `/products?cat=Almond` instead.

### 3. "View All 25 Products" is a fabricated number
Same file, footer link says "View All 25 Products". Real count is 2.

### 4. Hero stats include a made-up "25+ Commodity Categories"
`src/components/home/HeroSection.tsx` lines 127–138 still shows: `1930s Established`, `₹1,000 Cr Annual Trade`, `25+ Commodity Categories`. The "25+" is dummy; "₹1,000 Cr" is also unverifiable.

### 5. Products page filter dropdown uses a hardcoded category taxonomy
`src/pages/Products.tsx` populates the Category select from `productCategories` (Dry Fruits / Dates / Seeds / Spices). Live products use categories like `Almond` and `nuts`, which never match — so the filter silently breaks.

### 6. Directory page filters by hardcoded `tradingAreas`
`src/pages/Directory.tsx` uses the `tradingAreas` constant (APMC Vashi, Masjid Bunder, …). These won't match live company `city`/`state` values either.

### 7. NewsSection still renders `sampleNews`
`src/components/home/NewsSection.tsx` imports `sampleNews` from `sampleData.ts` and shows 3 dummy news items as if real.

### 8. Directory loose ends
The legacy `import { tradingAreas } from "@/data/sampleData"` continues to work but presents fictitious area chips.

## Fix plan

1. **Replace the hardcoded category section with live data.**
   In `FeaturedCategoriesSection.tsx`, fetch distinct `category` values + counts from `products` (via `useProducts()` or a small new hook), show only categories that actually have listings, and link each tile to `/products?cat={category}`. If no products exist, render a friendly empty state ("Categories appear once sellers list products"). Replace the "View All 25 Products" footer with "View All Products" (no fake number) — or show the live total.

2. **Fix Products page filter to use live categories.**
   In `src/pages/Products.tsx`, derive the category dropdown from `listings` (`Array.from(new Set(listings.map(l => l.category)))`) instead of `productCategories`. Also change the filter predicate from `pl.variant === categoryFilter` to `pl.category === categoryFilter` (currently filters the wrong field, contributing to the "no results" symptom). Same for origin: derive from live data instead of the static `origins` constant — or keep the static list but mark this in a comment.

3. **Honor the `?cat=` query param after the fix** so category-tile clicks pre-filter the listing.

4. **Clean up Hero stats.**
   Remove the fabricated "25+ Commodity Categories" tile in `HeroSection.tsx`. Keep "Established 1930s" (factual brand line) and either drop "₹1,000 Cr" or relabel it as an aspirational tagline elsewhere — confirm with user (see question below).

5. **Replace NewsSection dummy data.**
   Either (a) hide `NewsSection` until a real news/circulars feed is wired, or (b) point it at the live `circulars` table via the existing repository. Recommend (b) — show the latest 3 published circulars.

6. **Replace Directory area filter with live data.**
   Derive area options from distinct `city`/`state` values returned by `useLiveCompanies` instead of `tradingAreas`.

7. **Optional cleanup.**
   Once nothing imports them, remove `productCategories`, `commodityCategories`, `tradingAreas`, and `sampleNews` from `src/data/sampleData.ts` so they can't sneak back in.

## Question for you

- For the Hero stat tiles, do you want me to (a) keep "Established 1930s" only, (b) keep "1930s" + "₹1,000 Cr Annual Trade" as marketing copy, or (c) remove the entire stats strip until real metrics are available?

## Files to edit
- `src/components/home/FeaturedCategoriesSection.tsx`
- `src/pages/Products.tsx`
- `src/components/home/HeroSection.tsx`
- `src/components/home/NewsSection.tsx`
- `src/pages/Directory.tsx`
- `src/data/sampleData.ts` (remove now-unused exports)
