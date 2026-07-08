# Full-site review — critique first, then a build plan

Depth: 5/5. Scope: UX & visual · content & copy · feature gaps. Backend/RLS untouched unless a copy-only doc change is needed.

---

## Part 1 — Critique (findings by severity)

### 🔴 Critical (breaks trust or IA on first visit)

1. **Split brand identity.** Header shows "**G.BAU.G**" with sub-line "by Mumbai Dryfruits & Dates Merchants Association" (trailing NBSP, missing hyphen), while Footer/Copyright/`index.html`/`/about`/`Seo` all use "**MDDMA**" and "**Mumbai Dry-fruits & Dates**". Three different spellings ("Dryfruits", "Dry-fruits", "Dry Fruits") plus two brand acronyms. A first-time visitor cannot tell what this site is called.
2. **Stale footer nav.** `Footer.tsx` links list "Lead CRM" (removed BIZ-001), "Market Intelligence" (now the Community Feed), and no link to `/rfq`, `/circulars` in the Platform column ordering. Contradicts locked v3.2 IA.
3. **Route duplication / dead pages.**
  - `/directory` and `/directorylist` both exist and both surface members.
  - `/community` still exists as a full page but v3.2 rule says the feed lives at `/market` (and Community appears in the desktop header nav, sending users to a legacy view).
  - `/forms` and `/contact` render the same "Advertise / Circular" tabbed page — `/contact` sets a false expectation.
  - `HeroSection`, `FeaturedCategoriesSection`, `WhyMddmaSection`, `SponsorsSection`, `MarketplacePulse`, `IndustryFeed`, `FooterCTA` (~800 LOC in `src/components/home/`) are no longer rendered anywhere.
4. **Membership page renders 2 tiers inside `md:grid-cols-3**` — a permanent empty column — and prints internal metadata to users: `Badge: Paid Member` and `Sponsored Eligible: Yes`. Also uses 3 tier icons for 2 tiers.
5. **Missing GTM-001 public routes.** Core memory names `/faq` and `/knowledge` (+ `/knowledge/<slug>`) as pillars of the public authority layer; neither is defined in `routes.tsx`. `index.html` FAQ JSON-LD promises answers that no page carries.
6. **Home has no welcome / hero for guests.** `Index.tsx` opens with an ad slot → a small `<h1 class="text-lg">Today on the market</h1>` → tiles. No positioning, no proof, no CTA above the fold. Fails the "authority layer" job the docs describe.

### 🟠 High (weakens polish and comprehension)

7. **Desktop header nav vs. mobile bottom tabs disagree.**
  - Desktop: Directory · Products · Brands · Market · Community · Membership.
  - Mobile: Home · Market · RFQ · Members · Account.
  - RFQ and Account are absent from desktop; Community/Brands/Membership are absent from mobile. Users learning one flow are lost on the other device.
8. `**TodayHeader` subtitle lies:** "Live rates, circulars and verified merchants" — but the Index page no longer includes a Live Rates ticker (removed).
9. `**QuickActionsGrid` mixes navigation with marketing** — "About Us" and "Directory List" (a redundant page) sit next to real actions like "Market" and "Bulletin".
10. **Hard-coded colors bypass tokens in 14 files** (verified via ripgrep) — `bg-emerald-600`, `border-emerald-200`, `bg-emerald-50`, `text-white`, `bg-black` used in `Directory.tsx`, `MemberCard.tsx`, `Storefront.tsx`, `MembershipStatusCard.tsx`, `SellerSignals.tsx`, `WhatsappFab.tsx`, `LinkPreviewCard.tsx`, `ProductsPage.tsx`, `ProductMediaCarousel.tsx`. Breaks the cream+navy+gold system and future dark mode.
11. **Directory / Broker overlap.** Directory has a `Broker` type filter and a whole `/broker` page exists as a filtered view — duplicated navigation.
12. **Empty-state copy is uniformly weak.** "No members found matching your criteria." "No posts yet — be the first to share." No reset-filter action, no upgrade CTA, no illustration.
13. **Footer contact block is placeholder-tier.** Address "Sector 19, APMC Market, Vashi" and phone "+91 22 2784 1234" contradict the canonical address/phone in `index.html` JSON-LD and hide the named Grievance Officer (Aditya Parmar) that legal docs require.
14. **Dashboard hero uses `bg-primary**` (which is gold in this theme) — a giant gold band under the logged-in shell competes visually with the gold logo and gold accents.
15. **Header search placeholder** says "Mamra, Medjool, traders…" but always routes to `/products?q=…`, so "traders" returns product listings, not people.

### 🟡 Medium (opportunities to sharpen)

