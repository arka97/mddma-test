# Mobile-first redesign across 9 screens (Claude wireframe parity)

Goal: align Home, Market, Marketplace, Category, Product, Brands, Brand page, Directory, and Storefront with the attached wireframes while keeping MDDMA navy/gold tokens, current fonts, and the hybrid 12-col layout on desktop. No business-logic changes — only UI, data plumbing, and the minimum schema needed to surface the new signals/badges.

## Visual rules (apply everywhere)
- Card chrome: `rounded-2xl`, `border border-border`, `bg-card`, `shadow-sm`. Section title row = `text-base font-semibold` + muted subtitle + right-aligned link.
- Chip styles: small uppercase tracking-wide pills for status (LIVE, AD, FEATURED, HOT, SPONSORED, VERIFIED, INDICATIVE, ANALYST SIGNAL) using `bg-{tone}/10 text-{tone}` (accent, gold, warning, success, primary).
- Demand/supply chips use tone scale: High/Tight → warning, Medium/Stable → muted, Low/Increasing → success. Trend arrow uses success (Up) / danger (Down).
- Price band component reused across screens: muted "INDICATIVE" caption + large `tabular-nums` range + `/kg` unit + "Last updated · N sellers offering" footnote.
- Mobile bottom bar already correct (Today/Members/RFQs/Circulars/Account). Sticky Call/RFQ bar on product + storefront, sitting above the tab bar with `calc(env(safe-area-inset-bottom) + 64px)`.

## Schema additions (single migration)
Minimal, additive only:
- `product_categories`: add `emoji text`, `is_hot boolean default false` (Featured/Hot ribbon).
- `companies`: add `is_sponsored boolean default false`, `verification_tier_label text` (e.g. "Tier-2"), `iec text`, `languages text[]`, `hours text`, `markets text[]` (e.g. Pydhonie, Crawford Mkt). `is_verified` already exists.
- `products`: add `lead_time_hours integer`, `stock_kg numeric` (visible only as bands), `caliber text`, `moisture text`, `shelf_life text`, `inquiry_count_7d integer default 0`, `inquiry_count_week_cached integer default 0`.
- New `market_signals` table: `id, commodity_name, origin, category, price_min, price_max, unit, trend ('up'|'down'|'flat'), demand ('high'|'medium'|'low'), supply ('tight'|'tightening'|'stable'|'increasing'), inquiries_week int, analyst_note text, requires_paid bool default true, is_active bool, updated_at`. Public read RLS; admin write RLS.
- New `analyst_reports` table for "Weekly insights" strip: `id, kind ('supply'|'demand'|'price'|'policy'), title, body, requires_paid bool default true, published_at, is_active`. Admin write, public read.

No data backfill in the migration — admin CMS or seeds populate later. UI hides empty rows.

## Screen-by-screen

### 01 Today / Home — polish
- `LiveRatesTicker`: pull rows from `market_signals` (limit 8). Render as inline chips with origin · grade · range, duplicated for marquee loop. Pause on hover; respect `prefers-reduced-motion`.
- `QuickActionsGrid`: keep four tiles; tile meta now uses live counts (RFQs fortnight, circulars new, "APMC rates", brands count). Already mostly correct.
- `AdSlot`: keep rotating carousel.
- `MembershipCTA`, `ActionRequiredCircular`: tighten typography per wireframe (uppercase caption + bold title + meta line + two CTAs).
- `CategoryGrid`: render emoji from new `emoji` column, "Featured" chip when `is_hot`, `N listings` from live product counts.
- `RecentListingsList`: row format → emoji square · `Name · Origin` · `Category` · price band · Request quote ghost button.

### 02 Market Intelligence (`/market`)
Rewrite to wireframe layout:
- Hero block: "Market Intelligence" title + subtitle + locked card "Unlock full Market Intelligence" with View plans link for non-paid roles.
- Filter chips: All / High demand / Tight supply / Rising (client-side filter on `market_signals`).
- Signal cards (one per commodity):
  - Top row: Name + "N inquiries this week" pill.
  - Price band.
  - Trend arrow + label.
  - Two chips: Demand:High, Supply:Tightening.
  - "ANALYST SIGNAL" footer: full text for paid/admin, blurred placeholder + "Unlock signal" CTA for free/guest.
- Below grid: ad slot (`market-banner` placement reuses existing `advertisements`), "Weekly insights" list from `analyst_reports`.

### 03 Marketplace browse (`/products`)
- Header: title + subtitle. Tabs: All / Bulk / Branded (client-side filter on `is_branded`).
- Search input.
- Featured strip card (single highlighted listing pulled from `is_featured` products).
- Ad slot.
- "Browse categories" grid (same component as Home but with `Hot` chip variant).
- "Recent listings" list (same row component as Home).
- Partners strip footer (uses `PartnersStrip`).

### 04 Category detail (`/products/:category`)
- Breadcrumb: Categories › Name.
- Hero card: emoji + name + description + listings count.
- Search-within input.
- Applied filters bar: "2" pill, removable chips (Origin/Grade/etc.), plus filter add menu (Origin, Grade, "In stock now").
- Result header: "Showing N of M listings", sort dropdown (Price low/high, Recently added, Most inquired).
- Listing row component: square thumbnail w/ origin badge + HOT chip when applicable, name + grade, price band, seller name, Request quote button.

