## Goal

Make the navigation menu hide when the user scrolls down and slide back in when they scroll up. The live market ticker stays pinned at the top at all times.

## Behavior

- At top of page: ticker + menu both visible (current state).
- Scrolling **down** past ~80px: menu slides up out of view; ticker stays pinned.
- Scrolling **up** any amount: menu slides back in immediately under the ticker.
- Mobile menu (hamburger dropdown): if open while scrolling, keep menu visible (don't hide mid-interaction).

## Implementation

**File:** `src/components/layout/Layout.tsx`
- Split the current single sticky wrapper into two stacked sticky layers:
  - Outer sticky: `MarketTicker` only — `sticky top-0 z-50`, always visible.
  - Inner sticky: `Header` — `sticky top-0 z-40`, with a transform that toggles between `translate-y-0` (visible) and `-translate-y-full` (hidden), plus a `transition-transform duration-300`.

**File:** `src/components/layout/Header.tsx`
- Add a small scroll listener (or extract into a `useScrollDirection` hook in `src/hooks/`) that tracks `window.scrollY` and last direction.
- State: `hidden` boolean. Set `hidden=true` when scrolling down past 80px; `hidden=false` when scrolling up or near top.
- Don't hide while `mobileMenuOpen` is true.
- Apply `-translate-y-full` class conditionally on the `<header>` element.

## Technical notes

- Use `requestAnimationFrame` throttling inside the scroll handler to keep it cheap.
- `top` offset for the header sticky: since the ticker is roughly 28px tall, header sits at `top-0` within its own sticky context — the ticker pushes it down naturally because both are in normal flow above `<main>`.
- Tailwind classes only; no new dependencies. Uses existing semantic tokens.

## Out of scope

- No change to ticker content or styling.
- No change to TrustStrip placement (stays below header, scrolls away normally).
- No change to footer or any page content.
