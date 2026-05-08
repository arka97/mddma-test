# Fix: "Install App" button does nothing on iOS / Android

## Root cause

The button is wired to two paths in `useInstallPrompt`:

1. **Native prompt** (`canInstall`) — only fires on Android/desktop Chromium **after** the browser fires `beforeinstallprompt`. Chrome Android requires a registered service worker with a fetch handler to fire that event. We intentionally have no service worker (per Lovable PWA guidance), so `beforeinstallprompt` never fires → `canInstall` stays `false`.
2. **iOS help dialog** (`showIOSHelp`) — supposed to render on iPhone/iPad Safari.

Today the hero button only renders when `isAvailable = canInstall || showIOSHelp`. Net effect:

- **Android Chrome**: `isAvailable` is `false` → the button on the homepage hero is hidden, or appears briefly and then hides. If a user does click it (e.g. on `/install`), nothing else happens because there is no `deferred` event and no fallback route on Android.
- **iOS Safari**: should open the iOS instructions dialog, but the same logic path that gates Android also misfires when other browsers (Chrome iOS, in‑app browsers like WhatsApp/Instagram) report as iOS but don't expose Add‑to‑Home‑Screen.
- **In‑app browsers** (Instagram, LinkedIn, Gmail webview) on either OS: install is impossible; today we silently do nothing.

## Plan (frontend only, no service worker)

### 1. Always show a useful response on click

Update `src/components/pwa/InstallAppButton.tsx` so clicking the button **always** does one of:

- Trigger the native install prompt (Android/desktop Chromium when available).
- Open the help dialog with the right OS‑specific steps (iOS Safari, Android Chrome, desktop Chromium, in‑app browser).
- Show a clear "Open in Safari/Chrome to install" message inside the dialog when we detect an in‑app webview.

Concretely:

- Remove the `if (!isAvailable && !showAlways) return null` early‑return so the button renders on all mobile/desktop contexts (it will still hide when `isInstalled` is true).
- Keep the existing native prompt path; on failure or unavailability, always open the dialog instead of doing nothing.

### 2. Expand the help dialog content

In the same component:

- Add a third branch for **in‑app browsers** (detect `FBAN|FBAV|Instagram|Line|WhatsApp|wv` in UA): instruct the user to tap the menu (⋯) and choose "Open in Safari" (iOS) or "Open in Chrome" (Android), then retry install.
- Tighten the **iOS** branch: detect Chrome iOS (`CriOS`) and Firefox iOS (`FxiOS`) and tell the user that Add‑to‑Home‑Screen on iOS only works in Safari — include a "Copy link" action.
- Keep current Android Chrome and desktop Chromium guidance.

### 3. Harden detection in `src/hooks/useInstallPrompt.ts`

- Add `isInAppBrowser` flag based on UA sniff.
- Expose `canInstall`, `isIOS`, `isInAppBrowser`, `isInstalled`, `promptInstall` — drop the now‑unused `isAvailable`/`showIOSHelp` gating since the button always renders.
- Keep listening for `beforeinstallprompt` and `appinstalled` exactly as today.

### 4. Manifest sanity check

`public/manifest.json` already has `display: standalone`, icons, name, start_url. No changes needed; do **not** add a service worker (Lovable guidance forbids it without explicit need, and the user only wants installability, not offline).

### 5. Visibility on the hero

Pass `showAlways` to the hero `<InstallAppButton>` in `src/components/home/HeroSection.tsx` so it never disappears on Android — clicking always opens the dialog with manual install steps.

## Files to edit

- `src/hooks/useInstallPrompt.ts` — add in‑app browser detection, simplify exposed flags.
- `src/components/pwa/InstallAppButton.tsx` — always render (unless installed), always respond to click, add in‑app browser dialog branch, refine iOS branch for non‑Safari iOS browsers.
- `src/components/home/HeroSection.tsx` — pass `showAlways` to the hero install button.

## Out of scope

- No service worker, no `vite-plugin-pwa`, no offline caching.
- No changes to `manifest.json`, routing, or other pages.
- No backend changes.

## How to verify

- **iPhone Safari**: tap Install App → iOS dialog with Share → Add to Home Screen steps.
- **iPhone Chrome / in‑app webview**: tap Install App → dialog instructs to open in Safari.
- **Android Chrome**: tap Install App → either native prompt (if Chrome offers it) or dialog with menu → Install app steps.
- **Android in‑app webview** (Instagram/LinkedIn): tap Install App → dialog instructs to open in Chrome.
- **Desktop Chrome/Edge**: tap Install App → native prompt or dialog with address‑bar install icon steps.
- **Already installed (standalone)**: button is hidden.
