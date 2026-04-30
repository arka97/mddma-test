## Admin-Managed Product Categories

Admins curate the master list of product categories. Sellers pick from a dropdown when adding products. Homepage "Browse by Category" uses curated images, sort order, and featured flag instead of auto-derived names.

### 1. Database (migration)

New table `product_categories`:
- `name` (text, unique)
- `slug` (text, unique, used in URLs)
- `description` (text, nullable)
- `image_url` (text, nullable — uses `product-images` bucket)
- `sort_order` (int, default 0)
- `is_active` (bool, default true)
- `is_featured` (bool, default false)
- standard `id`, `created_at`, `updated_at` + updated_at trigger

RLS:
- Public SELECT where `is_active = true` (admins see all)
- INSERT / UPDATE / DELETE restricted to `has_role(auth.uid(), 'admin')`

Seed with current distinct categories already present in `products.category` so nothing breaks on first load.

### 2. Repository

New `src/repositories/productCategories.ts` with `listCategories({ activeOnly, featuredOnly })`, `createCategory`, `updateCategory`, `deleteCategory`.

New hook `src/hooks/queries/useProductCategories.ts` for cached reads.

### 3. Admin UI — new "Categories" tab

In `src/pages/account/AdminModeration.tsx`, add a `Categories` tab alongside Circulars/Ads with:
- Form: name, slug (auto-generated from name, editable), description, image upload (to `product-images` bucket), sort order, active toggle, featured toggle
- Table list with edit / delete actions, sorted by `sort_order`
- Inline validation (zod) and toasts matching existing patterns

### 4. Seller product form

In `src/pages/account/ProductsPage.tsx`, replace the free-text Category `<Input>` with a `<Select>` populated from active categories. Existing products keep their stored category string; if it no longer matches an active category, show it as a disabled current value with a hint to pick a new one.

### 5. Homepage Featured Categories

Rewrite `src/components/home/FeaturedCategoriesSection.tsx` to:
- Source from `product_categories` where `is_featured = true AND is_active = true`, ordered by `sort_order`
- Use `image_url` when present, falling back to `CommodityImage`
- Keep the listing-count badge by joining counts from `useProducts`

### 6. Products page filter

In `src/pages/Products.tsx`, replace `liveCategories` (derived from listings) with the curated active list so the dropdown stays clean even when categories have zero listings.

### Technical notes

- All colors via existing semantic tokens; no new design tokens needed.
- Image uploads reuse existing `product-images` bucket and `src/lib/storage.ts` helpers.
- Slug uniqueness enforced at DB level; client pre-checks before submit.
- Deleting a category does NOT cascade to products (category is a free-text field on `products`); admin sees a confirmation noting affected product count.

### Out of scope

- Migrating `products.category` to a foreign key (kept as text for backward compatibility).
- Nested / hierarchical categories.
