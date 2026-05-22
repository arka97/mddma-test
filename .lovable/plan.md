## Goal
Make the public authority layer readable in raw HTML for search engines and AI answer engines, while keeping the transactional core client-rendered and noindexed.

## What I confirmed
- **Claude’s current statement is partly outdated.** Live raw HTML at `https://mddma.org/` already includes **Organization JSON-LD**.
- **The core problem is still real.** `/`, `/about`, and `/circulars` all currently return the same SPA shell in source:
  - same sitewide title/description
  - same sitewide Organization JSON-LD
  - empty `<body><div id="root"></div>`
- So crawlers that don’t execute JS still **do not get route content, H1s, page text, or route-specific metadata**.
- The codebase has **no prerender/SSG mechanism** today. It uses `BrowserRouter` inside a standard Vite SPA.

## Recommended implementation
1. **Add prerendering in-place to the current Vite app**
   - Keep the existing app and routes.
   - Add a prerender step that emits static HTML snapshots for the public layer.
   - Do not split into a separate marketing site unless the in-place route handling proves incompatible.

2. **Prerender only the public authority layer**
   - Include: `/`, `/about`, `/membership`, `/apply`, `/install`, `/circulars`, `/contact`
   - Include dynamic public circular detail pages if the route exists and is indexable.
   - Exclude transactional/core routes from prerender and keep them `noindex`.

3. **Move public-layer SEO from generic shell to route-accurate source HTML**
   - Ensure each public route ships with its own raw HTML:
     - route-specific `<title>`
     - route-specific meta description
     - canonical
     - per-route JSON-LD where applicable
     - actual rendered body content, including one clear H1
   - Keep sitewide Organization JSON-LD, and add route schemas where useful.

4. **Correct off-thesis public copy**
   - Replace remaining marketplace-led public copy on the homepage/public layer with association/trust-led copy.
   - Keep the transactional routes marketplace-capable but non-indexable.

5. **Bring sitemap into full alignment with real public pages**
   - Ensure only public, indexable, actually routed pages are listed.
   - Add public dynamic pages only when corresponding routes are real and indexable.

6. **Validate with raw-source checks**
   - Verify `curl`/non-JS fetches for `/`, `/about`, and `/circulars` return:
     - rendered body content
     - route-specific metadata
     - correct JSON-LD
   - This is the right verification loop for AI crawlers.

## Technical details
- Current stack: **Vite + React 18 + BrowserRouter + react-helmet-async**.
- Current issue: Helmet updates happen client-side, so non-JS crawlers mostly see `index.html` only.
- Best-fit fix in this codebase: add a **static prerender pipeline** for selected routes rather than rewriting the app architecture.
- Likely work items:
  - add prerender dependency/config
  - generate public-route HTML during build
  - make public routes safe to render in a prerender context
  - keep BrowserRouter for runtime navigation
  - keep `robots.txt` and `sitemap.xml` aligned with GTM-001

## Important constraint I found
- The current router includes public list pages (`/`, `/about`, `/membership`, `/apply`, `/install`, `/circulars`, `/contact`) but **there is no public circular detail route shown in `src/routes.tsx`** even though the sitemap generator can emit `/circulars/:slug` URLs.
- I’ll fix that mismatch during implementation by either:
  - adding the missing routed detail page if content exists, or
  - removing detail URLs from the sitemap until the route exists.

## Answer to your confirm-back question
- **Yes, the current Lovable/Vite app can be prerendered in place.** Based on what’s in the repo, I do **not** need a separate static marketing build as the first approach.
- I have enough public contact data already in source for Organization schema:
  - registered/address block: present
  - phone: present
  - email: present
- **What’s still missing if you want full enrichment:** official `sameAs` social URLs. I don’t see those in the code provided.

## Deliverable after approval
I’ll implement the prerender path, align the public metadata/content to the approved thesis, fix the sitemap/route mismatch, and verify the live raw HTML the way Claude is checking it.