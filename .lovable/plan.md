## Goal

1. Remove the "Any origin" dropdown from the hero search bar.
2. Add a compact search input to the Header (left of the Login/avatar button) that submits to `/products?q=...&view=marketplace`. It should appear once the user has scrolled past the hero, so when they scroll up the sticky/revealed header includes a usable search.

## Changes

### `src/components/home/HeroSection.tsx`
- Remove the `Select` (origin) and the `ORIGINS` constant + `origin` state.
- Simplify `submit()` to only set `q` and `view=marketplace`.
- Hero search bar becomes: search input + "Find Sellers" button (full width on mobile, side by side on sm+).

### `src/components/layout/Header.tsx`
- Add local state `showSearch` toggled by scroll position (true when `window.scrollY > 200`, so it doesn't appear over the hero on the homepage; appears immediately on non-home pages where there is no hero).
- Add a small search form between the nav links and the login/user menu on `lg+` screens:
  - Compact `Input` (h-8, ~w-56) with search icon.
  - Submits via `navigate("/products?q=...&view=marketplace")`.
  - Rendered with a fade/slide-in transition; reserved space avoided by simply mounting it conditionally.
- On mobile (`<lg`), add the same compact search inside the existing mobile menu panel (always visible there) — no header bar crowding.
- Keep the existing hide-on-scroll-down / show-on-scroll-up behavior intact; the search just lives inside the header row.

### Behavior summary
- Homepage top: header shows logo + nav + login (no search). Hero owns the search.
- After scrolling past hero and scrolling back up: header reveals with the inline search bar to the left of Login.
- Other routes: header always shows the inline search.

No backend, routing, or data-layer changes.
