
## Mobile / PWA polish pass

### 1. Use new MDDMA logo as PWA / mobile icon
- Copy `user-uploads://MDDMA_Mobile.png` to `public/icon-192.png`, `public/icon-512.png`, `public/icon-512-maskable.png`, and `public/apple-touch-icon.png` (resized appropriately via sharp/imagemagick).
- Add `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` in `index.html` if missing. `manifest.json` already references the icon paths — no manifest change needed.

### 2. Mobile menu opens with keyboard popping up
Cause: the search `<Input>` is the first focusable element in `SheetContent`, and Radix auto-focuses it on open → mobile keyboard appears, hiding the menu.
Fix in `src/components/layout/Header.tsx`:
- Add `onOpenAutoFocus={(e) => e.preventDefault()}` to `<SheetContent>`.
- Move the search field **below** the nav links so users see Home/About/Directory/etc. first.

### 3. Hide Install button when app is already installed
`InstallAppButton` already returns `null` if `isInstalled`, but the **Footer** has a separate hardcoded "Install App" button to `/install` that always shows.
Fix in `src/components/layout/Footer.tsx`:
- Use `useInstallPrompt()` and conditionally render the Install App button (hide when `isInstalled`).

### 4. MDDMA logo barely visible in mobile header
`Logo variant="mark"` renders the small navy crest on a near-white header → low visibility.
Fix in `src/components/layout/Header.tsx`:
- Bump to `h-9 w-9` and always render the "MDDMA" wordmark next to it (remove `hidden sm:inline`), so brand reads cleanly on mobile.
- Optionally swap to `variant="horizontal"` on `sm+` for a richer mark.

### 5. Storefront layout misaligned on mobile
`src/pages/Storefront.tsx`:
- Owner toolbar uses `flex-wrap` with `View as buyer / Edit company / Edit catalog` buttons that overflow horizontally on narrow screens. Stack vertically below `sm` (`flex-col sm:flex-row`, full-width buttons on mobile).
- Product Catalog table forces horizontal scroll on mobile. Replace with a card list on `<sm` (Media + name + price range + Request Price / +Cart buttons stacked) and keep table from `sm:` upwards.
- Stats grid: switch to `grid-cols-2` on mobile (already) but tighten gap/padding.

### 6. Clicking a product opens page scrolled to footer + footer logo doesn't scroll to top
Cause: no scroll restoration on route change. React Router preserves scroll position.
Fix:
- Create `src/components/ScrollToTop.tsx` (uses `useLocation`, calls `window.scrollTo(0,0)` on pathname change).
- Mount it inside `<BrowserRouter>` in `src/providers/AppProviders.tsx` (or wherever Router lives), above `<AppRoutes />`.
This fixes both the product-page issue and the footer-logo click.

### 7. General latency / page-switch slowness
Investigate and apply quick wins:
- Routes are already lazy-loaded; add `<link rel="modulepreload">` hints for the most-visited routes (Index, Directory, Products) by importing them eagerly only on the home page idle.
- Ensure React Query has sensible `staleTime` (5 min) and `gcTime` so repeat navigations don't refetch (`src/lib/queryClient.ts`).
- Audit `Index.tsx` for above-the-fold queries that block paint; defer the MarketTicker and FeaturedBrandsStrip queries with `Suspense`/skeletons.
- Heavy third-party: confirm no analytics/embed scripts block main thread on every nav.
- If backend queries are the bottleneck, suggest the user upgrade Lovable Cloud instance size (Backend → Advanced settings → Upgrade instance) — only after the frontend wins above are in.

### Files touched
- `public/icon-192.png`, `public/icon-512.png`, `public/icon-512-maskable.png`, `public/apple-touch-icon.png` (replaced)
- `index.html` (apple-touch-icon link, if needed)
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/pages/Storefront.tsx`
- `src/components/ScrollToTop.tsx` (new)
- `src/providers/AppProviders.tsx` (mount ScrollToTop)
- `src/lib/queryClient.ts` (staleTime tweak)

Ready to implement on approval.
