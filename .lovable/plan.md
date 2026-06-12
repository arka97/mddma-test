## Goal
On the /products page, the "Browse Categories" grid should show 4 categories per row on mobile and 8 per row on desktop (instead of current 2 → 6).

## Change
File: `src/components/products/CategoryGrid.tsx` (line ~76)

Replace the grid classes:
- From: `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4`
- To: `grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3`

Also tighten card inner content for the smaller mobile tiles:
- Card padding `p-3` → `p-2`
- Title text `text-sm` → `text-xs`
- Featured badge stays top-right but with slightly smaller offset

## Out of scope
- No changes to the home page `CategoryGrid` (src/components/home/today/CategoryGrid.tsx) — that one keeps its two horizontal strips.
- No data/sort/filter logic changes.
