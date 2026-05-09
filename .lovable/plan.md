## Roll out the new MDDMA brand assets across the app

You uploaded a complete logo system. I'll map each variant to the surface where it reads best, copy them into the project, and replace every existing "M" placeholder.

### Asset inventory & role

| Variant | File | Where it goes |
|---|---|---|
| Logomark only (crest, 1:1) | `MDDMA_logomark.svg` | Header (compact, dark nav), favicon, PWA icon, in-page avatars |
| Wordmark + tagline (typemark, 1:1) | `MDDMA_typemark_square.svg` | Tight spaces where image+text wordmark fits a square (e.g. login/apply card header) |
| Full lockup, horizontal (crest + MDDMA + tagline) | `MDDMA_Royal_Heritage_Logo.svg` (1536×1024) | Hero/about/pitch headers, OG share image, email/PDF mastheads |
| Full lockup, square stacked | `MDDMA_Royal_Heritage_1to1.svg` / `MDDMA_square_logo.svg` | Footer "About" block, Apply page sidebar, splash/install |

### 1. Add assets to the project
- Copy all 5 SVGs into `src/assets/brand/` (for React imports via `@/assets/brand/...`).
- Also copy the logomark and the square full-lockup into `public/brand/` for `index.html` favicon / OG / manifest references.
- Filenames kept as-is for traceability.

### 2. Refactor `src/components/brand/Logo.tsx` into a single source of truth
Add a `variant` prop so the rest of the app picks the right artwork without each site touching SVG files directly.

```tsx
type LogoVariant =
  | "mark"        // crest only — header, favicon, avatars
  | "stacked"     // full lockup, square — footer, apply sidebar
  | "horizontal"  // full lockup, wide — hero, OG
  | "typemark";   // wordmark + tagline only — auth cards
```
- Remove the placeholder "M" circle and the manual "MDDMA / Est. 1930" text.
- Render an `<img>` of the chosen SVG with sensible heights (`h-8` mark, `h-12` stacked/typemark, `h-10` horizontal) and `alt="MDDMA — Mumbai Dryfruits and Dates Merchants Association"`.
- Keep the existing `inverted` prop but make it a no-op for now (logos already work on both navy and cream — verified visually). Drop `showWordmark` since `variant` supersedes it.

### 3. Replace placeholder marks across the UI

| File | Change |
|---|---|
| `src/components/layout/Header.tsx` | Already uses `<Logo inverted />` — switch to `<Logo variant="mark" />` (crest only; the wordmark is redundant with the navy nav bar and saves horizontal space at 1051px breakpoint). |
| `src/components/layout/Footer.tsx` | Replace the inline "M" circle + manual MDDMA / Digital Trade Hub text block with `<Logo variant="stacked" className="h-20 w-auto" />`. |
| `src/pages/Login.tsx` | Above the auth card, render `<Logo variant="typemark" />` centered. |
| `src/pages/Apply.tsx` | Header section: replace any text-only title decoration with `<Logo variant="horizontal" />`. |
| `src/components/home/HeroSection.tsx` | Optional: small `<Logo variant="horizontal" />` watermark above the hero headline to reinforce the brand on landing. (Will check current layout before adding — if it crowds the hero we'll skip.) |
| `src/components/pitch/PitchSection.tsx` | Use `<Logo variant="horizontal" />` as the section lead-in. |
| `src/pages/Install.tsx` | Use `<Logo variant="stacked" />` as the install splash mark. |

### 4. Favicon, PWA, OG (`index.html` + `public/manifest.json`)
- `<link rel="icon" type="image/svg+xml" href="/brand/MDDMA_logomark.svg">` (modern browsers).
- Keep existing `/icon-192.png` / `/icon-512.png` / `/apple-touch-icon.png` PNG fallbacks untouched — those are required by iOS / Android PWA install and aren't bundleable from SVG without raster generation. **Out of scope unless you ask** — say the word and I'll generate matching navy-on-cream PNGs from the new logomark.
- `<meta property="og:image">` → switch to `/brand/MDDMA_Royal_Heritage_Logo.svg` (most LinkedIn/WhatsApp previews accept SVG; if any platform rejects it we keep the PNG). Twitter card stays on the PNG fallback.
- `manifest.json` icons unchanged (PNG required by spec).

### 5. Files touched
- New: `src/assets/brand/*.svg` (5), `public/brand/MDDMA_logomark.svg`, `public/brand/MDDMA_Royal_Heritage_Logo.svg`
- Edited: `src/components/brand/Logo.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/pages/Login.tsx`, `src/pages/Apply.tsx`, `src/pages/Install.tsx`, `src/components/pitch/PitchSection.tsx`, `index.html`
- Possibly: `src/components/home/HeroSection.tsx` (only if it doesn't crowd the hero)

### 6. Out of scope (ask if you want them)
- Regenerating the PWA raster icons (`icon-192/512`, `apple-touch-icon`) and a 1200×630 OG card from the new artwork.
- Updating member/company avatars (those are user-generated, not brand).
- Adding a brand-mark watermark inside RFQ PDFs / email templates.