## Goal
When a seller uploads a cover image, additional gallery images, or a video, that media must actually appear:
- on the **Marketplace product card** (`/products`)
- on the **Recent Listings cards** on the homepage
- on the **Storefront catalog** rows
- on the **Product detail** page

The card should **auto-rotate** through all uploaded media (carousel), and a video should play inline on the detail page.

## Why it's broken today
- `liveProductToEntry` in `src/lib/dataSource.ts` drops `image_url`, `gallery`, and `video_url` — so the UI never sees them.
- `Products.tsx`, `RecentListingsSection.tsx`, and `ProductPage.tsx` render `<CommodityImage commodity={name} />`, which always shows a stock photo keyed off the product name. Seller media is never read.
- `Storefront.tsx` already has `image_url` in scope but only uses it inside the cart payload.

## Changes

### 1. Surface media in the data layer
- Extend `ProductListing` (`src/data/productListings.ts`) with optional `imageUrl`, `gallery`, `videoUrl`.
- Update `liveProductToEntry` (`src/lib/dataSource.ts`) to copy these fields from the DB row.
- Update the `LiveProduct` type in `Storefront.tsx` to include `gallery` and `video_url` and select them in the query.
- Update `ProductPage.tsx` to read `product.gallery` and `product.video_url` (already returned by `getProductBySlug`).

### 2. New component: `ProductMediaCarousel`
Path: `src/components/commodity/ProductMediaCarousel.tsx`

Behavior:
- Builds a media list: `[image_url, ...gallery, video_url]`, filtering nulls.
- If the list is empty → falls back to existing `<CommodityImage commodity={name} />` (so legacy listings still look fine).
- If the list has one item → render that item, no controls.
- If multiple → auto-advance every ~3.5 s (pause on hover/focus, respect `prefers-reduced-motion`).
- Small dot indicators along the bottom; left/right chevrons appear on hover for desktop.
- Renders a `<video muted loop playsInline>` with a play overlay icon for video slides; on the card it auto-plays muted, on the detail page it shows native controls.
- Same aspect API as `CommodityImage` (`16/10`, `1/1`, etc.) so it slots into existing layouts without CSS changes.
- Uses semantic tokens (`bg-card`, `text-foreground`, `border-border`) — no hardcoded colors.

### 3. Wire the carousel into existing surfaces
- **`src/pages/Products.tsx`**: replace the `<CommodityImage>` inside each card with `<ProductMediaCarousel images={[image, ...gallery]} videoUrl={...} commodity={...} aspect="16/10" />`. Keep the origin badge overlay.
- **`src/components/home/RecentListingsSection.tsx`**: same swap. Add `image_url, gallery, video_url` to its select.
- **`src/pages/ProductPage.tsx`**: add a media block above the "Product Overview" card using the same carousel at `aspect="16/10"`, with native video controls enabled.
- **`src/pages/Storefront.tsx`** *(light touch)*: add a small thumbnail column to the catalog table using the carousel at `aspect="1/1"` and a fixed `w-16` so the table layout is unchanged otherwise.

### 4. Out of scope
- Lightbox / fullscreen viewer.
- Drag-to-reorder gallery (already deferred).
- Video transcoding / poster generation — we'll use the first frame the browser produces and a play icon overlay.
- Changes to the seller upload form (already shipped previously).

## Files to edit / add
- `src/components/commodity/ProductMediaCarousel.tsx` *(new)*
- `src/data/productListings.ts`
- `src/lib/dataSource.ts`
- `src/pages/Products.tsx`
- `src/pages/ProductPage.tsx`
- `src/pages/Storefront.tsx`
- `src/components/home/RecentListingsSection.tsx`

No DB or RLS changes — `gallery` and `video_url` already exist and are publicly readable via the existing products SELECT policy.
