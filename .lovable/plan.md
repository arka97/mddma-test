## Goal
Allow sellers to upload up to **4 images** and **1 video** per product on the seller's Add/Edit product form (`/account/products`).

## Current state
- `products.image_url` (single image) + `products.gallery text[]` (already exists, unused in UI).
- No video column yet.
- `product-images` storage bucket is public; `uploadFile` helper supports it.
- Single-image uploader exists in `src/pages/account/ProductsPage.tsx`.

## Changes

### 1. Database (migration)
- Add `video_url text` column to `products`.
- Keep `gallery text[]` for image gallery (image_url stays as the primary/cover).
- Add a CHECK on `gallery` length ≤ 3 (so cover + gallery = 4 total images max).
  - Use a validation trigger (project rule: no time/logic CHECK constraints; but for simple array length CHECK is fine — will use a trigger for consistency).
- No RLS changes; existing seller policies cover the new column.

### 2. Storage
- Reuse the existing public `product-images` bucket for both images and the video (it already accepts any mime type).
- Extend `uploadFile` to accept an optional `accept` arg or just rely on caller-side validation.

### 3. Seller form (`src/pages/account/ProductsPage.tsx`)
Replace the single "Image" field with a **Media** section:

- **Cover image** (required-ish) — current behavior, sets `image_url`.
- **Additional images** (up to 3) — multi-file picker writing to `gallery[]`. Shows thumbnails with a remove (X) button.
  - Client-side guard: total images (cover + gallery) ≤ 4. Disable the upload button when full.
  - Validate file type (image/*) and size (≤ 5 MB each).
- **Product video** (optional, 1 max) — single file picker writing to `video_url`.
  - Validate `video/*` and size (≤ 50 MB).
  - Preview using `<video controls>` with a remove button.

Submit payload includes `gallery` and `video_url`.

### 4. Buyer-facing display (light touch)
- `src/pages/Products.tsx` cards: keep using `image_url` (no change).
- `src/pages/ProductDetail.tsx` (if it renders gallery): wire a small gallery + video player so uploaded media is actually visible. Scoped to render-only changes.

## Out of scope
- Reordering gallery images (can be added later via drag handle).
- Video transcoding / thumbnail generation.
- Variant-level media.

## Files to edit
- `supabase/migrations/<new>.sql` — add `video_url`, gallery length trigger.
- `src/pages/account/ProductsPage.tsx` — new media section, multi-upload + video upload.
- `src/pages/ProductDetail.tsx` — render gallery + video if present.
- (optional) `src/lib/storage.ts` — small helper for batch upload.
