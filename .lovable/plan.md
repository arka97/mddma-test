## Changes on Home (`/`)

### 1. Rename "Recent listings" → "New Products"
File: `src/components/home/today/RecentListingsList.tsx`
- Heading text: `Recent listings` → `New Products`
- Keep subtitle and "View all" link unchanged (or update subtitle to "Latest commodities from verified sellers" — already fits).

### 2. Add a "New Members" section below it
New file: `src/components/home/today/NewMembersList.tsx`
- Fetches latest 5 companies from `companies` table via Supabase, ordered by `created_at desc`.
- Renders a compact list (avatar initials + firm name + city/category + Verified badge), styled like `RecentListingsList` for visual consistency.
- Header: **New Members** with subtitle "Recently joined verified traders" and a "Directory →" link to `/directory`.
- Loading skeletons; empty state mirrors recent listings.

### 3. Wire it into the home page
File: `src/pages/Index.tsx`
- Import `NewMembersList` and render it immediately after `<RecentListingsList />` inside the existing `space-y-5` stack.

No backend/schema/business-logic changes. Pure presentation additions.
