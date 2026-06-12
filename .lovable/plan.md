## Goal

On the homepage "Browse categories" section, show **two** horizontally scrollable strips instead of one. Each strip holds 16 categories: the first 4 are featured/hot, the remaining 12 are non-featured. On mobile, 4 cards must be visible without horizontal scrolling.

## Changes — `src/components/home/today/CategoryGrid.tsx`

1. **Split the sorted list into two strips**
   - Partition `cats` into `featured` (`is_hot || is_featured`) and `rest` (everything else, original order preserved).
   - Strip 1 = `featured.slice(0, 4)` + `rest.slice(0, 12)` → up to 16 items.
   - Strip 2 = `featured.slice(4, 8)` + `rest.slice(12, 24)` → up to 16 items.
   - If Strip 2 ends up empty, render only Strip 1 (no empty row).

2. **Card width so 4 fit on mobile without scrolling**
   - Current `w-28` (112px) + `gap-3` (12px) overflows a ~358px content area (4×112 + 3×12 = 484px).
   - New card width: `w-[calc((100%-36px)/4)]` (accounts for 3 × 12px gaps) on mobile, `sm:w-32` on desktop.
   - Keep `snap-start shrink-0`, rounded card, badge, image, label, count — no visual changes per card.

3. **Layout**
   - Render two `<div>` scrollers stacked with `space-y-3` (or `mt-3` on the second), each using the existing classes:
     `-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden`.
   - Loading skeleton: render two rows of 4 skeleton cards using the same width formula.
   - Empty state unchanged.

## Out of scope

- No DB, hook, routing, sort logic, or other home-section changes.
- No arrows/pagination — native swipe/trackpad scroll only.
- `/products` page and `src/components/products/CategoryGrid.tsx` unchanged.
