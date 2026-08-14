# Branded app splash for installed users

Goal: when someone opens the installed G-BAU-G app, the first thing they see is a branded G-BAU-G screen instead of a blank white page.

## Why an in-app splash (not just the manifest)

Android generates its splash from the manifest's `theme_color`, `background_color` and icon. iOS shows a plain background unless custom splash images are supplied. Both are read at install time, so the ~30 people who already installed the app will not see manifest changes until they reinstall. An in-app splash renders from the app code, so it reaches everyone on their next open.

Both layers are worth doing: manifest for new installs, in-app splash for existing ones.

## What gets built

### 1. In-app splash screen (main change)

- Full-screen overlay shown on app boot: burgundy background, centered G-BAU-G logomark, "G-BAU-G" wordmark, and a small "Mumbai Dry Fruits & Dates Merchants Association" line underneath.
- Subtle entrance: logo fades and scales in, then the whole overlay fades out.
- Shown for roughly 1.2s minimum, then dismissed as soon as the first screen is ready.
- Only shown when the app is launched as an installed app (standalone display mode), so browser visitors and Lovable preview are unaffected. Optionally also on a cold browser load, once per session — recommendation: keep it installed-app only, so the website stays fast.
- Respects reduced-motion settings.

### 2. Manifest and head metadata refresh

Current manifest still carries the old navy/cream palette (`#1B2F5E`, `#FFF7EC`), which no longer matches the burgundy and gold brand.

- Update `theme_color` to burgundy `#6E1B2E` and `background_color` to `#FFFFFF`.
- Match `theme-color` in `index.html`.
- Add `apple-mobile-web-app-capable` and `apple-mobile-web-app-status-bar-style` so the iOS status bar matches the brand.
- Keep `name`, `short_name`, `start_url`, `scope`, `id` and icons unchanged — changing those can break already-installed apps.

### 3. Optional extras (say if you want these)

- iOS custom launch images (a set of per-device PNGs) for a native-feeling launch before the app code even loads.
- A one-time "You're using the G-BAU-G app" tip on first open after this update.

## Technical notes

- New `src/components/pwa/SplashScreen.tsx` rendered inside `AppProviders`/`App`, sitting above the router.
- Detection via `window.matchMedia('(display-mode: standalone)')` plus `navigator.standalone` for iOS.
- Colors from existing HSL tokens (`--primary`, `--gold`), no hard-coded utility colors.
- Logo reuses `src/assets/brand/MDDMA_Royal_Heritage_1to1.svg` / `public/brand/gbaug-logo.png`.
- No service worker is added; offline behavior is unchanged.