16. **No microcopy for controlled transparency.** Free/guest visitors see "Contact seller" but never a preview of what's unlocked with Paid — hurts conversion.
17. **No onboarding for new paid members** — no "add your first product / brand / logo" checklist on `/dashboard`.
18. **No FAQ page even though `index.html` publishes FAQ JSON-LD** — search engines will surface answers that don't exist on-site.
19. **Ads (`AdSlot`) appear in high-friction slots** — between `PageHeader` and filters on `/directory` and `/products`. Consider inline-between-cards rhythm instead.
20. **Skimpy meta on child pages.** Most pages set `<Seo title="… — MDDMA" noindex>` — fine for gated pages, but the public `/about`, `/circulars`, `/apply`, `/membership` need distinct meta titles/descriptions optimized against the SemRush keyword universe (dry fruits importer, mamra almond wholesaler, medjool dates supplier).
21. **No language toggle.** Target users trade in Hindi / Gujarati; keeping English-only is fine but a subtle "हिन्दी" toggle would signal welcome even if it only translates the home/apply pages.
22. **PWA install prompt only in header (icon-only) and footer.** No install nudge on `/dashboard` where the value proposition is highest.
23. **No breadcrumbs on deep routes** (`/products/:slug`, `/directory/:slug`, `/store/:slug`, `/documents/:slug`) — mobile users can't step back through IA.
24. **Community feed anonymity** is powerful (v3.2) but there's no UI explainer next to the toggle for the poster — "How does anonymous work?".

### 🟢 Low / polish

25. Header row 1 collapses on scroll on mobile — good — but the search row jumps up abruptly. Add a `transition-transform` for smoothness.
26. Category tiles' "hot / featured" pill uses a red-orange accent on gold + cream — visually fine but the pill's `text-[8px]` is illegible.
27. Mobile tab labels at `text-[10px]` fail WCAG 1.4.4 for small screens; icons alone would be cleaner or `text-xs`.
28. `Layout.tsx` bottom-tab spacer is not audited — check for content clipped under fixed bar on iOS Safari.

---

## Part 2 — Prioritized build plan (5 phases, approve to execute)

Each phase is a self-contained batch. You can approve them one at a time; I'll pause between phases if you want.

### Phase 1 — Brand & IA truth (fixes #1, #2, #3, #6, #11, #14, #15)

1. **Brand lockup.** Decide brand-name in a short chat: keep "MDDMA" everywhere OR keep "GBAUG (by MDDMA)". I'll then propagate one name consistently across `Header`, `Footer`, `index.html`, `Seo` defaults, `manifest.json`, `apple-mobile-web-app-title`, JSON-LD, and copy — plus fix the "Dryfruits / Dry-fruits / Dry Fruits" spelling to a single canonical form.
2. **Retire duplicate/dead routes.**
  - Redirect `/directorylist` → `/directory` (with an A–Z toggle inside Directory).
  - Redirect `/community` → `/market`; remove from header desktop nav.
  - Redirect `/contact` → new `/contact` page (see phase 3) and remove the `/forms == /contact` alias.
  - Delete unused home components (`HeroSection`, `FeaturedCategoriesSection`, `WhyMddmaSection`, `SponsorsSection`, `MarketplacePulse`, `IndustryFeed`, `FooterCTA`).
3. **Reconcile desktop nav ↔ mobile tabs.** Desktop primary: Home · Directory · Products · Market · RFQ · Membership. Everything else moves under a "More" dropdown (Brands, Circulars, About, Documents). Mobile keeps current 5 tabs; add long-press or "more" sheet mirror.
4. **Broker page** becomes a curated landing (see phase 4) rather than a duplicated directory filter; header link removed.
5. **Repaint `/dashboard` hero** — swap `bg-primary` band for `bg-card` with a thin gold underline; primary reserved for CTAs.
6. **Search UX** — placeholder becomes "Search Mamra, Medjool, dates…"; add a "People" tab in results that routes to `/directory?q=`.

### Phase 2 — Home page rework (fixes #6, #8, #9)

1. **New hero band** (guest-visible, member-aware): 1-line H1 ("India's verified trade network for dates, mamra & dry fruits — since 1930"), 1-line sub (proof: N verified members · N circulars this quarter), two CTAs ("Browse members", "Apply for membership"). Warm cream surface, gold underline, muted navy ink — no gradient soup.
2. **Above-the-fold rhythm** for both guests and members:
  - Hero
  - Live Ticker (bring back the ticker component — subtitle claims it)
  - Categories
  - Recent listings
  - New members
  - Circular alert (only if unread)
  - Membership CTA (only for non-paid)
3. `**QuickActionsGrid` shrinks to 4 tiles** — Market · Bulletin · RFQ · Members. About/Directory List/Brands move into "More" from header.
4. **Rewrite `TodayHeader` subtitle** to match reality.
5. **Guest-only strip** below hero — 3 authority pills (95 years · APMC Vashi · KYC-verified) with a "Why MDDMA?" mini link.

### Phase 3 — Public authority pages & meta (fixes #5, #13, #18, #20)

