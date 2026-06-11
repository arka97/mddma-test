## Goal

Below the Live Rates Ticker on the home page (/), restructure into 6 sections in this order, keeping the existing hybrid 12-col grid:

1. **Market** — compact snapshot of `market_signals` (top 4–6 rows: name · origin · trend · range), links to `/market`
2. **Market News** (new)
3. **Humor** (new)
4. **Circulars & Notices** (existing Circulars block, heading renamed on home only)
5. **Brands** (existing FeaturedBrands strip)
6. **Member Directory** (existing FeaturedMembers)

Other home blocks (QuickActionsGrid, MembershipCTA, ActionRequiredCircular, CategoryGrid, RecentListingsList, category AdSlot, PartnersStrip, AuthorityBlurb) are removed from `/` to keep the new ordered structure clean. Top rotating ad banner stays.

## Database — two new tables

### `market_news`
Columns: `title`, `summary`, `body` (nullable), `source_name`, `source_url`, `category`, `image_url`, `is_published` (default false), `published_at`, `sort_order` (int default 0), `created_by` (uuid), `created_at`, `updated_at`.

### `humor_posts`
Columns: `title`, `body`, `image_url`, `attribution`, `is_published`, `published_at`, `sort_order`, `created_by`, `created_at`, `updated_at`.

Both:
- Grants: `SELECT` to anon + authenticated, full to service_role, `INSERT/UPDATE/DELETE` to authenticated (RLS-gated).
- RLS: public can `SELECT` where `is_published = true`; admins (`has_role(auth.uid(),'admin')`) full access.
- `update_updated_at_column` trigger.

## Image upload — reuse `ad-assets` bucket

The existing `ad-assets` bucket (public, admin-only write) is reused for Market News and Humor images. No new bucket, no new RLS policy needed.

- Admin CRUD forms include an **Upload image** control that calls `supabase.storage.from('ad-assets').upload(...)` into prefixes `market-news/<uuid>.<ext>` and `humor/<uuid>.<ext>`, then stores the resulting public URL in the row's `image_url`.
- Admin can also paste an external URL as a fallback.
- A new shared helper `src/lib/uploadAdAsset.ts` wraps upload + `getPublicUrl`, reused by both forms.

## Frontend changes

### New section components (`src/components/home/today/`)
- `MarketSnapshot.tsx` — top 4–6 `market_signals` in compact rows.
- `MarketNewsSection.tsx` — 3–4 latest published news items (title, summary, source, optional thumb).
- `HumorSection.tsx` — 1 featured + 2 secondary humor cards with gold accent.
- `CircularsSection.tsx` — extracted from current Industry Feed; heading text is **"Circulars & Notices"** (home only).

Brands and Member Directory reuse existing `FeaturedBrandsStrip` / `FeaturedMembers`.

### New list pages
- `src/pages/MarketNews.tsx` → `/market-news`
- `src/pages/Humor.tsx` → `/humor`
Both: `Layout` + `<Seo noindex />`, render published rows in a card list.

### Home grid (`src/pages/Index.tsx`)
Inner grid replaced with the 6 sections as full-width `lg:col-span-12` rows in the specified order, after the existing `TodayHeader` + `LiveRatesTicker`.

### Data layer
- `src/repositories/marketNews.ts`, `src/repositories/humor.ts` — `list({ publishedOnly })`, `create`, `update`, `remove`.
- `src/hooks/queries/useMarketNews.ts`, `useHumor.ts` — react-query wrappers.
- New keys in `src/lib/queryKeys.ts`.

### Admin CMS
Add two tabs in `src/pages/account/AdminModeration.tsx` — **Market News** and **Humor** — with CRUD mirroring the existing Circulars pattern: list table + add/edit dialog (title, summary/body, image upload, source fields for News, attribution for Humor, publish toggle, sort order).

### Routes
Register `/market-news` and `/humor` in `src/routes.tsx`.

## Out of scope (per your earlier answers)

- No changes to header nav, footer, mobile tab bar, or `/circulars` page title — "Circulars & Notices" rename is the home-section heading only.

## Files touched

**New:** 1 migration (two tables), `src/components/home/today/{MarketSnapshot,MarketNewsSection,HumorSection,CircularsSection}.tsx`, `src/pages/{MarketNews,Humor}.tsx`, `src/repositories/{marketNews,humor}.ts`, `src/hooks/queries/{useMarketNews,useHumor}.ts`, `src/lib/uploadAdAsset.ts`.
**Edited:** `src/pages/Index.tsx`, `src/pages/account/AdminModeration.tsx`, `src/routes.tsx`, `src/lib/queryKeys.ts`.

## Confirm before I build

- OK to drop QuickActionsGrid / MembershipCTA / ActionRequiredCircular / CategoryGrid / RecentListings / PartnersStrip / AuthorityBlurb from the home page? Or should any of them stay (e.g. MembershipCTA)?
