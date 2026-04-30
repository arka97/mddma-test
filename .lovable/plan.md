## Header search bar tweaks

UI-only changes to `src/components/layout/Header.tsx`.

### Changes

1. **Placeholder text** — change "Search commodities…" to "Find Sellers…" (desktop + mobile inputs).
2. **Height** — match the adjacent Login button (`h-8`). Add `py-0` to the Input to override its default `py-2` so rendered height is identical to the button.
3. **Width** — reduce desktop search from `w-56` (224px) to `w-40` (160px) so the nav links (Home, Directory, Products, Market, Community, Membership) sit visually centered between the logo and the right-side controls.
4. **No load animation** — remove the `animate-fade-in` class from the desktop search `<form>` so it appears instantly without any fade/slide transition when scrolling triggers it.

### Technical detail

In `Header.tsx`, the desktop search block:

```tsx
<form ... className="relative animate-fade-in">
  ...
  <Input
    placeholder="Search commodities…"
    className="h-8 w-56 pl-8 text-xs bg-background"
  />
</form>
```

becomes:

```tsx
<form ... className="relative">
  ...
  <Input
    placeholder="Find Sellers…"
    className="h-8 w-40 pl-8 py-0 text-xs bg-background"
  />
</form>
```

Mobile menu Input placeholder also updated to "Find Sellers…".

No business logic, routes, or other files affected.