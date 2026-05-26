# Collapsing Header + Rotating Ad Carousel

## 1. Header collapse-on-scroll (`src/components/layout/Header.tsx`)

Split the header into two rows that already exist:
- **Row 1 (top)** — location chip + logo + Install + Login/Avatar
- **Row 2 (bottom)** — search input

Behavior:
- On scroll down past ~24px, Row 1 collapses (height → 0, opacity → 0, `pointer-events-none`) with a 200ms transition.
- On scroll back up to top, Row 1 re-expands.
- Row 2 (search) stays sticky at top across all states. Header itself remains `sticky top-0`.
- Desktop `lg:` nav links currently live in Row 1; on `<lg` they're already hidden so collapse only affects mobile/tablet visuals. On `lg+`, keep Row 1 always visible (no collapse) to preserve desktop nav.

Implementation:
- Add a `useScrolled(threshold=24)` hook (local to Header or `src/hooks/use-scrolled.ts`) using a passive `scroll` listener with `requestAnimationFrame` throttling.
- Wrap Row 1 in a div with classes like `transition-all duration-200 overflow-hidden` and toggle `h-12 opacity-100` vs `h-0 opacity-0 pointer-events-none` based on `scrolled && !isDesktop`. Use Tailwind `lg:!h-12 lg:!opacity-100` to force-disable collapse on desktop.
- Search row stays as-is; no change to its sticky behavior (parent `<header>` already sticky).

## 2. Move ad slot under header + make it a rotating carousel

Currently `src/pages/Index.tsx` renders `<AdSlot placement="homepage-banner" />` mid-feed and again as `category-banner`. Move the homepage-banner to render **immediately below header**, above the `TodayHeader` greeting.

Changes:
- In `Index.tsx`, move `<AdSlot placement="homepage-banner" />` to the first grid row (`lg:col-span-12`), before `TodayHeader`. Keep `category-banner` slot where it is.
- Rewrite `src/components/home/today/AdSlot.tsx` to render a **rotating carousel** when multiple ads exist for that placement:
  - Use existing `src/components/ui/carousel.tsx` (embla) with `opts={{ loop: true }}` and the `embla-carousel-autoplay` plugin (already a transitive dep via embla; if not present, fall back to a `setInterval` that calls `api.scrollNext()` every 5s).
  - One ad per slide, same card styling as today (aspect-[16/7] image + title + "Learn more").
  - Show dot indicators below when >1 ad. Hide controls when only 1 ad (render as today, no carousel chrome).
  - Pause autoplay on hover/focus.

## 3. Out of scope
- No changes to `Layout.tsx`, bottom tab bar, repositories, or admin CMS.
- No DB/schema changes — uses existing `advertisements` rows for `homepage-banner` placement.
- Desktop header behavior unchanged (no collapse on `lg+`).

## Technical notes
- Files edited: `src/components/layout/Header.tsx`, `src/components/home/today/AdSlot.tsx`, `src/pages/Index.tsx`.
- New file (optional): `src/hooks/use-scrolled.ts`.
- If `embla-carousel-autoplay` isn't installed, add it via `bun add embla-carousel-autoplay` during build mode.
- Respect `prefers-reduced-motion`: skip autoplay when user prefers reduced motion.

## Done when
- Scrolling down on `/` on mobile hides the top header row; search stays pinned at top.
- Scrolling back to top reveals the top row again.
- A rotating ad carousel sits directly under the header, auto-advancing every ~5s with dot indicators; single-ad case renders without controls.
- Desktop layout unchanged structurally; ad carousel also appears at the top of the desktop grid.
