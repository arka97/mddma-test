## GBAUG Rebrand — Scope

Per your earlier guidance ("just logos"), this rebrand swaps the **app-shell brand identity** (header wordmark, favicon, PWA icons, social preview) from MDDMA to **GBAUG**. All in-page content keeps mentioning MDDMA as the parent association.

## What changes

### 1. Logo assets (public/brand + public/)
Replace the MDDMA logo files used app-wide with the GBAUG logo previously shared:
- `public/favicon.ico` → GBAUG icon
- `public/icon-192.png`, `public/icon-512.png`, `public/icon-512-maskable.png`, `public/apple-touch-icon.png` → GBAUG
- `public/og-image.png` → GBAUG-branded social card
- `public/brand/MDDMA_logomark.svg` and `MDDMA_Royal_Heritage_Logo.svg` → add new `public/brand/gbaug-logo.svg` (keep MDDMA files unreferenced or remove)

### 2. Header (`src/components/layout/Header.tsx`)
- Swap logo image source to GBAUG mark
- Replace stacked label "MDDMA / Mumbai Dryfruits & Dates Merchants Association" with stacked label "**GBAUG** / by MDDMA"
- Update `aria-label` to "GBAUG — by MDDMA"

### 3. Brand component (`src/components/brand/Logo.tsx`)
- Point to new GBAUG SVG; keep size/variants

### 4. PWA & SEO shell
- `public/manifest.json`: `name`, `short_name` → "GBAUG"; description → "GBAUG — by MDDMA"
- `index.html`: `<title>`, `og:title`, `og:site_name`, Organization JSON-LD `name` → "GBAUG" (legalName → "Mumbai Dryfruits & Dates Merchants Association")
- `src/components/Seo.tsx`: default site name → "GBAUG"
- `public/llms.txt`: first-line brand → GBAUG (by MDDMA)

### 5. Install prompt
- `src/components/pwa/InstallAppButton.tsx` + `src/pages/Install.tsx`: install copy uses "GBAUG"

## What does NOT change

- All in-page content, doc body text, About page, Footer association line, emails, edge functions, DB schema, route paths, or any other "MDDMA" mention inside the app remains untouched.
- No color, font, or layout changes.
- No edits to `/documents` markdown.

## Asset I'll use

The GBAUG logo image you previously uploaded in this project. I will convert it to the favicon + PWA sizes (192, 512, 512 maskable, 180 apple-touch, .ico) at build time using a one-off script, then upload the binaries via `lovable-assets` / commit to `public/`.

## Open confirmation

Could you confirm the exact filename of the GBAUG logo in your uploads so I pick the right one? If you'd rather I auto-detect the most recent logo-looking upload, say "auto-pick" and I'll proceed.
