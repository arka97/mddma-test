# One-tap install for the G-BAU-G app

## Why install isn't one tap today

The app has a manifest and icons, but no app-shell service worker (`public/push-sw.js` deliberately has no fetch handler). Chrome and Edge only fire the native install prompt (`beforeinstallprompt`) when a service worker with a fetch handler is present — so `canInstall` is almost always false and the Install button falls back to a multi-step instruction dialog instead of installing.

## What changes

1. **Real one-tap install on Android / Chrome / Edge**
   Add a generated app-shell service worker so the browser considers the app installable. The existing Install button then triggers the native prompt: one tap, one confirm, icon on the home screen.

2. **Push notifications keep working**
   Only one service worker can own the `/` scope, so the current push worker logic is imported into the generated worker instead of being registered separately. Push subscribe/unsubscribe keeps working unchanged from the user's point of view.

3. **A visible, dismissible install bar (not buried)**
   The install nudge currently lives only on the dashboard. Show a slim bottom install bar on the home feed for signed-in and guest users once the prompt is available (dismissible, remembered in local storage). Android/Chrome gets a single "Install" tap; iOS Safari gets the short "Share → Add to Home Screen" sheet, which is the only path Apple allows.

4. **Simplify the fallback dialog**
   Keep the existing per-platform instructions, but only show them when the browser truly can't install. When a native prompt exists, never show instructions.

5. **Push install to the front so more members actually install**
   - Header: the Install button becomes visible on mobile too (currently hidden below `sm`), styled as a gold pill labelled "Get App".
   - Home feed: a full-width "Install the G-BAU-G app" card appears in the feed once (after a few posts) for browser users, with a one-tap Install action and a "Why install" line (faster, home-screen icon, alerts).
   - Discover page: a compact install strip near the top, matching the existing card styling.
   - Account drawer: promote the existing Install entry to a highlighted row with app icon and "Recommended" tag.
   - After sign-up / first login: a one-time install sheet instead of a silent redirect.
   - Notifications: when a member enables alerts in a browser tab, mention that installing the app makes alerts reliable, with the Install action inline.
   - All surfaces read one shared dismissal + "already installed" state, so an installed or opted-out user sees none of them and nothing nags twice.


## Technical notes

- Add `vite-plugin-pwa` in `generateSW` mode: `registerType: "autoUpdate"`, `injectRegister: null`, `devOptions.enabled: false`, output at `/sw.js`, `importScripts: ["/push-sw.js"]` so push handlers live inside the generated worker.
- Runtime caching: `NetworkFirst` for HTML navigations, `CacheFirst` only for same-origin hashed build assets; exclude `/~oauth` from navigation fallback.
- New guarded wrapper `src/lib/registerSW.ts`: refuses registration (and unregisters `/sw.js`) unless `import.meta.env.PROD`, not in an iframe, and host is not a Lovable preview/dev host (`id-preview--*`, `preview--*`, `*.lovableproject.com`, `*.lovableproject-dev.com`, `*.beta.lovable.dev`); supports `?sw=off` kill switch. Called once from `src/main.tsx`.
- `src/lib/push.ts`: point `SW_URL` at `/sw.js` and unregister a stale `/push-sw.js` registration so existing installs migrate cleanly.
- `useInstallPrompt`: also treat `navigator.getInstalledRelatedApps` / repeat `appinstalled` as installed; no behavioural change otherwise.
- New `src/components/pwa/InstallBar.tsx` rendered from `src/pages/Home.tsx` above the bottom tab bar, respecting safe-area insets and the existing hide-on-scroll chrome; dismissal key `mddma:install-bar-dismissed`.
- Offline caching only affects the published app, not the Lovable editor preview.
