## Goal

Reintroduce visual hierarchy and demarcation while keeping the platform light. Combine three things: **layered surface tones**, **zebra section rhythm**, and **gold heritage dividers**, plus bring the **footer back to navy** as a strong anchor.

## Three-tone surface system

Add a third surface token so sections can alternate between three distinct shades — not just two near-identical ivories.

In `src/index.css`:

```css
--background: 45 40% 96%;   /* ivory page (unchanged) */
--card: 0 0% 100%;           /* pure white surfaces (unchanged) */
--muted: 38 35% 91%;         /* warmer tinted (slight gold) — bumped from 45 30% 93% */
--surface-tint: 215 30% 94%; /* NEW: soft navy-tinted band */
--border: 38 25% 82%;        /* slightly stronger so edges read */
```

Tailwind: extend `colors.surface = "hsl(var(--surface-tint))"` so we can use `bg-surface`.

## Section rhythm (homepage)

Concrete order with three-tone zebra and gold dividers between every major block:

```
[Header — white]
[Ticker — muted ivory]
[TrustStrip — muted]
[Hero — white→muted gradient + decorative gold motif]
─── gold divider ───
[AdBanner — white]
─── gold divider ───
[FeaturedCategories — surface-tint (cool)]
─── gold divider ───
[RecentListings — white]
─── gold divider ───
[WhyMddma — muted (warm)]
─── gold divider ───
[FeaturedMembers — white]
─── gold divider ───
[Community — surface-tint (cool)]
─── gold divider ───
[News — white]
─── gold divider ───
[Sponsors — muted]
[Footer — DEEP NAVY (anchor)]
```

Files: edit each section's outer `<section>` className per the rhythm above. No content changes.

## Gold heritage divider component

New file `src/components/brand/GoldDivider.tsx`. Renders the line-and-dot motif from the logo:

```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex items-center gap-3 py-3">
    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-gold/60" />
    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
    <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/40 to-gold/60" />
  </div>
</div>
```

Optional `compact` prop for tighter spacing. Drop one between every section in `src/pages/Index.tsx`.

## Hero — give it presence again

`src/components/home/HeroSection.tsx`:
- Background: replace flat `bg-cream` with `bg-gradient-to-b from-card via-cream to-muted` so it has top-to-bottom depth.
- Add a thin gold rule above the search bar: a `GoldDivider` directly above the H1.
- Strengthen the search card: `shadow-2xl ring-1 ring-navy/5` instead of a flat white box.
- Keep the navy-text/gold-accent treatment.

## Footer — back to deep navy (anchor)

Revert `src/components/layout/Footer.tsx` to `bg-primary text-primary-foreground` (its original state). Reasons:
- Gives the long page a definitive bottom edge.
- Lets the white/ivory body breathe more brightly by contrast.
- Keeps the three "light" primary surfaces (header, hero, body) clearly the "stage", with a navy "ground" beneath.

Restore the navy-friendly link/heading classes (`text-accent` headings, `text-primary-foreground/70` body links, `bg-primary-foreground/95` logo tile, `bg-accent/10 border-accent/20 text-accent` pill buttons, `border-primary-foreground/20` bottom rule). This is essentially a revert of Footer.tsx from the previous turn.

## Header — keep light, sharpen the edge

`src/components/layout/Header.tsx`:
- Keep `bg-card`.
- Replace the plain `border-b border-border` with `border-b-2 border-gold/40` (gold hairline) + `shadow-sm`.
- Add a 1px navy-tinted underline-on-active using existing `burgundy-underline` (already there).

## Ticker — gold sandwich

`src/components/layout/MarketTicker.tsx`:
- Wrap with both `border-t border-gold/30` and `border-b border-gold/30` so it reads as a distinct ribbon, not blurring into the header.

## Cards — lift them off the surface

`src/components/ui/card.tsx`:
- Default already has `border bg-card shadow-sm`. Keep, but bump default classname to `border border-border/80 bg-card shadow-[0_1px_3px_hsl(var(--navy)/0.06)]`.
- The existing `.card-hover` utility already adds `hover:shadow-lg hover:-translate-y-1` — leave it.

## Out of scope

- No change to typography or color tokens beyond the three surface adjustments above.
- No change to logic, routes, data, or button variants.
- Inner pages (Directory, Products, etc.) inherit the new tokens automatically; we will not touch them in this pass — they can be tuned later if they still look flat.

## Files touched

1. `src/index.css` — add `--surface-tint`, bump `--muted` warmth, slightly darker `--border`.
2. `tailwind.config.ts` — add `surface` color token.
3. `src/components/brand/GoldDivider.tsx` — new component.
4. `src/pages/Index.tsx` — insert `<GoldDivider />` between sections.
5. `src/components/home/HeroSection.tsx` — gradient bg, ring on search card, gold rule above headline.
6. `src/components/home/FeaturedCategoriesSection.tsx` — `bg-surface`.
7. `src/components/home/RecentListingsSection.tsx` — `bg-card` (already light, set explicitly).
8. `src/components/home/WhyMddmaSection.tsx` — `bg-muted`.
9. `src/components/home/FeaturedMembersSection.tsx` — `bg-card`.
10. `src/components/home/CommunitySection.tsx` — `bg-surface`.
11. `src/components/home/NewsSection.tsx` — `bg-card`.
12. `src/components/home/SponsorsSection.tsx` — `bg-muted`.
13. `src/components/layout/Header.tsx` — gold hairline + shadow.
14. `src/components/layout/MarketTicker.tsx` — gold top/bottom hairlines.
15. `src/components/layout/Footer.tsx` — revert to navy anchor.
16. `src/components/ui/card.tsx` — slightly stronger default shadow.

## Visual outcome

Three crisp surface tones (white, warm ivory, cool ivory-tint) alternating down the page, separated by gold hairline-with-dot dividers, capped by a navy footer. Hero gets depth via gradient + a real shadowed search card. The platform reads light overall, but each block now has a clear edge.
