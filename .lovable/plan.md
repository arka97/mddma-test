# Restore scrolling, keep overflow fix

## Root cause

Last commit added to `src/index.css`:
```css
html, body { overflow-x: hidden; max-width: 100vw; }
#root { overflow-x: clip; max-width: 100vw; }
```

Setting `overflow-x: hidden` on `<html>` breaks keyboard (Arrow/PageDown/Space) and some mouse-wheel scenarios because the html element is no longer the viewport scroller — and combining it with `overflow-x` on `body` creates an inconsistent scroll container the browser can't focus. `max-width: 100vw` on html/body also conflicts with native scrollbar gutter on desktop.

## Fix

Replace the html/body overflow rules with the safe pattern that works across all devices:

```css
html { /* leave alone — must remain the viewport scroller */ }
body { overflow-x: clip; }   /* clip ≠ hidden: doesn't create a scroll container */
#root { overflow-x: clip; }
```

- `overflow-x: clip` prevents horizontal bleed without spawning a scroll container, so vertical scrolling stays on `<html>` where keyboard + wheel expect it.
- Remove `max-width: 100vw` (causes desktop scrollbar layout shift).
- Keep the `img/video { max-width: 100% }` and `overflow-wrap: anywhere` rules — those were the real overflow fixes and don't affect scrolling.

## Verification
- Desktop 1280×720: arrow keys, PageDown, mouse wheel all scroll the page; no horizontal scrollbar.
- Mobile 390×844: touch scroll works; no horizontal overflow (re-check via `scrollWidth === innerWidth`).

## Out of scope
No component changes. Pure CSS revert + safer rule set.
