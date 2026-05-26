
# Mobile-first PWA shell + Today/Home redesign

## What you'll see

A new app shell that feels like a native mobile app: slim top bar with location + avatar, bottom tab bar (Today / Members / RFQs / Circulars / Account), and a Home screen rebuilt to match the wireframe — search, live rates ticker, 2×2 quick actions, ad slot, paid-member CTA, action-required circular, category grid, recent listings, featured members, partners strip. Desktop keeps the same sections in a hybrid 2-column layout with a short authority paragraph for SEO. No HeroSection / Marketplace / WhyMddma blocks brought back.

## App shell

Replace `Header` everywhere with a new `MobileTopBar`:
- Left: location chip ("Pydhonie, Mumbai" — static for now, hooked to profile if available)
- Center: condensed search input that routes to `/products?q=...&view=marketplace`
- Right: avatar dropdown (current `UserMenu` reused) or Login button if signed out
- Sticky, safe-area aware, slim (52–56px)
- On `≥lg`, expands gutters and adds the primary nav links inline (Directory / Products / Brands / Market / Community / Membership) so desktop still has top nav

Add a new `MobileBottomTabBar`:
- 5 tabs: Today (`/`), Members (`/directory`), RFQs (`/account/rfqs` if signed in else `/login?next=/account/rfqs`), Circulars (`/circulars`), Account (`/account/profile` if signed in else `/login`)
- Visible only `<lg` (mobile + tablet); hidden on desktop
- Fixed bottom, safe-area-inset-bottom, active-tab highlighted with primary color
- Reserves bottom padding on `<main>` so content isn't covered; CartFab repositioned above it on mobile

Old `Header.tsx` is replaced (not just edited) — keeps `InstallAppButton`, search, and `UserMenu` behaviors. `Layout.tsx` updated to render `MobileTopBar` + children + `Footer` (desktop only) + `MobileBottomTabBar`.

## Home page (`src/pages/Index.tsx`)

Drop all current sections. Compose from new small components under `src/components/home/today/`:

1. `TodayHeader` — "Today on the market" + subtitle (already inside content, since top bar is global)
2. `LiveRatesTicker` — horizontal scroll strip with badges (LIVE pill + commodity · origin + price range, separator chars). Reuses existing `MarketTicker` data hook if present; otherwise stub with the same 6 items from the wireframe
3. `QuickActionsGrid` — 2×2 tiles: Post RFQ (badge: "12 active"), Circulars ("4 new"), Market ("APMC"), Brands ("180+"). Each is a Link with icon + label + meta
4. `AdSlot` — pulls from `repositories/advertisements.ts`; placement key `home-top`; falls back to empty render
5. `MembershipCTA` — "Become a Paid Member ₹10,000/yr…" card with Apply button. Hidden when user already paid (`hasRole('paid_member')`)
6. `ActionRequiredCircular` — pinned circular card with progress copy + primary CTA + "Read more"; sourced from `repositories/circulars.ts` where `pinned=true`
7. `CategoryGrid` — 6-tile emoji grid (uses `useProductCategories`), shows top 6 with listing counts; "View all" → `/products`
8. `RecentListings` — vertical list of last 5 products (emoji + name — category + price band + seller · location), "View all" → `/products`
9. `AdSlot` second — placement key `home-mid`
10. `FeaturedMembers` — 2 sponsored cards with avatar, name, principal, role, GST/FSSAI badges, location, top commodities, "Member since YYYY", View store link
11. `PartnersStrip` — "OUR PARTNERS" eyebrow + 6 partner names (from `SponsorsSection` data, restyled as a single horizontal scroll row)
12. **Desktop-only** `AuthorityBlurb` — 2–3 sentences on 95-year MDDMA history, rendered as semantic `<section>` with H2 and visible only `md:block` for SEO crawlers (page stays indexable since `/` is in the public authority layer)

## Desktop hybrid grid (`md+`)

Inside `Index.tsx`, wrap sections in a 12-col `lg:grid lg:grid-cols-12 lg:gap-6` where:
- Search row spans full width (wider input)
- LiveRatesTicker spans 12
- QuickActionsGrid spans 4, MembershipCTA spans 4, ActionRequiredCircular spans 4 (one row)
- AdSlot spans 12
- CategoryGrid spans 7, RecentListings spans 5
- FeaturedMembers spans 12 in a 2-col inner grid
- PartnersStrip spans 12
- AuthorityBlurb spans 12

Mobile (`<md`) stays single-column stack in the wireframe order.

## Visual / token notes

- Use existing HSL semantic tokens (`--primary` navy, `--accent` emerald, `--gold` for the membership/sponsored badges, `--warning` for ACTION REQUIRED).
- LIVE pill: `bg-destructive/10 text-destructive` with a small pulsing dot.
- Tile cards: `rounded-2xl border bg-card shadow-sm` to read app-like, not desktop-marketing.
- Bottom tab bar: `bg-background/95 backdrop-blur border-t`, active icon `text-primary`, inactive `text-muted-foreground`.
- Respect Pricing rule: only show ranges + High/Med/Low — no exact prices anywhere.

## Files

```text
src/components/layout/MobileTopBar.tsx        (new, replaces Header role)
src/components/layout/MobileBottomTabBar.tsx  (new)
src/components/layout/Layout.tsx              (edit: mount new shell)
src/components/layout/Header.tsx              (delete or keep as thin re-export)
src/components/home/today/TodayHeader.tsx
src/components/home/today/LiveRatesTicker.tsx
src/components/home/today/QuickActionsGrid.tsx
src/components/home/today/AdSlot.tsx
src/components/home/today/MembershipCTA.tsx
src/components/home/today/ActionRequiredCircular.tsx
src/components/home/today/CategoryGrid.tsx
src/components/home/today/RecentListings.tsx
src/components/home/today/FeaturedMembers.tsx
src/components/home/today/PartnersStrip.tsx
src/components/home/today/AuthorityBlurb.tsx
src/pages/Index.tsx                           (rewrite: compose the above)
src/components/cart/CartFab.tsx               (edit: lift above bottom tab bar on mobile)
```

Out of scope (not touched): all `/account/*`, `/admin/*`, `/documents/*`, edge functions, DB schema, routes config (existing routes remain), Footer (still rendered on desktop).

## Done when

- `/` on a 390×844 viewport matches the wireframe order and density (single-column, app-like cards).
- Bottom tab bar visible on every page on mobile, hidden on desktop.
- Top bar replaces the current header on every viewport, with desktop showing inline primary nav.
- Desktop `/` renders the new sections in the hybrid grid plus the SEO authority paragraph; no HeroSection/Marketplace/WhyMddma re-appears.
- All colors come from HSL semantic tokens; no exact prices/stock leaked.
