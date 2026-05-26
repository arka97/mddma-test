## Goal

Restructure the app as a mobile-first PWA shell modeled on the reference HTMLs (Today / Members / RFQs / Circulars / Account bottom tabs), while keeping every existing page, copy, route, and design token unchanged. Desktop expands the same layout responsively — no separate desktop codebase.

## Final IA

**Bottom tab bar (mobile, sticky, safe-area aware):**
1. Today → `/` (Index)
2. Members → `/directory`
3. RFQs → `/account/rfqs` if signed in, else `/login?next=/account/rfqs`
4. Circulars → `/circulars`
5. Account → `/account/profile` if signed in, else `/login`

**Top app bar (mobile):** compact — Logo (left), Search icon (opens products search), More icon (opens "More" sheet). Existing role simulator + Install button move into the More sheet.

**"More" sheet** (right-side `Sheet`) lists every secondary route, grouped:
- Discover: Products, Brands, Storefronts, Market, Broker, Community
- Workspace: Dashboard, Account → Profile / Company / Products / Brands, Admin Moderation (admin only)
- Info: About, Membership, Apply, Install, Documents, Forms / Contact
- Auth: Sign in / Sign out

**Desktop (≥ md):** existing top `Header` with full nav renders as today. Bottom tab bar hides at `md+`. This keeps the desktop experience unchanged while mobile gets the new shell.

## Layout changes

- New `MobileTabBar` component (fixed bottom, `pb-safe`, 5 icon+label items, active state in `--accent`).
- New `MobileTopBar` component (sticky top, `pt-safe`, logo + search + more trigger).
- `Layout.tsx` becomes responsive:
  - `< md`: render `MobileTopBar` + `<main className="pb-20">` + `MobileTabBar`.
  - `≥ md`: render existing `Header` + `<main>` + `Footer` as today.
- `CartFab` reposition: bump `bottom` to clear the tab bar on mobile (`bottom-[calc(5rem+safe)]`).

## Page-level touch-ups (mobile-first, copy unchanged)

Apply consistent mobile patterns to existing pages without rewriting content:
- Container padding standardised to `px-4` on mobile, `sm:px-6 lg:px-8` on larger.
- Section spacing `py-8 sm:py-12` instead of `py-16` where used for above-the-fold blocks.
- Cards/grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/4` audit on Index, Directory, Products, Brands, Circulars, Community, Market.
- Replace any `min-w-…` desktop-assumed widths with `w-full` + `sm:min-w-…`.
- Sticky filters on Directory/Products become horizontal scroll chips on mobile.

No copy edits. No new routes. No removed routes.

## PWA polish (manifest already present, SW not required)

- `index.html`: ensure `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` (add `viewport-fit=cover` if missing) and `<meta name="apple-mobile-web-app-capable" content="yes">`, `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`, `<meta name="theme-color" content="#1B2F5E">`.
- Keep existing `manifest.json` (`display: standalone`, icons present). No service worker added — per the PWA guideline, manifest-only is enough for installability.
- `InstallAppButton` already handles install prompts; surface it in More sheet + keep `/install` page.

## Technical details

Files to add:
- `src/components/layout/MobileTabBar.tsx`
- `src/components/layout/MobileTopBar.tsx`
- `src/components/layout/MoreSheet.tsx`

Files to edit:
- `src/components/layout/Layout.tsx` — branch on `useIsMobile()`.
- `src/components/cart/CartFab.tsx` — raise bottom offset on mobile.
- `index.html` — viewport-fit + iOS meta tags (additive).
- Light responsive sweeps on: `src/pages/Index.tsx`, `Directory.tsx`, `Products.tsx`, `Brands.tsx`, `Circulars.tsx`, `Community.tsx`, `Market.tsx`, `Dashboard.tsx`, `account/*` (padding, grid cols, sticky filter chips). Copy unchanged.

Design tokens: continue using existing HSL semantic tokens (`--primary` navy, `--accent` emerald, `--brand-gold`). No new colors, no font swap.

Active-tab styling: `text-accent` + `bg-accent/10` pill on icon; inactive `text-muted-foreground`. RFQ tab shows count badge from `useCart()`.

```text
Mobile (<md)                Desktop (≥md)
┌──────────────────┐        ┌────────────────────┐
│  TopBar (sticky) │        │  Header (existing) │
├──────────────────┤        ├────────────────────┤
│                  │        │                    │
│   page content   │        │   page content     │
│                  │        │                    │
├──────────────────┤        ├────────────────────┤
│ Today│Mem│RFQ│…  │        │  Footer (existing) │
└──────────────────┘        └────────────────────┘
```

## Out of scope

- No content rewrites, no new pages, no IA renames beyond tab labels.
- No service worker / offline cache.
- No visual redesign to match Bricolage Grotesque or the reference's exact card styles (user chose to keep current tokens).
- No changes to routes, RLS, edge functions, or data model.

## Done when

- On mobile (<768px) every page renders with the new top bar + bottom tab bar; tapping each tab navigates correctly; "More" sheet exposes all secondary routes; cart FAB doesn't overlap the tab bar.
- On desktop (≥768px) the app looks and behaves exactly as today.
- All existing routes still resolve; no copy changes; no console errors.
- App installs to home screen on iOS Safari + Android Chrome and launches in standalone with the tab bar visible.
