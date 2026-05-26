# Browse categories — use real images on home

Replace the emoji-only tiles in `src/components/home/today/CategoryGrid.tsx` with actual images, matching the pattern already used in `src/components/home/FeaturedCategoriesSection.tsx` and `src/components/products/CategoryGrid.tsx`.

## Changes

**`src/components/home/today/CategoryGrid.tsx`**
- Render each tile as a small card with an image on top and the name + listing count below.
- Image source priority:
  1. `cat.image_url` (admin-uploaded) → `<img>` with `object-cover`.
  2. Fallback → `<CommodityImage commodity={cat.name} aspect="1/1" rounded={false} />` (uses Unsplash map + emoji/gradient fallback).
- Keep the HOT/Featured ribbon (top-left, over the image).
- Keep grid: `grid-cols-3 sm:grid-cols-6`, rounded-2xl card, border, hover lift.
- Drop the large center emoji; emoji only survives inside CommodityImage's error fallback.
- Tile layout:
  ```text
  ┌──────────────┐
  │   [image]    │  aspect-square
  ├──────────────┤
  │ Almonds      │  text-[12px] font-semibold
  │ 12 listings  │  text-[10px] muted
  └──────────────┘
  ```

## Out of scope
- No schema, repository, or query changes (`image_url` already exists on `product_categories`).
- No changes to `/products` page CategoryGrid or `FeaturedCategoriesSection` (already image-based).
- No new image uploads — admins continue to manage `image_url` via existing CMS.
