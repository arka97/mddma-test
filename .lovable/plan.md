## Seller Brands — Plan

Sellers can register one or more **house brands** (e.g., Bazana) sold alongside bulk commodities. Branded SKUs link out to external B2C stores; RFQ stays B2B-only.

### 1. Database (migration)

**New table `brands`**
- `id`, `company_id` (FK companies), `slug` (unique), `name`, `tagline`, `story` (text)
- `logo_url`, `cover_url`, `gallery` (text[])
- `b2c_url` (external retail link), `social_links` (jsonb)
- `categories` (text[]), `is_featured` (bool), `is_active` (bool), `sort_order`
- `created_at`, `updated_at`

**Alter `products`**
- Add `brand_id uuid` (nullable, FK brands)
- Add `is_branded boolean default false`
- Add `retail_pack_size text` (e.g., "200 g pouch") — display only, not a price
- Add `b2c_url text` (per-SKU override; falls back to brand's b2c_url)

**RLS**
- Public SELECT on `brands` where `is_active = true`
- Owner (via companies.owner_id) + admin: INSERT/UPDATE/DELETE on own brands
- Existing product policies already cover `brand_id` filtering

### 2. Repositories & hooks
- `src/repositories/brands.ts` — `listBrands({featured, companyId})`, `getBrandBySlug`, `listBrandsByCompany`
- `src/hooks/queries/useBrands.ts` — `useBrands`, `useBrandBySlug`, `useBrandsByCompany`
- Extend `useProducts` to accept `{ brandId?, mode?: "bulk" | "branded" | "all" }`

### 3. UI surfaces

**a. Storefront `/store/:slug`** — new "Our Brands" section above bulk products
- Horizontal card row of company's brands (logo + name + tagline + "View brand →")
- Each card links to `/brands/:slug`

**b. New routes**
- `/brands` — discovery grid of all featured/active brands across sellers
- `/brands/:slug` — brand detail page: hero (cover + logo + story), gallery, branded SKU grid (with retail pack size + "Buy retail" external CTA), seller credit linking back to `/store/:companySlug`

**c. Homepage** — new `FeaturedBrandsStrip` component
- Logo carousel of `is_featured` brands, links to `/brands/:slug`
- Inserted between `FeaturedCategoriesSection` and `MarketplacePulse`

**d. Products page `/products`** — add segmented toggle "Bulk / Branded / All"
- Branded mode shows products with `is_branded=true`, hides RFQ CTA on retail-only items, shows "Buy retail →" external link instead

**e. Account hub** — `/account/brands` (new)
- CRUD for the seller's brands (logo upload via `company-assets` bucket, story editor, b2c_url)
- Existing `/account/products` gets a brand picker dropdown + "branded?" toggle + retail pack size + b2c_url

### 4. Guardrails preserved
- No exact prices anywhere — branded SKUs show pack size + external CTA, never an MRP rendered from DB
- RFQ remains B2B-only (auth-gated, paid-only submit). Branded items can also be RFQ'd in bulk if not flagged retail-only.
- All colors via HSL semantic tokens; navy/gold aesthetic

### 5. Out of scope
- In-app B2C cart / checkout / payments
- Brand verification badges (reuse company verification)
- Per-brand analytics dashboards

### Files to add/change
- **New:** migration; `src/repositories/brands.ts`; `src/hooks/queries/useBrands.ts`; `src/pages/Brands.tsx`; `src/pages/BrandPage.tsx`; `src/pages/account/BrandsPage.tsx`; `src/components/brands/BrandCard.tsx`; `src/components/brands/BrandStrip.tsx`; `src/components/home/FeaturedBrandsStrip.tsx`
- **Edit:** `src/routes.tsx`; `src/pages/Index.tsx`; `src/pages/Storefront.tsx`; `src/pages/Products.tsx`; `src/pages/account/ProductsPage.tsx`; `src/components/layout/Header.tsx` (add Brands nav link); memory index

### Verification
- Create one brand seeded for an existing company, attach 2 branded products, confirm: appears on `/brands`, `/brands/:slug`, on company storefront, on homepage strip, and filterable on `/products`. Confirm "Buy retail" opens external URL in new tab. Confirm RLS: anonymous can read brands but not edit.
