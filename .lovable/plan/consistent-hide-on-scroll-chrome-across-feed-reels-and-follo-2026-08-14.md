# Consistent hide-on-scroll chrome across Feed, Reels and Following

## Problem

The header, ad, chips, bottom tab bar and Post button hide on scroll-down and reappear on scroll-up only when the page itself scrolls. Reels does not scroll the page — it is a full-height inner container with its own vertical snap scrolling (`src/components/reels/ReelsView.tsx:177`), so the window scroll listener in `src/hooks/useScrollDirection.ts` never fires and the chrome stays fixed.

## What will change

1. **Shared chrome-visibility state**
   Introduce a small provider (`ChromeVisibilityContext`) holding `hidden` plus a `reportScroll(currentY)` function that applies the existing direction/threshold logic. Mount it in `Layout` so header, bottom tab bar, chips, ad slot and the floating Post button all read one source of truth instead of each running its own window listener.

2. **Window scrolling keeps working**
   The provider itself keeps the window scroll listener (same threshold and top-offset behaviour as today), so the Feed, Following, Bulletin and every other page behave exactly as they do now.

3. **Reels feeds the same state**
   `ReelsView` calls `reportScroll` from its existing `onScroll` handler on the snap container, so swiping to the next reel hides the chrome and swiping back up reveals it — identical timing and animation to the feed.

4. **Reels height follows the chrome**
   Reels currently reserves fixed space for header + bottom bar (`h-[calc(100vh-10rem)]`). It will switch to a full-viewport height with the chrome overlaying it, so a hidden header/bottom bar yields a true full-screen reel instead of leaving a black gap.

5. **Reset on tab switch**
   Changing the chip (Feed / Reels / Following / Bulletin) resets the chrome to visible so users never land on a new tab with hidden navigation.

## Technical notes

- New file: `src/contexts/ChromeVisibilityContext.tsx` (provider + `useChromeHidden()` and `useReportScroll()` hooks).
- `src/hooks/useScrollDirection.ts` becomes the internal direction logic used by the provider; existing call sites in `Header.tsx`, `MobileBottomTabBar.tsx` and `Home.tsx` switch to `useChromeHidden()`.
- No backend, data or styling-token changes; purely layout/presentation.
