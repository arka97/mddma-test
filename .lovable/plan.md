# Fix mobile alignment & overflow

Three distinct issues visible in the screenshots at ~390px.

## 1. Dashboard → RFQ Inquiries table (vertical letters)

**Cause:** The table is wrapped in `overflow-x-auto` but has `w-full` and no `min-w`, so on a narrow card it shrinks to the container width and squeezes each cell down to 1 character wide (text wraps letter-per-line).

**Fix:** `src/pages/Dashboard.tsx` line 296 — add `min-w-[760px]` to the table so it keeps its natural width and the wrapper actually scrolls horizontally.

```tsx
<table className="w-full min-w-[760px] text-sm">
```

## 2. Storefront owner toolbar — "Edit company" clipped

**Cause:** `src/pages/Storefront.tsx` line 124 — `grid grid-cols-3 gap-1.5` on mobile makes each button ~110px wide; the label "✏️ Edit company" overflows and the button visibly clips beyond its column.

**Fix:** Switch the mobile layout to a single column of stacked full-width buttons, keep `sm:flex` for tablet/desktop unchanged.

```tsx
<div className="grid grid-cols-1 gap-1.5 sm:flex sm:items-center sm:gap-2">
```

## 3. /account/company — "Business Profile" wraps mid-word

**Cause:** `src/pages/account/CompanyPage.tsx` lines 142-155 — the header row is `flex items-center justify-between` with a 3xl heading on the left and a Verified badge + "View store" button on the right. At 390px the right side eats most of the row, leaving the heading ~140px wide so "Business" wraps to "Busines / s".

**Fix:** Stack the header on mobile and shrink the h1 to `text-2xl sm:text-3xl`. Use `flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`.

```tsx
<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
  <div>
    <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
      <Building2 /> Business Profile
    </h1>
    <p className="text-muted-foreground text-sm mt-1">This is your public storefront.</p>
  </div>
  <div className="flex items-center gap-2 flex-wrap">
    ...
  </div>
</div>
```

## Files touched

- `src/pages/Dashboard.tsx` — 1 line
- `src/pages/Storefront.tsx` — 1 line
- `src/pages/account/CompanyPage.tsx` — header block (~5 lines)

No business logic, no data changes — pure presentation.