1. **New `/faq` page** — renders the same Q&A as `index.html` JSON-LD; also produces the JSON-LD from the page data so they can never drift again.
2. **New `/knowledge` hub + `/knowledge/<slug>` viewer** — reuses the existing markdown renderer (`Markdown.tsx`) with a small `src/content/knowledge/` seed (import policy 101, GST for traders, Mamra grades, Medjool storage). Sitemap-listed.
3. **New standalone `/contact` page** — real address (canonical from `index.html`), phone, `grievance@mddma.org`, named Grievance & Data Protection Officer (Aditya Parmar), office hours, embedded Google map, and a lightweight message form (not the ad/circular Forms).
4. **Footer overhaul** — Platform column matches v3.2 nav; add "Legal" column (Privacy, Terms, Refund, Grievance) linking to the promoted policy pages; canonical address/phone; small Grievance Officer line.
5. **Per-page SEO meta** — write distinct titles + 150-char descriptions for `/`, `/about`, `/membership`, `/apply`, `/circulars`, `/faq`, `/knowledge`, `/contact` grounded in a quick SemRush pass on target keywords (mamra almond, medjool dates wholesaler, dry fruits importer India).

### Phase 4 — Component & feature polish (fixes #4, #7, #10, #12, #16, #17, #19, #22, #23, #24)

1. `**/membership` fix** — 2-column grid on md, single row on lg; remove internal metadata lines; icon per tier (2 icons, not 3); add "What you unlock" side-by-side comparison table below cards; add a Contact-us row for enterprise/broker questions.
2. **Design-token sweep** — replace 34 hard-coded color occurrences across 14 files with semantic tokens. Introduce `--success-soft` and `--success-strong` for the verified-badge pattern currently using `bg-emerald-*`.
3. **Empty states upgrade** — one shared `EmptyState` layout: illustration slot + heading + body + primary action + "Reset filters" secondary; wire into Directory, Products, Market, RFQ, Community feed migration.
4. **Reveal-preview microcopy** — on Directory/Storefront/Product cards for guest/free users, subtle "Paid members see WhatsApp & phone" chip near the CTA (already gated, this is *only* copy).
5. **Onboarding checklist card** on `/dashboard` for authenticated members without a completed profile: "Add company logo · List first product · Verify GST · Publish first brand" with progress %.
6. **Breadcrumbs** on `/products/:slug`, `/directory/:slug`, `/store/:slug`, `/documents/:slug`, `/knowledge/:slug`, `/circulars` article view.
7. **Ad slot rhythm** — move `AdSlot` on Directory/Products from above-filters to a between-cards position at index 4 and 12.
8. **Install-app nudge** on `/dashboard` (one-line banner, dismissible, respects `useInstallPrompt`).
9. **Anonymity explainer** — 1-line "Only admins can trace anonymous posts (log kept for compliance)." next to the toggle in `ComposeSheet`.
10. **New "Broker board"** — reframe `/broker` from filtered directory to a curated matchmaking page: 3 sections (Brokers accepting mandates · Open buy interests · Open sell interests). Reuses `rfq_listings` for the last two.

### Phase 5 — Accessibility, polish, docs sync (fixes #25–#28)

1. Mobile bottom-tab labels → `text-xs`, min 44×44 hit area verified.
2. Header collapse — add `transition-transform` + reduce jump.
3. Category "hot / featured" pill → readable `text-[10px]` with better contrast.
4. Layout — verify `pb-24` spacer on all mobile pages so content clears the fixed tab bar on iOS.
5. Update `mem://index.md` core rules to reflect single brand name, `/faq` and `/knowledge` now live, `/directorylist` retired, and Broker board reframed. Regenerate internal-docs bundle.

---

## Files touched (indicative, per phase)

```text
Phase 1: src/components/layout/{Header,Footer,MobileBottomTabBar}.tsx
         src/routes.tsx, src/pages/Dashboard.tsx, index.html
         delete: 7 unused src/components/home/*.tsx
Phase 2: src/pages/Index.tsx + new src/components/home/hero/*
         src/components/home/today/{TodayHeader,QuickActionsGrid}.tsx
Phase 3: new src/pages/{Faq,Knowledge,KnowledgeArticle,Contact}.tsx
         new src/content/knowledge/*.md
         src/components/layout/Footer.tsx, src/components/Seo.tsx, index.html
Phase 4: src/pages/MembershipPlans.tsx
         14 files under src/{pages,components}/** for token sweep
         src/components/ui/empty-state.tsx (extend)
         src/pages/{Directory,Products,Storefront,Rfq,Community}.tsx
         src/components/rfq/CreateRfqSheet.tsx, market/ComposeSheet.tsx
         src/pages/Broker.tsx (rewrite)
Phase 5: src/components/layout/{Header,MobileBottomTabBar,Layout}.tsx
         mem://index.md, scripts/build-internal-docs-bundle.ts (rerun)
```

## Decisions I need before executing

1. **Brand name** — "MDDMA" everywhere, or "GBAUG (by MDDMA)" everywhere? "G-BAU-G"
2. **Deprecate `/community**` entirely (redirect to `/market`), or keep as read-only archive? deprecate
3. **Broker board scope** — reframe as matchmaking (recommended) or just remove `/broker` and keep the Directory filter? remove /broker
4. **Seed content for** `/knowledge` — do you have 3–5 canonical articles ready, or should I draft placeholders you can replace? draft placeholders

Once you approve this plan (and answer the 4 decisions above), I'll execute Phase 1 immediately and pause for review before Phase 2.