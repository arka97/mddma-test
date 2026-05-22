# SEO / GEO / AEO / AIO — two-tier public/gated architecture

This plan supersedes the previous "Hybrid C" plan on three points (prerendering, sitemap pruning, home-as-door) and keeps everything else (kill marketplace copy, noindex the app, fix doc 27, log a decision). Goal: AI engines (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) and traditional search can read, cite, and rank the **public authority layer** with full content + JSON-LD in the initial HTML — while the transactional core stays gated and leaks no member data.

## §0 — The prerender decision (must resolve first)

Lovable runs a stock Vite SPA build. There is **no built-in SSG/prerender step**. So the options for in-place prerendering are:

| Option | What | Fit for Lovable | Verdict |
|---|---|---|---|
| **A. Lightweight custom prebuild** | A `scripts/prerender.ts` that renders each public route via `renderToString` + `HelmetProvider` into `dist/<route>/index.html`, wired as a `postbuild` script. No Puppeteer. Pulls circular slugs from Supabase at build time. | Works in Lovable's build sandbox (pure Node, no browser). | **Recommended.** |
| **B. `react-snap` / `@prerenderer/rollup-plugin`** | Spin up Puppeteer/Chromium during build, crawl routes. | Likely fails — Lovable's build sandbox is unlikely to provide Chromium; will inflate build time. | Avoid unless A is impossible. |
| **C. `vite-react-ssg`** | Proper SSG via vite-react-ssg. Requires moving to its router conventions. | Possible, but means refactoring routing & data fetching — much bigger commit. | Defer. |
| **D. Edge worker / prerender service** | Cloudflare Worker that detects bot UAs and serves pre-rendered HTML; serves SPA to browsers. Or a separate static "marketing" site on the same domain via a reverse-proxy/path-split. | Architecture decision — needs committee sign-off; adds infra. | Fallback if A and C are both off the table. |

**Recommendation:** start with **Option A**. The public layer is 7 static routes + N circulars + N knowledge articles — all renderable without browser APIs because they don't depend on `window`, `localStorage`, auth context, or any client-only side effects (we'll guard the few that do). Supabase queries during build use the publishable anon key.

**I need you to confirm A before I start building**, because if Lovable's build sandbox rejects the postbuild step you'll need to escalate to D with the committee.

## §1 — Surfaces

```text
PUBLIC AUTHORITY LAYER  (prerendered, indexable, AI-welcome)
  /                  Home (authority, not a sign-in door)
  /about             The Association — 95-year history, governance
  /membership        What membership is + ₹10K + benefits
  /apply             Application flow (form OK in SPA shell — the page intro is prerendered)
  /install           PWA install instructions
  /faq               FAQPage JSON-LD (AEO engine)
  /knowledge         Index of articles
  /knowledge/<slug>  Articles (dates-grades, almond-origins, mandi-flow, APMC, glossary)
  /circulars         List
  /circulars/<slug>  Article JSON-LD per published circular
  /contact           Office address, grievance officer
  + (deferred until LEGAL-001) /privacy /terms /refund /grievance

GATED TRANSACTIONAL CORE  (noindex, auth-walled, no member data in HTML)
  /directory /products /products/<slug> /store/<slug>
  /brands /brands/<slug> /broker /market /community
  /dashboard /account/* /documents /documents/<slug>
  /login /forms
```

## §2 — `index.html` default head

Trust-body framing; per-route Helmet overrides per page.

```text
title:        MDDMA — Mumbai Dry-fruits & Dates Merchants Association (Est. 1930)
description:  The 95-year-old trade association governing the dry fruits, dates, and nuts
              trade in Mumbai. Member directory, RFQs, circulars, and a knowledge base
              for India's wholesale dry-fruit trade.
canonical:    REMOVE from index.html (Helmet owns it per-route — `head-meta` rule)
og:title/desc: same as above
og:type:      website
og:image:     keep /og-image.png
JSON-LD:      Organization sitewide (full schema with foundingDate, address, knowsAbout,
              email, sameAs, areaServed)
              DROP the WebSite + SearchAction schema (we do not offer public search)
keep:         google-site-verification, favicon, PWA manifest, theme-color, apple-touch
```

