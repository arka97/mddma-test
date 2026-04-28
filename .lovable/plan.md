## Documentation Suite — Refactor, Synthesis & Content Rewrite

### Context shift from prior plan

You are recreating MDDMA from scratch. That changes the role of the Change Log: it is **no longer the source of truth**. Its content (locked decisions, gap register, behavioral layer notes, implementation status) must be **dissolved into the canonical docs** so the new project starts with one clean, authoritative spec — not a "read this overrides that" relationship.

This plan therefore goes beyond structural merging: it includes **content rewrites and a full redistribution of the Change Log** into the new doc set.

### 1. Critique of today's `/documents` suite

- **10 routes, ~4,300 lines of hand-coded JSX** — Pitch, SOW, BRD, PRD, FSD, SDD, TSD, MVP Canvas, ChangeLog, Documents hub.
- **Massive overlap.** Pitch/BRD/PRD repeat problem statement, personas, RBAC, monetisation. SDD/TSD repeat stack and architecture.
- **ChangeLog is parasitic.** It declares everything else "superseded" but lives alongside the originals → permanent drift, no single read order.
- **Content trapped in JSX.** Non-devs can't edit, diff, or export. Only escape hatch is browser print.
- **Zero diagrams.** Architecture, RFQ flow, RBAC, data model are prose + bullets only.
- **Flat hub.** 8 sibling tiles, no reading order, no progress, no download.
- **No portability.** When you rebuild from scratch, you'll want `.md` files you can drop into a new repo or feed to an AI agent — today you'd have to copy from rendered HTML.

### 2. Target shape — 6 markdown docs, no ChangeLog

```text
BEFORE                          AFTER
/documents (8 tiles)            /documents (numbered hub, 6 docs)
/changelog            ────┐
/pitch ───────┐           │     01 · Vision & Pitch          (pitch + MVP canvas + ChangeLog "why")
/mvp-canvas ──┘           │
/brd ─────────┐           │     02 · Business & Scope        (BRD + SOW + ChangeLog BIZ-* decisions)
/sow ─────────┘           │
/prd ─────────────────────┤     03 · Product & UX            (PRD + ChangeLog UX-* + GOV-* decisions)
/fsd ─────────────────────┤     04 · Functional Spec         (FSD + ChangeLog feature-level decisions)
/sdd ─────────┐           │     05 · Architecture & Tech     (SDD + TSD + ChangeLog TECH-* decisions
/tsd ─────────┘           │                                   + Behavioral Intelligence Layer)
                          └──►  06 · Build & Operations      (Implementation status, gap register,
                                                              roadmap, environments, ops runbook —
                                                              the *living* parts of ChangeLog,
                                                              repurposed as a build playbook, not
                                                              a "supersedes" log)
```

ChangeLog as a route **is deleted**. Its content is dispersed by topic:

| ChangeLog content                          | Lands in                                  |
|--------------------------------------------|-------------------------------------------|
| BIZ-001 Lead Packs killed, monetisation    | 02 Business & Scope (as final decision)   |
| BIZ tier collapse (Free / ₹10K Paid)       | 02 Business & Scope                       |
| UX-002 RFQ requires auth                   | 03 Product & UX (as requirement)          |
| GOV-001 Buyer reputation > seller          | 03 Product & UX                           |
| TECH-001 BIL is external API               | 05 Architecture & Tech                    |
| TECH-003 No WhatsApp Business API          | 05 Architecture & Tech                    |
| Controlled Transparency rules              | 03 Product & UX + 05 Architecture         |
| Implementation status checklist            | 06 Build & Operations                     |
| Gap register / open items                  | 06 Build & Operations (as roadmap)        |

Every "✅ locked" item becomes plain prose ("The platform does X") in the relevant doc. No more meta-language about decisions superseding decisions — the new project starts with statements of fact.

### 3. Content rewrite — the 6 docs from scratch

Each doc is **rewritten end-to-end** in markdown, using the existing JSX only as a fact source. Goals:

- **One voice.** Tight, declarative, no marketing bloat. Present tense for what exists, future tense for roadmap.
- **No internal contradictions.** Every fact is stated in exactly one doc; others link to it.
- **Mermaid-first explanations.** Where today's prose describes a flow or hierarchy, the new doc leads with a diagram and follows with 2–3 sentences.
- **Sized for skim.** Target ~600–1200 words per doc, plus diagrams and tables. Down from ~4,300 lines of JSX to ~6 short, dense markdown files.

Per-doc outline:

**01 · Vision & Pitch** — One-line thesis · Problem (3 bullets) · Solution: Behavioral Trade OS · Lean canvas table · ROI math for committee · Diagram: Controlled Transparency value flow.

**02 · Business & Scope** — Strategic goals · Monetisation (Free vs ₹10K Paid; ₹5K broker flag) · Out-of-scope explicitly (Lead Packs, multi-tier, WhatsApp API) · SOW: deliverables, milestones, payment schedule · Diagram: engagement gantt.

**03 · Product & UX** — Personas (Buyer / Seller / Broker / Admin) · Core journeys · RBAC matrix (table + diagram) · Controlled Transparency rules (price ranges, stock bands, demand trends) · Buyer-reputation-over-seller principle · Diagram: RFQ lifecycle state machine · Diagram: role permissions flowchart.

**04 · Functional Spec** — Module list with one-paragraph spec each: Directory, Storefront, Products, RFQ Cart, Community Forum, Circulars, Ads, Account Center, Admin CMS, Verification · Acceptance criteria as bullet lists · Diagram: multi-item RFQ cart flow · Diagram: verification state machine.

