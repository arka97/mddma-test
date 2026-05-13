## Problem

On mobile (especially iOS with notch / Android with cutout), the Login button and hamburger menu in the sticky header are partially hidden behind the status bar / camera cutout, making them un-tappable.

Root cause in the current code:
- `index.html` sets `viewport-fit=cover` and `apple-mobile-web-app-status-bar-style=black-translucent`, which intentionally lets the app draw under the status bar.
- `Header.tsx` uses `sticky top-0` with a fixed `h-[52px]` row and no `env(safe-area-inset-*)` padding, so the status bar / notch overlaps the tap targets.
- The PWA `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, and `favicon.ico` were generated from the old (pre-Royal-Heritage) logo, so the home-screen icon is stale.

## Scope of changes (frontend / assets only)

### 1. Safe-area aware layout (the actual click bug)

`src/index.css` — add a small utility layer:
- Define `--safe-top`, `--safe-right`, `--safe-bottom`, `--safe-left` from `env(safe-area-inset-*)` on `:root`.
- Add helpers `.pt-safe`, `.pb-safe`, `.pl-safe`, `.pr-safe`, `.px-safe`, plus `.min-h-screen-safe` (uses `100dvh` minus insets).

`src/components/layout/Header.tsx`
- Wrap the existing `<nav>` row with `pt-safe` and add `pl-safe pr-safe` to the container so the logo, Login button, and Menu trigger never sit under the notch/cutout/rounded corners.
- Keep the 52px row height; the safe-area padding is added on top of it.
- Bump the touch target of the hamburger and Login button to a minimum of `h-10 w-10` / `min-h-[40px]` on mobile (Apple HIG / Material both recommend ≥44/48dp). Currently the menu button is `p-1.5` on a 20px icon = ~32px, which is too small even without notch overlap.

`src/components/layout/Footer.tsx` and `src/components/cart/CartFab.tsx`
- Add `pb-safe` so the footer and the floating cart button clear the iOS home indicator and Android gesture bar.

`src/components/cart/CartDrawer.tsx` and `src/components/ui/sheet.tsx` consumers (mobile sheet)
- Add `pt-safe pb-safe` to the sheet content so drawer headers/footers aren't clipped.

`src/components/layout/MarketTicker.tsx`
- Add `pt-safe` only when it sits at the very top of the viewport (it's currently inside the hero, so likely a no-op — verify during implementation).

### 2. PWA / app icon refresh (Royal Heritage)

Regenerate icons from `src/assets/brand/MDDMA_Royal_Heritage_1to1.svg` (the square stacked lockup is the right artwork for app icons — the `mark` alone is too small at 48dp):

- `public/icon-192.png` — 192×192, navy background, safe-area padded artwork.
- `public/icon-512.png` — 512×512, same.
- `public/icon-512-maskable.png` — 512×512 with the artwork inset to ~80% (Android adaptive icon safe zone, equivalent to the 108dp guideline you mentioned).
- `public/apple-touch-icon.png` — 180×180, no transparency, navy background (iOS doesn't apply masks but rejects transparent PNGs cleanly).
- `public/favicon.ico` — multi-size (16, 32, 48) from the logomark.
- `public/og-image.png` — 1200×630 social card using the horizontal lockup on ivory (replaces the current `.svg` in OG tags, which many scrapers reject).

`public/manifest.json`
- Update `theme_color` to `#1B2F5E` (Royal Heritage navy — currently `#0a1f44` from the old palette).
- Update `background_color` to `#F8F4ED` (Royal Heritage ivory — currently `#ffffff`).
- Add the maskable icon entry separately from the "any" icon (current entry uses both purposes on the same file, which Android handles poorly):
  ```json
  { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
  { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
  { "src": "/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ```

`index.html`
- Update `<meta name="theme-color">` to `#1B2F5E`.
- Point `og:image` and `twitter:image` at the new `/og-image.png` (PNG, not SVG).

## Additional recommendations (beyond your list)

These are worth doing while we're in here — happy to include or skip per your call:

1. **`100dvh` instead of `100vh`** for any full-height containers (mobile browsers shrink `vh` when the URL bar appears, causing layout jumps).
2. **`overscroll-behavior: contain`** on the cart drawer and modal scroll areas to stop the rubber-band effect from scrolling the page underneath.
3. **`touch-action: manipulation`** on all buttons/links to remove the 300ms tap delay on older Android Chrome.
4. **Disable text size auto-inflation** on iOS via `-webkit-text-size-adjust: 100%` (already in shadcn defaults, just verifying).
5. **PWA splash screens** for iOS — generate the 8 standard sizes (iPhone SE → iPad Pro) and link them with `<link rel="apple-touch-startup-image">`. Optional but makes the installed app feel native instead of flashing white.
6. **`scroll-padding-top: calc(52px + env(safe-area-inset-top))`** on `html` so anchor links don't land under the sticky header.
7. **Larger hit areas on the role simulator dropdown** in the header — same notch issue applies there on demos.
8. **Capacitor-specific:** if/when wrapping in Capacitor, set `StatusBar.setOverlaysWebView({ overlay: false })` and use `@capacitor/safe-area` to also push CSS variables — your existing `pt-safe` utility will then Just Work in the native shell too.

The safe-area items in your message (iOS safe areas, Android displayCutout, flexible insets, adaptive icons, store icon sizes) are all covered above. Items 5 and 8 here are the most impactful follow-ups.

## Out of scope

- No changes to data model, RLS, or business logic.
- No new pages or routes.
- No restyling beyond padding / icon refresh.

## Verification

- View `/` on mobile preview (375×812 and 360×800), confirm Login + Menu fully tappable below the notch.
- Open the cart drawer on mobile, confirm header and submit button are not clipped at top/bottom.
- `Application` tab in DevTools → Manifest → confirm new icons render with navy background and gold/burgundy artwork.
- Lighthouse PWA audit should still pass.
