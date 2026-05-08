## Product form cleanup

Scope: edit-product dialog at `/account/products` only (no changes to filters, listings, or the variant form unless noted).

### Changes

**1. Auto-generated unique slug**
- Remove the editable Slug field from the dialog.
- Slug is derived from `name` via `slugify()` on save, and uniqueness is enforced by querying `products.slug` for the same `company_id` and appending `-2`, `-3`, … if a collision exists (skipping the row being edited).

**2. Required fields**
- `category`, `origin`, `price_min`, `price_max`, `unit` become mandatory.
- Enforced client-side: HTML `required` on inputs, plus a check in `handleSave` that shows a toast if any are missing/empty (since `SearchableSelect` is not a native input, it needs the explicit check). `price_max ≥ price_min` is also validated.

**3. Replace Stock band + Trend with simple Stock dropdown**
- Remove the **Stock band** (high/medium/low/on_order) and **Trend** (rising/stable/falling) selects from the form.
- Add a single **Stock** dropdown with two options: **Available**, **Out of stock**.
- Card preview also drops the stock-band / trend badges and instead shows an "Available" / "Out of stock" badge.

**4. Origin field cleanup**
- Remove the helper line "60 countries — type to filter" below the Origin dropdown.
- Origin remains a searchable select over `ORIGIN_COUNTRIES`.

### Technical details

- **DB migration** (`stock_band` enum currently has `high|medium|low|on_order`; `trend_direction` has `rising|stable|falling`):
  - Add two new values to `stock_band` enum: `available`, `out_of_stock`.
  - Backfill `products.stock_band`: existing `high`/`medium` → `available`; `low`/`on_order` → `out_of_stock`. Same backfill for `product_variants.stock_band`.
  - Change column default on both tables to `'available'`.
  - `trend_direction` column is left in place (other surfaces still read it) but the product form stops writing/reading it; new rows keep the existing default `'stable'`. (Removing the column would require touching `MarketSignals`, `productListings.ts` types, listing cards, and is out of scope of "product form" — flag this and ask if you want a deeper cleanup.)

- **Slug uniqueness helper** lives in `ProductsPage.tsx` (small inline async function); no new file needed.

- Files touched:
  - `src/pages/account/ProductsPage.tsx` — form fields, save logic, card preview badges.
  - One new migration file under `supabase/migrations/`.

### Out of scope

- Public product listing cards / `MarketSignals` component (still render trend + old stock bands for legacy data — they will simply show "Available" / "Out of stock" once data is backfilled, but the broader stock-band UI cleanup is not included).
- Variant form's stock band field (separate flow).
- Filters on `/products`.

Confirm and I'll implement.