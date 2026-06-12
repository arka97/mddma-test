## Goal
Fix the "Featured" badge on category tiles in /products Browse Categories — currently overflows/clips on mobile (4 cols, ~80px tiles).

## Change
File: `src/components/products/CategoryGrid.tsx` (lines 57-61)

Make the badge compact: on mobile show just the star icon in a small chip; on `sm+` show the full "Featured" label.

```tsx
{cat.is_featured && (
  <span className="absolute top-1 right-1 z-10 inline-flex items-center gap-0.5 rounded bg-accent px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide text-accent-foreground shadow sm:top-2 sm:right-2 sm:px-1.5 sm:text-[10px]">
    <Star className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
    <span className="hidden sm:inline">Featured</span>
  </span>
)}
```

## Out of scope
- Grid columns, card layout, data, other tiles/sections.
