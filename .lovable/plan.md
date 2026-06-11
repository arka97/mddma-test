## Goal
Remove the 6 duplicate full-width section rows from the homepage (they duplicate the tile grid) and restore the previously-removed sections below the grid.

## Change

### `src/pages/Index.tsx` — replace contents

Top-to-bottom order:

1. `AdSlot` (homepage banner)
2. `TodayHeader`
3. `LiveRatesTicker`
4. `QuickActionsGrid` (6 tiles, unchanged)
5. `CategoryGrid` — Browse categories
6. `RecentListingsList` — Recent listings
7. `ActionRequiredCircular` — most recent circular needing attention
8. `MembershipCTA` — upgrade prompt for free/guest
9. `PartnersStrip` — partner/sponsor logos
10. `AuthorityBlurb` — "Why MDDMA" trust paragraph

**Remove from homepage imports & render:** `MarketSnapshot`, `MarketNewsSection`, `HumorSection`, `CircularsSection`, `FeaturedBrandsStrip`, `FeaturedMembers`. The tile grid already links to `/market`, `/market-news`, `/humor`, `/circulars`, `/brands`, `/directory`.

## Not touched
- Component files for the 6 removed sections stay on disk (still used by their dedicated pages).
- `/market-news`, `/humor` pages, routes, admin CMS, DB tables, repos, hooks — all unchanged.
- `QuickActionsGrid.tsx` — unchanged.
- Verified `RecentListingsList`, `CategoryGrid`, `MembershipCTA`, `ActionRequiredCircular`, `PartnersStrip`, `AuthorityBlurb` contain no RFQ references, so no v3.1.3 cleanup needed.