### 05 Product detail (`/products/:slug`)
- Media: cover + gallery in swipeable carousel (already exists via `ProductMediaCarousel`); show "1/6" counter, Origin chip top-left, "Verified seller" chip top-right.
- Title row: Name · grade, SKU/category/Cat-A meta.
- Price band: INDICATIVE chip, range, unit, "Last updated · N sellers offering".
- 3-col strip: MOQ, IN STOCK (band: High/Med/Low, not exact kg), LEAD TIME (from `lead_time_hours`).
- Specifications table (Variety, Origin, Grade, Caliber, Moisture, Pack size, Shelf life, Certifications) — only render rows with data.
- Packaging formats chips from `packaging_options`.
- "Sold by" seller card: avatar/logo, name, type · city · Est. year, rating placeholder (only if data), "View store" link.
- Related listings horizontal scroller.
- Sticky bottom bar: "Call seller" (wa.me deeplink) + "Request quote" (RFQ cart). Hidden on lg+, shown < lg.

### 06 Brands (`/brands`)
- Header: title + subtitle.
- Search input.
- Tabs/All chip + "N member brands" counter.
- Brand cards: logo square (or emoji fallback), `Royal Mamra` title, "By Company", category chips, "N SKUs" right side. Grid 1-col mobile, 2-col sm, 3-col lg.

### 07 Brand page (`/brands/:slug`)
- Hero: cover image + logo overlap + "Member brand" chip + name + tagline + category chips + "Buy retail" CTA (b2c_url).
- "By Company" link to storefront.
- "Our story" prose.
- "Branded products" grid: SKU cards with image, name, pack-size · price, "Buy retail" button (b2c_url at brand or per-product `b2c_url`).

### 08 Member directory (`/directory`)
- Header + search ("Iranian almond" style placeholder echoing query).
- Filter chips: All / Importer / Wholesaler / Retailer / Processor / Broker (from `companies.categories` or a derived `company_type`; if no field, reuse `categories[0]`).
- Result header: "Showing N of M members", sort (Distance / Recent / Verified).
- Ad slot inline.
- Member cards:
  - Top-left avatar square (logo or emoji); "Sponsored" + "Verified" chips on top.
  - Initials avatar + Company name; contact name below.
  - Type chip · GST · FSSAI badges from existing fields.
  - Market chip (Pydhonie/Masjid Bunder…) from `companies.address` heuristic or new `markets[]`.
  - Commodity chips (top 3 from products).
  - "Member since YYYY" using `established_year`.
  - View store ghost button.

### 09 Storefront (`/store/:slug`)
- Sticky hero: cover background, logo, "Sponsored" chip when applicable, "Verified · Tier-2" chip, name, type · city, badges row (GST, FSSAI, IEC, Est. YYYY).
- Action bar: Call, Email, Directions, RFQ (existing actions, restyled to icon+label 4-up).
- "Commodities" strip: chips of top grades on offer + 3 highlight rows.
- "Active listings" list: emoji square · name · grade · price band · stock band ("850 kg ready" — only shown to paid; free sees "High / Medium / Low").
- "Trade details" table: GSTIN, FSSAI, IEC, Languages, Hours, Address.
- "23 RFQs sent to this seller in the last 7 days" footer (from `inquiry_count_7d`).
- Sticky bottom bar: Call + Request quote.

## Components to add (presentation only)
- `src/components/commodity/PriceBand.tsx` — indicative band + footnote.
- `src/components/commodity/StockBand.tsx` — High/Med/Low band derived from `stock_kg`.
- `src/components/commodity/DemandSupplyChips.tsx`.
- `src/components/commodity/TrendArrow.tsx`.
- `src/components/market/SignalCard.tsx`.
- `src/components/directory/MemberCard.tsx` (replaces inline card markup).
- `src/components/brands/BrandCard.tsx` already exists — re-skin only.
- `src/components/products/ListingRow.tsx` — shared row for Home/Marketplace/Category/Storefront.
- `src/components/storefront/StickyContactBar.tsx`.
- `src/components/storefront/StorefrontHero.tsx`.

## Repositories / hooks
- `src/repositories/marketSignals.ts` + `useMarketSignals` hook.
- `src/repositories/analystReports.ts` + `useAnalystReports`.
- Extend `useProductCategories` to surface `emoji`, `is_hot`, and a listings count via a single grouped query.
- Extend `useCompanies` query for directory to join product names (top 3) and inquiry counts.

## Out of scope
- No new auth flows, no payment changes, no admin CMS for `market_signals`/`analyst_reports` in this pass (admin can insert via Lovable Cloud table editor; CMS UI is a follow-up).
- No new desktop layouts; existing hybrid grid is preserved (Market and Directory adopt 2-col card grids at lg+; Product detail uses 2-col split at lg+ with sticky right rail replacing the mobile sticky bar).
- No Bricolage Grotesque webfont — current fonts retained.

## Done when
- All 9 routes render the wireframe-matching structure on mobile (390 wide).
- Empty-data states gracefully hide (no "undefined" or zero-stub rows).
- Build passes, prerender of public routes still works, RLS still blocks anonymous mutations.
