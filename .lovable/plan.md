## Goal
Fix the remaining GEO/AEO gaps so non-JS crawlers receive real body content and structured data on the public authority layer (`/`, `/about`, `/membership`, `/apply`, `/install`, `/circulars`, `/contact`).

## Plan
1. Make prerender part of the guaranteed production build path
   - Move the prerender step out of a fragile lifecycle hook and into the main production build flow so published builds always emit static route HTML.
   - Keep the transactional core as SPA-only and non-indexable.

2. Ensure each public route ships a full static document
   - Generate `dist/<route>/index.html` for every public route with:
     - route-specific title and description
     - canonical and social metadata
     - visible HTML body content with a real H1 and supporting copy
     - route-specific JSON-LD in the raw HTML
   - Preserve the Vite asset tags so React hydrates after load.

3. Fix root and route consistency
   - Make the homepage HTML match the trust-led public positioning already defined in source.
   - Ensure `/about`, `/membership`, `/apply`, `/install`, `/circulars`, and `/contact` return prerendered HTML instead of the SPA loader shell.
   - Confirm `/contact` stays indexable while `/forms` remains non-indexed.

4. Tighten structured data coverage
   - Verify the homepage exposes `Organization`, `WebSite`, and `FAQPage` in raw HTML.
   - Verify public detail pages expose the correct per-route schema (`AboutPage`, `CollectionPage`, `ContactPage`, `SoftwareApplication`, etc.).
   - Remove any duplicate or conflicting head tags if needed.

5. Validate with non-JS fetch checks
   - Check raw HTML on the published domain for `/` and several public routes.
   - Confirm body text, H1s, and JSON-LD are present in initial HTML.
   - If the code is correct but the site still serves old markup, publish the frontend update and re-check the live domain.

## Technical details
- Likely root cause: the repo contains prerender logic, but the live site is still serving the SPA shell on public routes, which suggests the prerender output is not reliably making it into the deployed frontend build.
- Most likely fix: make prerender execution deterministic in the primary build command rather than depending on a separate lifecycle path.
- Files likely involved:
  - `package.json`
  - `scripts/prerender-public.ts`
  - `index.html`
  - possibly route SEO files only if metadata/body content need cleanup

## Done when
- Raw HTML for `https://mddma.org/` contains meaningful homepage body content.
- Raw HTML for public routes contains route-specific body copy and H1s.
- Structured data is present in raw HTML, not only after JS.
- Public routes no longer fall back to the loading spinner for non-JS fetches.