**05 · Architecture & Tech** — Stack (React 18 + Vite + Tailwind + Lovable Cloud) · Repository / hooks / pages layering · Data model (companies, products, variants, rfqs, inquiry_products, posts, comments, circulars, ads, user_roles) · Auth + RLS pattern · Behavioral Intelligence Layer as external API contract · Storage buckets · Edge functions inventory · Diagram: system architecture · Diagram: ER model · Diagram: auth + RLS sequence.

**06 · Build & Operations** — Environment setup · Required secrets · Seeding sample data · Test strategy · Deployment & PWA install · Roadmap (what's shipped / what's next, the former gap register reframed as a forward plan) · Diagram: build → preview → publish pipeline · Diagram: roadmap timeline.

### 4. Mermaid diagrams (authored fresh)

| Doc | Diagrams |
|-----|----------|
| 01 Vision | Controlled-Transparency value flow (sequence) |
| 02 Business | Engagement gantt; monetisation decision tree |
| 03 Product | RFQ lifecycle (stateDiagram); RBAC permissions (flowchart) |
| 04 Functional | RFQ cart flow (sequence); verification state machine |
| 05 Architecture | System architecture (graph TD); ER model (erDiagram); auth+RLS (sequenceDiagram) |
| 06 Ops | Build/deploy pipeline; roadmap timeline (gantt) |

### 5. Markdown rendering & download

- Markdown lives in `src/content/docs/*.md`, imported with Vite `?raw`.
- `<Markdown>` component: `react-markdown` + `remark-gfm` + `rehype-slug` + `rehype-autolink-headings`, prose styled with Tailwind typography mapped to navy/gold semantic tokens.
- `<Mermaid>` component intercepts ` ```mermaid ` fences, renders via `mermaid` lib, theme-aware (dark/light), lazy-init.
- `<DocPage>` chrome: sticky TOC from `##` headings, reading-progress bar, **Download .md** button (Blob), print stylesheet preserved.
- Hub: **Download all (.zip)** via `jszip` — bundles 6 `.md` files + `README.md` index. Single-click export of the entire spec for AI/IDE handoff.

### 6. Hub redesign — `/documents`

1. Hero: "MDDMA Documentation — single canonical spec."
2. Numbered reading-order strip 01 → 06 with read/unread (localStorage).
3. Doc cards: number, title, 1-line summary, read-time, "what's inside" chips ("3 diagrams · 7 sections").
4. Top action row: **Download all (.zip)** · **Print all**.
5. No "superseded" / "ChangeLog" framing anywhere — the new world has one set of docs.

### 7. Routes & redirects

```text
/documents                      → new hub
/documents/:slug                → DocViewer (renders .md)

/pitch, /mvp-canvas             → /documents/vision-and-pitch
/brd, /sow                      → /documents/business-and-scope
/prd                            → /documents/product-and-ux
/fsd                            → /documents/functional-spec
/sdd, /tsd                      → /documents/architecture-and-tech
/changelog                      → /documents/build-and-operations  (or hub)
```

PasswordGate (271195) preserved on all `/documents/*`. Old `.tsx` page files deleted.

### 8. Technical details

- **New deps:** `react-markdown`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `mermaid`, `jszip`, `@tailwindcss/typography`.
- **New files:**
  - `src/content/docs/01-vision-and-pitch.md`
  - `src/content/docs/02-business-and-scope.md`
  - `src/content/docs/03-product-and-ux.md`
  - `src/content/docs/04-functional-spec.md`
  - `src/content/docs/05-architecture-and-tech.md`
  - `src/content/docs/06-build-and-operations.md`
  - `src/content/docs/_meta.ts` — typed registry (slug, title, summary, order, readTime, diagramCount).
  - `src/components/docs/DocPage.tsx` — chrome (TOC, progress, print, download).
  - `src/components/docs/Markdown.tsx` — renderer with mermaid + heading anchors.
  - `src/components/docs/Mermaid.tsx` — theme-aware lazy renderer.
  - `src/pages/DocumentsHub.tsx` — replaces `Documents.tsx`.
  - `src/pages/DocViewer.tsx` — `/documents/:slug`.
- **Edited:** `src/App.tsx` (routes + redirects), `tailwind.config.ts` (typography plugin, prose color mapping).
- **Deleted:** `Documents.tsx`, `ChangeLog.tsx`, `SalesPitch.tsx`, `SOW.tsx`, `BRD.tsx`, `PRD.tsx`, `FSD.tsx`, `SDD.tsx`, `TSD.tsx`, `MVPCanvas.tsx`.
- **Memory:** rewrite `mem://project/documentation` to describe the 6-doc canonical model; update Core line in `mem://index.md` to drop "Source of truth: /changelog" and replace with "Source of truth: /documents (6 canonical markdown docs)."

### 9. Out of scope (explicit)

- No DB-backed editing — markdown stays in the repo (perfect for "rebuild from scratch" handoff).
- No public exposure — password gate stays.
- No translation / i18n.
- No auto-generation of docs from code/schema (could be a future enhancement).

### 10. Execution order

1. Install deps; add typography plugin.
2. Build `Markdown`, `Mermaid`, `DocPage` components.
3. Author the 6 markdown files (full rewrites with ChangeLog content redistributed + diagrams).
4. Build `DocumentsHub` and `DocViewer`; wire routes + redirects.
5. Delete the 10 old `.tsx` pages.
6. Update memory.
7. QA: open each doc, verify diagrams render, downloads work, redirects land correctly.

Approve and I'll execute end-to-end in one pass.
