## Move Broker into Directory (nav-only consolidation)

Brokers are already paid members with `is_broker=true` — conceptually they belong in the seller directory. This change folds the standalone Broker entry into Directory without removing the existing supply/demand board.

### Changes

1. **Header (`src/components/layout/Header.tsx`)**
   - Remove the top-level `{ name: "Broker", href: "/broker" }` nav item.

2. **Directory page (`src/pages/Directory.tsx`)**
   - Add a new filter control "Member type → Broker" (or extend the existing `typeFilter` Select with a "Broker" option) that, when selected, narrows the list to entries where `memberType === "Broker"` (live: `is_broker=true`; demo: existing field).
   - Add a small secondary link/button in the Directory header strip: **"View Broker Board →"** linking to `/broker`, so the supply/demand marketplace remains discoverable from inside Directory.
   - Support a URL query param `?type=broker` so deep links auto-apply the broker filter.

3. **Data adapter (`src/lib/dataSource.ts`)**
   - In `liveCompanyToEntry`, set `memberType: c.is_broker ? "Broker" : "Wholesaler"` so the new filter works against live rows.

4. **Footer (`src/components/layout/Footer.tsx`)**
   - Re-label the existing footer link from "Broker Marketplace" → "Broker Board" (still pointing to `/broker`). Keeps the page accessible without promoting it in the main nav.

5. **No changes to**
   - `/broker` route, `Broker.tsx` page, supply/demand listings, RBAC, or DB schema.

### Out of scope
- Deleting the Broker page or its data
- Schema or RLS changes
- Changes to the role simulator

### Acceptance
- Top header no longer shows "Broker"
- Directory has a Broker filter + a visible link to the Broker Board
- `/directory?type=broker` deep link works
- `/broker` still loads as before
