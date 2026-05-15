# Mobile-first / PWA-first hardening

The screenshots show three classes of issues on a ~390px viewport:

1. The almond hero image and the "Featured members" card extend past the right edge.
2. The "Recent listings" product image renders enormous and clipped — its carousel/image is not respecting the card width.
3. General horizontal scroll bleed across sections.

Root cause is a mix of: missing `min-w-0` on flex/grid children that wrap images, intrinsic-sized media inside `ProductMediaCarousel`, and no global `overflow-x` guard on `<html>/<body>`. The app is not yet truly mobile-first — it's desktop-first with sm/lg breakpoints layered on.

This plan fixes overflow now and elevates the whole app to PWA-first mobile-first.

## Scope

### 1. Global overflow + viewport guards (`src/index.css`, `index.html`)
- Add `html, body { overflow-x: hidden; max-width: 100vw; }` and `#root { overflow-x: clip; }`.
- Verify `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` is present in `index.html`.
- Add `img, video { max-width: 100%; height: auto; }` base rule so no media can blow out its container.

### 2. Fix media containers
- `src/components/commodity/ProductMediaCarousel.tsx`: ensure root has `w-full max-w-full overflow-hidden` and inner `<img>/<video>` use `w-full h-full object-cover`. Audit aspect-ratio wrapper.
- `src/components/commodity/CommodityImage.tsx`: same — clamp to parent width.
- `src/components/products/RecentListings.tsx`: card grid children need `min-w-0`; the `relative` media wrapper needs `w-full overflow-hidden`.

### 3. Mobile-first grid/layout audit
For each home section + key list pages, switch from desktop-first to mobile-first classes and add `min-w-0` to all grid/flex children that contain text or media:
- `FeaturedCategoriesSection` (already 2-col on mobile — verify cards don't overflow)
- `RecentListings`
- `WhyMddmaSection`
- `Directory`, `Products`, `Brands`, `Storefront`, `MemberProfile`, `BrandPage`, `ProductPage` cards
- `Header` / `MarketTicker` — confirm ticker uses `overflow-hidden` properly and header chips wrap on small screens
- `CartDrawer`, `RFQModal` — verify they respect `100vw` and use `max-w-[calc(100vw-2rem)]`

### 4. Touch + safe-area polish (mobile-first defaults)
- Ensure all sticky/fixed elements (Header, CartFab, MarketTicker) use `pt-safe`/`pb-safe` already defined.
- Bump min tap target to 44px on primary CTAs where smaller (`h-9` → `h-11` on mobile via `h-11 sm:h-9` where appropriate).
- Confirm `CartFab` doesn't overlap bottom content (add `pb-20 sm:pb-0` to last section if needed).

### 5. PWA-first verification (no new SW work needed)
The app already ships `public/manifest.json` and an `InstallAppButton`. Confirm:
- Manifest has `display: "standalone"`, theme_color, icons (already present ✓).
- `index.html` has `apple-mobile-web-app-capable`, `apple-touch-icon`, `theme-color` meta tags. Add any missing.
- `useInstallPrompt` covers iOS Safari, Android, in-app browsers (already present ✓).
- No service worker is added (per project PWA guidance — manifest-only install is the right call here).

### 6. Verification
- Use `browser--set_viewport_size` at 375×812 and 390×844, navigate `/`, `/products`, `/directory`, `/brands`, `/account/profile`, capture screenshots, confirm zero horizontal scroll.
- Quick desktop regression at 1280×720.

## Out of scope
- No backend, RLS, or data-model changes.
- No new pages or features.
- No service-worker / offline caching (intentional — manifest-only PWA per project guidance).
- No redesign of sections — only responsiveness + overflow fixes.

## Technical notes
- `min-w-0` on flex/grid children is the canonical fix for "child with `truncate` or media still overflows parent" — Tailwind grid items default to `min-width: auto`.
- `overflow-x: clip` on `#root` is preferred over `hidden` (doesn't create a scroll container, preserves sticky positioning).
- Mobile-first means base classes target ~360px; `sm:`/`md:`/`lg:` only widen, never narrow.
