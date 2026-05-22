## Goal
Make the home page fully mobile-safe so product/category/member cards never extend past the viewport on phone screens.

## What I’ll change
1. Update the home-section header rows so titles and action links stack safely on small screens instead of forcing extra width.
2. Tighten the category and recent-listings grid items so every card can shrink within a 2-column mobile grid.
3. Add missing `min-w-0` / width constraints to links and card content wrappers where text or media can force overflow.
4. Review the featured-members and featured-brands home sections for the same mobile overflow pattern and apply the same containment rules where needed.
5. Validate the result in the mobile preview and confirm the home screen no longer horizontally spills.

## Technical details
- Files likely involved:
  - `src/components/home/FeaturedCategoriesSection.tsx`
  - `src/components/home/MarketplacePulse.tsx`
  - `src/components/home/FeaturedBrandsStrip.tsx`
  - `src/components/layout/Header.tsx` if the sticky header is contributing width pressure on mobile
- Fix approach:
  - convert `justify-between` mobile header rows to stacked/flexible layouts
  - add `min-w-0` to grid children/cards where truncation currently can’t take effect
  - ensure card links use `block`/`min-w-0` so they don’t size to content
  - keep the existing design; this is a containment/responsiveness fix only

## Validation
- Check the home page at the current phone viewport.
- Confirm category cards, recent listings, and featured members fit fully inside the screen.
- Confirm no horizontal spill remains while vertical scrolling still works normally.