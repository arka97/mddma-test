## Goal

Place the original tile grid (the one in the screenshot) directly below the LiveRatesTicker on the homepage, expanded from 4 tiles to 6 tiles matching the new section order.

## Changes

### 1. `src/components/home/today/QuickActionsGrid.tsx`
Update tile list to 6 entries in this order, reusing the existing card styling and tone system:

1. **Market** → `/market` · icon `LineChart` · tone `primary` · meta "APMC rates & trends"
2. **Market News** → `/market-news` · icon `Newspaper` · tone `accent` · meta "Latest from the trade"
3. **Humor** → `/humor` · icon `Smile` · tone `gold` · meta "A lighter side"
4. **Circulars & Notices** → `/circulars` · icon `Megaphone` · tone `warning` · meta dynamic (`{n} new` in last 14 days, fallback "Trade notices")
5. **Brands** → `/brands` · icon `Sparkles` · tone `gold` · meta dynamic (`{n}+ brands`, fallback "House brands")
6. **Member Directory** → `/directory` · icon `Users` · tone `accent` · meta "Browse verified traders"

Grid: change `grid-cols-2` → `grid-cols-2 md:grid-cols-3` so 6 tiles render as 2×3 on mobile and 3×2 on desktop. Keep all existing card styling (rounded-2xl, tone chip, label, meta).

### 2. `src/pages/Index.tsx`
Add `import { QuickActionsGrid } from "@/components/home/today/QuickActionsGrid";` and render `<QuickActionsGrid />` between `<LiveRatesTicker />` and `<MarketSnapshot />`. No other changes — the 6 full sections below remain as-is.

## Out of scope
- No changes to existing tile component visual design beyond the tile list and grid column count.
- No DB, route, or section-content changes.