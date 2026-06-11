## Goal
Revert the homepage section layout from 6 stacked full-width rows back to a **2-column × 3-row inner grid** (desktop), while keeping the existing order and component set.

## Change scope
Single file: `src/pages/Index.tsx`. No component, route, data, or DB changes.

## Layout

Below `TodayHeader` + `LiveRatesTicker`, the 6 sections render in a responsive grid:

- Mobile (`<lg`): single column, full width, same order.
- Desktop (`lg+`): 2 columns × 3 rows, row-major order:

```text
┌───────────────┬───────────────┐
│ 1 Market      │ 2 Market News │
├───────────────┼───────────────┤
│ 3 Humor       │ 4 Circulars   │
├───────────────┼───────────────┤
│ 5 Brands      │ 6 Member Dir. │
└───────────────┴───────────────┘
```

Implementation: wrap the 6 sections in `<div class="grid gap-5 lg:grid-cols-2">`.

## Brands handling
`FeaturedBrandsStrip` is currently bled to viewport edges via `-mx-4 sm:-mx-6 lg:-mx-8`. Inside a 2-col grid that breaks the cell. Remove the negative-margin wrapper so Brands sits inside its grid cell like the other sections. (No edits to `FeaturedBrandsStrip` itself.)

## Out of scope
- No changes to TodayHeader, LiveRatesTicker, AdSlot, or any of the 6 section components.
- No changes to mobile order or spacing tokens beyond `gap-5`.
- No reordering — order stays Market → Market News → Humor → Circulars & Notices → Brands → Member Directory.
