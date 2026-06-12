## Goal

Borrow the District/Zepto product-tile *layout language* (dense, image-forward, 2-col mobile, chips overlaid on image, CTA bottom-right) and apply it consistently to every product grid in the app — without breaking our Controlled Transparency rule (no exact prices, no exact stock) and without reintroducing cart/RFQ behavior.

## What the new tile looks like

Mobile-first, 2 columns on phones, 3 on `sm+`, 4 on `lg+`.

```text
┌──────────────────────────┐
│                          │
│        PRODUCT           │  ← square image (1:1), object-cover
│         IMAGE            │     gallery dots bottom-left if multiple
│                          │     Veg/Origin chip top-left
│  • • · ·     [Origin]    │     Featured ★ top-right (existing)
├──────────────────────────┤
│ ₹180–210 / kg            │  ← PriceBand (range only, masked)
│ Commodity name           │  ← single line, truncate
│ Variant · Seller         │  ← muted, single line, truncate
│ ────────────────────────│
│ [WA] Enquire             │  ← full-width ghost button, WhatsApp deeplink
└──────────────────────────┘
```

Branded SKUs keep their "Buy retail" external CTA instead of Enquire (preserves current behavior).

## Design rules (non-negotiable)

- HSL semantic tokens only (navy/gold theme). No raw hex, no `text-white`.
- No exact price, no exact stock, no `2 left` style scarcity. Use existing `GuardedPrice` / `PriceBand`. Origin chip replaces stock chip on tile.
- No "ADD" / cart / RFQ. CTA is `wa.me` deeplink to seller (uses existing WhatsApp helper pattern from `WhatsappFab`).
- Featured ★ badge: keep current mobile-friendly version already in place on CategoryGrid; mirror the same treatment on product tiles.
- Image: `aspect-square` with `object-cover`; reuse `ProductMediaCarousel` only on detail page — tile shows static `image_url` with small gallery dots if `gallery.length > 0` (no swipe on tile, dots are decorative count indicator that links to detail).

## Files to add

1. `src/components/products/ProductTile.tsx` — the new shared tile. Props: `listing: ProductEntry`, `variant?: "grid" | "compact"`. Handles branded vs bulk internally (Enquire vs Buy retail). Uses `GuardedPrice` for masked price band, renders Origin chip, Featured badge, gallery-dot count.
2. `src/lib/whatsapp.ts` (only if a shared helper doesn't already exist — will check `WhatsappFab.tsx` first and reuse if so) — `buildEnquireUrl(seller, productName)` returning a `wa.me` URL with a prefilled, masking-safe message ("Hi, I'd like to enquire about <Product> listed on MDDMA").

## Files to update (swap card markup → `<ProductTile />`)

- `src/pages/Products.tsx` — category-detail grid (currently inline `<Card>` block, lines ~190–240). Grid stays `sm:grid-cols-2 lg:grid-cols-3`; on mobile becomes `grid-cols-2` (currently 1-col).
- `src/components/products/RecentListings.tsx` — replace whatever card it renders today.
- `src/components/home/today/` — wherever recent/featured listings render product cards (will audit `RecentListingsList.tsx` and any sibling that emits product cards).
- `src/pages/Storefront.tsx` — seller's product grid.
- `src/pages/BrandPage.tsx` — branded SKU grid (tile auto-renders the Buy-retail CTA for `isBranded`).

`CategoryGrid.tsx` is NOT changed — that's category tiles, not product tiles. `ListingRow.tsx` (row layout used inside the Home "Today" recent list) is NOT changed unless the answer above implied replacing rows with tiles; it stays as the dense list variant for narrow Home sections, and the new tile is used only where a *grid* renders today.

## Out of scope

- No new data fields, no schema migration, no repository changes.
- No changes to detail page, filters, search, pagination, or sorting.
- No animation library work — Tailwind transitions only (hover lift already on `card-hover`).
- No SEO impact (all product surfaces are already `noindex`).

## Acceptance

- On `/products?cat=…`, `/store/…`, `/brands/…`, and Recent Listings: tiles render in the new layout, 2-col on mobile, gold Featured chip on featured rows, Enquire button opens `wa.me` with prefilled text, branded SKUs show "Buy retail" instead.
- No exact price or stock count appears anywhere on a tile.
- Dark/light mode both clean; no hardcoded colors introduced.
