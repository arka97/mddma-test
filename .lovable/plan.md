## Goal

Lighten the platform globally. Keep the Royal Heritage palette (Navy / Burgundy / Gold / Ivory) but flip the dark structural surfaces (hero, header, ticker, footer) to light ivory/white. Navy stays for buttons, headings, links, borders, and small accents — not as full-section background.

## Approach

Brand tokens stay the same. Only the surfaces that *use* navy as a fill change. No business-logic changes.

---

### 1. Header — light ivory bar with navy text

`src/components/layout/Header.tsx`
- Header bg: `bg-primary` → `bg-card border-b border-border` (white card on ivory page).
- Logo tile: drop the `bg-primary-foreground/95` wrap (no longer needed on a light bar).
- Nav links:
  - Inactive: `text-primary-foreground/80 hover:bg-primary-foreground/10` → `text-navy/80 hover:text-navy hover:bg-muted`.
  - Active: keep gold `bg-accent text-primary` chip + `burgundy-underline` (already on-brand).
- Login button: `bg-accent text-primary` stays (gold pops well on light).
- Mobile menu: `text-primary-foreground` icon → `text-navy`. Border divider stays.
- User menu trigger: `hover:bg-primary-foreground/10` → `hover:bg-muted`.

### 2. Market ticker — soft ivory strip with navy text

`src/components/layout/MarketTicker.tsx`
- Wrapper `bg-foreground text-background` → `bg-muted text-navy border-b border-border`.
- Live pill stays gold (`bg-accent text-primary`), but inner ping dots `bg-primary` stay (navy on gold is correct).
- Item dividers: `text-background/20` → `text-navy/20`. Item text: `text-background/90` → `text-navy/80`.

### 3. Hero section — ivory canvas, navy headings, gold accents

`src/components/home/HeroSection.tsx`
- Section: `bg-primary` → `bg-cream` (ivory). Drop the white SVG dot pattern (it was a navy-only effect); replace with a very subtle navy/2% pattern or remove entirely.
- Logo tile wrap: remove the `bg-primary-foreground/95` box (logo already designed on light).
- Heritage badge row: `text-primary-foreground/80` → `text-navy/70`, separator dot → `text-navy/30`.
- H1: `text-primary-foreground` → `text-navy`. The `<span class="text-accent">Trade Hub</span>` keeps gold. Sub-line `text-primary-foreground/90` → `text-navy/85`.
- Command bar: change `bg-background` to `bg-card` + `border border-border shadow-xl` so it lifts off the ivory.
- Trust line under search: `text-primary-foreground/80` → `text-navy/70`.
- Category chips: change to ivory chip style — `bg-card border border-border text-navy hover:border-accent hover:text-burgundy`. "Browse all sellers" link `text-primary-foreground/80` → `text-navy/70 hover:text-burgundy`.
- "Established 1930" big line: stays gold (good); subtitle `text-primary-foreground/70` → `text-navy/60`.

### 4. Footer — ivory footer with navy text, dark bottom bar removed

`src/components/layout/Footer.tsx`
- Top block: `bg-primary text-primary-foreground` → `bg-cream text-navy border-t border-border`.
- Logo tile: drop the `bg-primary-foreground/95` wrap.
- Headings: `text-accent` (gold) — keep, looks good on ivory.
- Body links: `text-primary-foreground/70 hover:text-accent` → `text-navy/70 hover:text-burgundy`.
- Address/contact icons stay gold; text `text-primary-foreground/70` → `text-navy/75`.
- "Documents" / "Install App" pill buttons: `bg-accent/10 border-accent/20 text-accent hover:bg-accent/20` already work on ivory — keep.
- Bottom bar: `border-t border-primary-foreground/20` → `border-t border-border`; small print `text-primary-foreground/50` → `text-navy/50`.

### 5. Pitch / dark sections (optional but consistent)

`src/components/pitch/PitchSection.tsx`
- Keep `dark` variant as is (it's opt-in and used for dramatic pitch slides only). No change.

### 6. Tokens — small adjustments only

`src/index.css`
- Leave palette tokens alone.
- Add a very subtle border tone if needed (`--border` already 215 25% 88%, fine on ivory).
- No Tailwind config change needed.

### 7. Sweep for stragglers

After the four files above, grep for `bg-primary` and `bg-foreground` usage in layout/home/footer surfaces to catch any large dark blocks I missed. Section dividers like `TrustStrip` are already light — no change.

---

## Files touched

1. `src/components/layout/Header.tsx`
2. `src/components/layout/MarketTicker.tsx`
3. `src/components/home/HeroSection.tsx`
4. `src/components/layout/Footer.tsx`
5. (sweep only, edit if found) other layout components using `bg-primary` as a section fill

## Out of scope

- Buttons (`variant="default"` stays navy — your call to keep navy buttons).
- `--primary` / `--navy` / `--burgundy` / `--gold` token values.
- Page content/logic.
- Dark mode (`.dark` variables).

## Visual outcome

- Page: ivory background, navy text, gold heritage accents, burgundy CTAs.
- Hero: light cream block instead of navy slab.
- Header: white bar with navy nav + gold active chip.
- Ticker: soft ivory line at the very top, almost subliminal.
- Footer: ivory footer, dark only via the gold-bordered pill buttons.
