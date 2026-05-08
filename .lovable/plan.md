## Add "Install App" button (PWA install prompt)

The project already has a valid `manifest.json` and proper iOS/Android meta tags in `index.html`, so the site is technically installable. We just need to surface an in-app install button instead of relying on the browser menu.

No service worker will be added (per project's PWA policy — manifest-only install is enough and avoids preview-iframe caching issues).

### What gets built

1. **`useInstallPrompt` hook** (`src/hooks/useInstallPrompt.ts`)
   - Listens for `beforeinstallprompt` (Android/Chromium) and stashes the event.
   - Detects iOS Safari (no `beforeinstallprompt`) → exposes a flag to show manual "Add to Home Screen" instructions.
   - Detects already-installed state via `display-mode: standalone` / `navigator.standalone` and hides itself.
   - Exposes `{ canInstall, isIOS, isInstalled, promptInstall() }`.

2. **`InstallAppButton` component** (`src/components/pwa/InstallAppButton.tsx`)
   - Gold/accent button with a download icon, label "Install App".
   - On Android/Chromium: calls `promptInstall()` directly.
   - On iOS: opens a small dialog/sheet with step-by-step "Tap Share → Add to Home Screen" instructions and a screenshot-style illustration (CSS only).
   - On desktop browsers without prompt support: hidden by default (optional `showAlways` prop to force-render with iOS-style instructions).
   - Renders nothing when `isInstalled`.

3. **Surfacing the button**
   - **Header (`src/components/layout/Header.tsx`)**: small icon-only variant in the top bar on mobile widths only (next to the user/login button), so it's reachable without scrolling.
   - **HeroSection (`src/components/home/HeroSection.tsx`)**: full-size "Install App" CTA below the existing hero buttons, visible on all viewports (only renders if installable / iOS).
   - **Footer**: a quiet text link "Install MDDMA app" as a fallback discovery point.

4. **Dedicated `/install` route** (`src/pages/Install.tsx`, registered in `src/App.tsx`)
   - Landing page explaining benefits (works offline-ish, app icon, fullscreen) and platform-specific install steps for Android, iOS, and desktop.
   - Big primary install button at the top.
   - Useful for sharing a single link via WhatsApp/email to members.

### Technical notes

- No new dependencies. Pure browser APIs.
- `beforeinstallprompt` is non-standard typed; we declare a minimal `BeforeInstallPromptEvent` interface in the hook.
- Design uses existing semantic tokens (`bg-accent text-primary` for the button, matching the current Login button styling) — no hardcoded colors.
- The button is hidden when the app is already installed, and on browsers (e.g. Firefox desktop) where install isn't supported and the user isn't on iOS.
- We will NOT add `vite-plugin-pwa` or a service worker, per project guidelines. Installability is achieved via the existing manifest only; offline support is out of scope.

### Files to add
- `src/hooks/useInstallPrompt.ts`
- `src/components/pwa/InstallAppButton.tsx`
- `src/pages/Install.tsx`

### Files to edit
- `src/App.tsx` — add `/install` route
- `src/components/layout/Header.tsx` — mount compact install button
- `src/components/home/HeroSection.tsx` — mount hero install CTA
- `src/components/layout/Footer.tsx` — add quiet install link