**Org schema fields I need from you** (don't have these locally — listed in §11).

## §3 — Per-route SEO components

`src/components/Seo.tsx` already exists with `noindex`. Reuse it on every public page with full title/description/canonical/og + page-specific JSON-LD. On every gated page, pass `noindex`.

New per-route schema usage:
- `/faq` → FAQPage with the 7 questions in your brief
- `/circulars/<slug>` → Article + BreadcrumbList
- `/knowledge/<slug>` → Article + BreadcrumbList
- `/about` → AboutPage (optional, low-risk)

## §4 — New public content (the actual GEO/AEO engine)

These are the pages that earn citations. Without them, the rest is a shell.

**Routes & components to create:**

```text
src/pages/Faq.tsx                   FAQPage schema + UI
src/pages/Knowledge.tsx             Index of articles
src/pages/KnowledgeArticle.tsx      <slug> renderer
src/content/knowledge/              Markdown source (reuse existing docs Markdown.tsx)
  dates-grades-and-origins.md
  almond-origins-mamra-sanora.md
  how-mumbai-dry-fruit-mandi-works.md
  apmc-and-import-flow.md
  glossary.md                        (mirror of doc 14 trade-terms section)
src/pages/CircularArticle.tsx       /circulars/<slug> detail page (new) with Article schema
```

Knowledge content seeds from doc 14 glossary + doc 01 vision text — these already exist in `src/content/docs/`; I'll lift and re-author into pure-trade-explainer prose (no product pitch).

`/circulars` already lists DB rows; add a `/circulars/:slug` detail route that fetches one row and emits Article JSON-LD. Slugs come from a new `slug` column on `circulars` (one migration; nullable, generated from title via a trigger or a generated column).

## §5 — Home re-skin (`HeroSection.tsx`) — authority, not a sign-in door

- Eyebrow: `Est. 1930 · Navi Mumbai`
- H1: `The Mumbai Dry-fruits & Dates Merchants Association`
- Sub: per brief
- Primary CTA: `Apply for membership` → `/apply`
- Secondary: `Member sign in` → `/login`
- Authenticated users: route detection redirects to `/dashboard` (don't break member UX)
- **Below the fold (new sections, replace today's marketplace strip on guest view):**
  - `About the Association` — 3-paragraph history block
  - `Trade knowledge` — 3 teasers linking into `/knowledge`
  - `Recent circulars` — 3 most-recent public circulars (already DB-backed)
- Search bar: behind auth; moved out of hero for guests; placeholder & CTA per brief when shown to members

## §6 — `robots.txt`

Replace current with:

```text
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

User-agent: Googlebot
Allow: /
User-agent: Bingbot
Allow: /
User-agent: Twitterbot
Allow: /
User-agent: facebookexternalhit
Allow: /

Sitemap: https://mddma.org/sitemap.xml
```

## §7 — `/llms.txt`

File already exists with the **old marketplace copy and includes gated routes**. Rewrite to:

- Trust-body framing in the header
- List **only** the public authority layer
- Remove `/directory`, `/products`, `/brands`, `/broker`, `/market`, `/community`, `/login`, `/documents`
- Add `/faq`, `/knowledge`, `/knowledge/<each article>`, `/circulars/<each published slug>`

## §8 — Sitemap

Rewrite `scripts/generate-sitemap.ts` (currently hand-written `public/sitemap.xml` only):

- Convert to script-based generation per the `sitemap-robots` rule, wired into `prebuild`/`predev`.
- Entries = public authority layer only. Fetch published circulars at build time for `/circulars/<slug>`. Static array for `/knowledge/<slug>`.
- Defer `/privacy`, `/terms`, `/refund`, `/grievance` until LEGAL-001 ships.

## §9 — Per-route `noindex` on the transactional core

Add `<Seo … noindex />` to every page in the gated list (§1). Files:

```text
Directory, Products, ProductPage, Storefront, Brands, BrandPage, Broker, Market,
Community, Dashboard, Login, Forms, DocumentsHub, DocViewer, account/*
```

`/login` is intentionally noindex — keeping a sign-in page off the SERP for the brand name.

## §10 — Prerender script (Option A) — what it does

```text
postbuild step:  bunx tsx scripts/prerender.ts

For each public route:
  1. render <App> at that path via renderToString (HelmetProvider, MemoryRouter for SSR)
  2. inject Helmet head into the dist/index.html template
  3. inline page HTML into <div id="root">
  4. write to dist/<route>/index.html  (so Lovable static hosting serves it)
For /circulars/<slug>:
  - query supabase (anon key) for is_published=true rows, render each
For /knowledge/<slug>:
  - read src/content/knowledge/*.md, render each
Guard rails:
  - all components must be SSR-safe (no window/localStorage at module top-level)
  - AuthContext/CartContext: provide null defaults during SSR
  - lazy-loaded routes: pre-resolve before render
Acceptance during build:
  - assert each emitted HTML contains its <h1> text and its JSON-LD <script> tag
```

If a component breaks SSR, the script logs and skips that route (so the build doesn't fail), and surfaces a summary. I'll fix offenders one-by-one rather than block the build.

## §11 — Decision/doc reconciliation

- `supabase/functions/get-internal-doc/content/11-decisions-log.md` — add **GTM-001 (Locked)** per your brief wording.
- `supabase/functions/get-internal-doc/content/27-pilot-plan-and-success-criteria.md` §3 W5–W8 — replace per your brief.
- `src/content/docs/00-start-here.md` — add a row in the status table referencing GTM-001 (Public authority layer = prerendered + AI-friendly; transactional core = gated/noindex).
- `mem://architecture/v3-1-locked-decisions` + `mem://index.md` Core — append GTM-001.
- Regenerate `supabase/functions/get-internal-doc/content.ts` bundle.

## §12 — Database

One migration:

```text
ALTER TABLE circulars ADD COLUMN slug text UNIQUE;
-- backfill from title (lowercase, kebab-case, dedupe with -2/-3 suffix)
-- add a BEFORE INSERT trigger to auto-generate slug from title if null
```

Used by `/circulars/<slug>` detail route + sitemap + prerender.

## §13 — Files touched

```text
ADD:
  scripts/prerender.ts
  src/pages/Faq.tsx
  src/pages/Knowledge.tsx
  src/pages/KnowledgeArticle.tsx
  src/pages/CircularArticle.tsx
  src/content/knowledge/*.md  (5 files)

REWRITE:
  index.html (head)
  public/robots.txt
  public/llms.txt
  public/sitemap.xml + scripts/generate-sitemap.ts
  src/components/home/HeroSection.tsx
  src/pages/Circulars.tsx (link rows to /circulars/<slug>)
  src/pages/About.tsx (expand to authority content)

EDIT (Seo noindex prop):
  src/pages/{Directory, Products, ProductPage, Storefront, Brands, BrandPage,
  Broker, Market, Community, Dashboard, Login, Forms, DocumentsHub,
  DocViewer}.tsx + src/pages/account/*.tsx

EDIT (add Seo):
  Apply.tsx, Install.tsx, MembershipPlans.tsx, About.tsx — public pages currently
  missing/weak Seo blocks

DOCS/MEMORY:
  supabase/functions/get-internal-doc/content/{11,27}.md + content.ts
  src/content/docs/00-start-here.md
  mem://architecture/v3-1-locked-decisions, mem://index.md

DB:
  migration: circulars.slug column + backfill + trigger

package.json:
  add "postbuild": "bunx tsx scripts/prerender.ts"
  add "prebuild" / "predev": "bunx tsx scripts/generate-sitemap.ts"
```

## §14 — Sequencing (so the work merges cleanly)

1. **Reconcile docs + memory** (cheap, unblocks the rest). GTM-001, doc 27 W5–W8, status-table row.
2. **`circulars.slug` migration** (one migration; everything downstream needs it).
3. **`index.html` head, robots.txt, llms.txt rewrites** (pure content, zero risk).
4. **Per-route `Seo noindex`** on the transactional core. Verifiable immediately in DOM.
5. **New public content & routes**: `/faq`, `/knowledge`, `/knowledge/<slug>`, `/circulars/<slug>`, About expansion, HeroSection re-skin.
6. **`sitemap` generator script** (now there's content for it to reference).
7. **Prerender script** (last — has the biggest blast radius; runs after everything else stabilises).

## §15 — Acceptance test (your DoD, restated)

1. `curl https://mddma.org/` and each `/about`, `/membership`, `/faq`, `/knowledge`, `/knowledge/<slug>`, `/circulars`, `/circulars/<slug>`, `/contact`, `/install`, `/apply` return full visible body content + JSON-LD in the initial HTML (no JS executed).
2. With JS disabled in the browser, every public route still renders meaningful content.
3. Every transactional route returns `<meta name="robots" content="noindex">` in its initial HTML.
4. Google Rich Results Test passes for Organization (sitewide) and FAQPage (`/faq`).
5. `sitemap.xml` contains only the public layer; `robots.txt` explicitly allows GPT/Claude/Perplexity/Google-Extended; `/llms.txt` is present and lists only public routes.
6. No price, stock band, or member contact appears in any indexable/prerendered HTML.

---

## I need from you before I start

1. **Prerender mechanism**: confirm Option A (lightweight custom postbuild via `renderToString`). If you want B/C/D instead, say which and I'll re-scope §10. *(I'll start by writing a small spike to confirm Lovable's build sandbox tolerates the postbuild step, before committing to writing the rest.)*
2. **Organization JSON-LD fields** I don't have:
   - Full registered street address at APMC Vashi (Sector 19, but the unit number / pincode)
   - Public phone number for `Organization.telephone` (or should we use only `email: grievance@mddma.org`?)
   - `sameAs` URLs — does MDDMA have a LinkedIn page, a YouTube channel, an X/Facebook handle, an older website (`mddma.com`)? If `mddma.com` is the legacy site, do we list it under `sameAs` or do we suppress it?
   - Founder names? (Not required, but adds credibility to the Org block.)
3. **Knowledge base scope**: confirm the 5 articles I listed are the right starter set (dates-grades, almond-origins, mandi-flow, APMC-and-import-flow, glossary). If you want fewer/more or different angles (e.g. "GST and HSN codes for dry fruits"), say so now — content authoring is the biggest single-line item.
4. **/circulars/<slug>**: are existing published circulars safe to render as public Article pages, or do some carry member-only content? If mixed, do we add an `is_public` flag on `circulars` (additional migration) and only emit the public ones?
