## Goal

Make "Browse categories" a horizontally scrollable strip showing ALL active categories (not just 6), with featured/hot ones appearing first.

## Changes

**File: `src/components/home/today/CategoryGrid.tsx`**

1. **Show all categories, sorted by featured-first**
   - Remove the `.slice(0, 6)` cap so every active category is rendered.
   - Keep the existing sort: `is_hot || is_featured` first, others after (stable order preserved for the rest).

2. **Replace the grid with a horizontal scroller**
   - Swap the `grid grid-cols-3 sm:grid-cols-6` container for a single-row flex scroller:
     - `flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4` (negative margin lets the strip bleed to viewport edges on mobile so the last card can scroll fully into view; safe on desktop too since parent has padding).
     - Hide the scrollbar with the existing `scrollbar-hide` utility if present, otherwise add inline `[&::-webkit-scrollbar]:hidden` style.
   - Each card becomes a fixed-width snap item: `snap-start shrink-0 w-28 sm:w-32` so 3–4 fit on mobile and 6+ on desktop, matching today's visual density.
   - Loading skeletons mirror the same layout (row of 6 fixed-width skeletons in an overflow-x container).

3. **No data, query, or routing changes.** Links, badges, counts, and image rendering stay identical.

## Out of scope

- No DB or `useProductCategories` hook changes.
- No edits to other home sections or the `/products` page.
- No new arrows/controls — native touch + trackpad scroll only (matches existing horizontal strips in the app).
