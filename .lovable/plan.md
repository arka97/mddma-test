## Goal

Remove every dummy/sample dataset still shipped in the repo and rewire all consumers to live Lovable Cloud data with proper empty states. Nothing fabricated should render anywhere on the site after this change.

## What's still hardcoded

Sample arrays in `src/data/productListings.ts` and `src/data/sampleData.ts`:
- `productListings` (20 fake price/stock listings)
- `brokerListings` (8 fake broker offers)
- `sampleInquiries` (8 fake RFQs)
- `communityPosts` (fake forum posts)
- `sampleCirculars` (fake circulars)
- `membershipTiers` (this one is config, not dummy — keep)

Plus hardcoded "Recent Notifications" inside `src/pages/Dashboard.tsx`.

## Changes

### 1. CRM Dashboard (`src/pages/Dashboard.tsx`)
- Replace `sampleInquiries` import + `useState(sampleInquiries)` with a live fetch from the `rfqs` table for RFQs sent to the signed-in seller's company (`company_id = ownCompany.id`), select all columns + line items if needed.
- Map DB row -> existing `Inquiry` shape (or refactor table to use the `RfqRow` shape directly).
- Status update: call `supabase.from("rfqs").update({ status }).eq("id", id)` instead of local state mutation; refetch on success.
- Remove the hardcoded `notifications` array. Replace the "Recent Notifications" card with either: (a) drop the card entirely, or (b) derive from the latest 3 RFQs (newest first) with timestamp.
- Pipeline / priority counters now compute from live data; show empty state ("No RFQs yet — share your storefront link to start receiving inquiries") when zero.

### 2. Broker Marketplace (`src/pages/Broker.tsx`)
No live `broker_listings` table exists. Two options:
- Show an empty state: heading + "Broker board coming soon — verified brokers will post supply offers and buyer requirements here." Remove `brokerListings` import and tabs counters render `(0)`.
- Keep tabs but render an empty card grid with a placeholder.

Pick option A (cleaner). Brokers in v3.1 are flagged via `profiles.is_broker`, not a separate listings table.

### 3. Storefront (`src/pages/Storefront.tsx`)
- Line 109 falls back to `productListings` filtered by `member.id` when `liveMember` is null. Since the page already early-returns "Storefront Not Found" when no live member is found, that branch is dead — remove the import and just use `[]` (or only the live products fetched into `liveProducts`).

### 4. Live Market Ticker (`src/components/layout/MarketTicker.tsx`)
- Replace imports of `productListings` + `sampleInquiries` with a live fetch from `products` (price trends, demand, low stock) and a count from `rfqs` (last hour).
- Show only items derived from live rows. If there are <3 live items, hide the ticker entirely (return `null`) so we don't render a near-empty bar.
- Drop the hardcoded "California crop report" breaking-alert string.

### 5. Community section on home (`src/components/home/CommunitySection.tsx`)
- Replace `communityPosts` mock with a live fetch via `listPosts()` from `src/repositories/posts.ts`, take top 4 (pinned first, then newest).
- Empty state: "Be the first to start a discussion" with link to `/community`.

### 6. Sample data files
- Delete `productListings`, `brokerListings`, `sampleInquiries`, `communityPosts`, and the `CommunityPost` interface from `src/data/productListings.ts`. Keep type exports (`StockBand`, `TrendDirection`, `DemandLevel`, `LeadPriority`, `ProductListing`, `Inquiry`) and label/color maps — they're still imported as types in `MarketSignals`, `GuardedPrice`, `BehavioralCues`, `dataSource.ts`.
- Delete `sampleCirculars` from `src/data/sampleData.ts`. Keep `Member`, `MembershipTier`, `Circular` interfaces and `membershipTiers` (pricing config — not dummy data).

### 7. Verify no stale references
After deletions, run `rg "sampleInquiries|productListings(?!\b.*:)|brokerListings|communityPosts|sampleCirculars" src` and clean up any leftovers.

## Files touched

- `src/pages/Dashboard.tsx` — live RFQs, drop notifications mock
- `src/pages/Broker.tsx` — empty-state, drop import
- `src/pages/Storefront.tsx` — drop fallback import
- `src/components/layout/MarketTicker.tsx` — live data or hide
- `src/components/home/CommunitySection.tsx` — live posts
- `src/data/productListings.ts` — strip arrays, keep types
- `src/data/sampleData.ts` — strip `sampleCirculars`

## Out of scope

- `membershipTiers` stays (pricing config, displayed on `/membership`).
- `Circulars` page already uses live `circulars` table; not touched.
- `FeaturedMembersSection`, `RecentListingsSection`, `FeaturedCategoriesSection` already use live hooks; not touched.
