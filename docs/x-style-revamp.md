# G-BAU-G — X.com-style mobile-first revamp

A whole-app re-skin to an X.com look, verified in a real browser (mobile + desktop)
screen by screen. The Supabase backend is untouched. App name stays **G-BAU-G**.

> Context: the first attempt was merged then reverted because it only restyled the
> (auth-gated) feed — a guest still saw the old cream/gold dashboard on every public
> screen. This pass fixes the *visible, verifiable* surfaces first and was checked with
> screenshots at each step.

## Design system (repaints every screen at once)
- `index.css` tokens → X palette: white surface, `#0F1419` ink, **X-blue `#1D9BF0`**
  primary; "lights out" black for dark. Legacy `--gold*` tokens remapped to blue so old
  gold accents read blue everywhere without touching each file.
- `Card` flattened to border-only (no drop shadows) — the main "dashboard" tell.
- Buttons flattened to X pills; social tokens `--like` / `--repost` / `--verified` added.

## Screens verified
- **Home** — new bold monochrome hero, blue CTAs, flat quick-action tiles (`HomeHero`,
  `QuickActionsGrid`).
- **Header / bottom tabs** — X pill search; icon-forward tab bar with the user avatar on
  the Account tab.
- **Footer** — was a full-bleed blue slab; now a clean bordered footer.
- **Login / Membership / Directory / Products** — clean via the token system; ProductPage
  hero de-slabbed; fixed an `About` blue-on-blue regression.

## Feed (X mechanics)
- Tap an image → full-screen **lightbox** (keyboard / swipe / counter).
- Tap a handle/avatar → storefront profile (resolved via `companies_public.owner_id → slug`),
  verified check, **Follow / Following** button.
- Tap a post → `/market/:postId` **detail page** with inline replies.
- X action bar (reply · repost · like · views · bookmark · share); edge-to-edge 600px feed
  column with hairline dividers; round X-blue compose FAB.

## Honest caveat
Follow / repost / bookmark are **client-side** (localStorage, swappable interface) because
there is no `follows` table and the brief said keep the backend as-is. The market feed is
gated to verified members by existing product rules — restyled, not un-gated.

## Backend
Untouched. Two **read-only** helpers added against existing objects: `getPost(id)` and
`listCompaniesByOwners(ids)` (public view only).

## Next
`follows`/`bookmarks` tables to make the social graph real, a Following/For-you feed toggle,
richer profile pages (`/u/:id` for authors without a storefront), unified Explore search.

Verified: `tsc` clean · `eslint` 0 errors in changed files · `vite build` OK · 11/11 tests pass.
