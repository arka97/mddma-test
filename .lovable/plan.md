## Goal

Reduce ad banner height across the app to standard IAB leaderboard ratios:
- **Mobile:** 320×50 (ratio 32:5 ≈ 6.4:1)
- **Desktop:** 728×90 (ratio 728:90 ≈ 8.09:1)

## Changes

### 1. `src/components/home/today/AdSlot.tsx` (homepage top banner)
- Replace `aspect-[16/7]` on the image wrapper with responsive aspect ratios:
  - Mobile: `aspect-[32/5]`
  - Desktop (`md:`): `aspect-[728/90]`
- Cap max width at 728px and center, so the banner doesn't stretch wider than a real leaderboard on large screens.
- Tighten card padding (`p-3` → `p-2`) and shrink the title to `text-xs` so the footer row matches the slimmer image.
- Keep "Ad" chip, carousel dots, and autoplay behavior unchanged.

### 2. `src/components/home/AdBanner.tsx` (category/sidebar placements)
- Currently renders the image at its natural height. Wrap the `<img>` in a fixed-ratio container:
  - Mobile: `aspect-[32/5]`
  - Desktop: `aspect-[728/90]` with `max-w-[728px] mx-auto`
- Use `object-cover` so existing uploaded creatives crop cleanly into the leaderboard strip.
- Reduce caption row padding to `p-2` and title to `text-xs`.

### 3. No other files touched
- `SponsorsSection.tsx` and `PartnersStrip.tsx` are text-only logo strips (no banner image), so they're out of scope.
- No DB, repository, or admin-CMS changes — image uploads remain as-is and are simply cropped via CSS.

## Technical notes

- Aspect ratio approach (rather than fixed `h-[50px] / h-[90px]`) keeps the strip crisp at all viewport widths while respecting the IAB proportions.
- `max-w-[728px] mx-auto` prevents the desktop banner from ballooning on wide screens where the page container is wider than 728px.
- Existing creatives that were authored at 16:7 will be center-cropped. Admins can re-upload true 728×90 / 320×50 artwork later; no schema change needed.
