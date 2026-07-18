# Start Here

> **v3.2 · Last verified July 2026** against the live database (`public` schema), deployed edge functions, `src/routes.tsx`, and the header/footer/bottom-tab shells.

If you have never opened **G-BAU-G** (the MDDMA digital platform) before, read **this page first**. Five minutes. It tells you what the Association is, what the platform actually does today, and which of the other 28 docs is the right next read for you.

## About the Association

The **Mumbai Dryfruits & Dates Merchants Association (MDDMA)** is a **95-year-old non-profit trade body** founded in 1930. It represents **~350 wholesale dry-fruit and dates member firms** trading out of APMC Vashi and the historic Masjid Bunder mandi. The Association is governed by an elected committee and is run day-to-day from the office in Sector 19, APMC Market, Vashi, Navi Mumbai. Office contact: **+91 98200 69545**.

Until 2026 the Association coordinated almost everything — circulars, rate enquiries, dispute notices — through a constellation of WhatsApp groups. That worked for fellowship but failed for audit, search, verification, and onboarding new members. The G-BAU-G platform replaces that WhatsApp-first status quo with a single, auditable surface that the committee owns.

Named **Grievance & Data Protection Officer** under DPDP Act 2023 §8(9) and IT Rules 2021 §3(11): **Aditya Parmar** — grievance@mddma.org.

## The brand

- **App name:** **G-BAU-G** (rendered "G.BAU.G" in the header wordmark).
- **Publisher:** by Mumbai Dryfruits & Dates Merchants Association.
- **Palette:** GoKwik-inspired "Warm Commerce" — gold primary `#d8a86a`, cream backgrounds, navy ink, 16px radii, pill buttons.
- **Every color, gradient and shadow is a semantic HSL token** in `src/index.css`. Hard-coded utilities (`text-white`, `bg-emerald-*`, `bg-[#...]`) are forbidden — the `success` token replaces green everywhere.

## What the platform is, in one paragraph

A **Behavioral Trade Operating System** for the Association: a verified member directory, seller storefronts and brand pages, a controlled-transparency product catalogue, a **Community Feed** (`/market`) that replaces the old chat-first workflow, an **RFQ board** (`/rfq`) for buy/sell intent, an admin CMS for **Bulletin** (circulars) and advertising, a public knowledge + FAQ + contact authority layer, and a dashboard with live onboarding checklist and install nudge — wrapped in an installable PWA, role-aware (Guest / Free / Paid / Broker / Admin), DPDP-compliant, and built on Lovable Cloud (Auth + Postgres + Storage + Edge Functions). No exact prices, no exact stock counts are ever rendered — that is the **controlled transparency** rule (UX-001). Contact between buyers and sellers happens via `wa.me` deeplinks and revealed phone numbers, logged for audit.

## Information architecture (source of truth)

| Surface | Routes |
|---|---|
| **Public authority layer** (prerendered, indexable, AI-crawler-friendly) | `/`, `/about`, `/membership`, `/apply`, `/install`, `/circulars`, `/circulars/:slug`, `/knowledge`, `/knowledge/:slug`, `/faq`, `/contact` |
| **Transactional core** (`noindex`, auth-walled, no price/stock/contact in HTML) | `/directory`, `/directory/:slug`, `/products`, `/products/:slug`, `/store/:slug`, `/brands`, `/brands/:slug`, `/market`, `/rfq`, `/dashboard`, `/account/*`, `/documents`, `/login`, `/forms` |
| **Desktop nav** | Home · Directory · Products · Market · RFQ · Membership + **More** dropdown (Brands, Circulars, Knowledge, FAQ, About, Contact) |
| **Mobile bottom tabs** | Home (`/`) · Market (`/market`) · RFQ (`/rfq`) · Members (`/directory`) · Account (`/dashboard`) — 52 px hit area, `text-[11px]` labels |
| **Retired routes (v3.2 review)** | `/broker` → `/directory?type=Broker` · `/community` → `/market` · `/directorylist` → `/directory` |

## What's live, planned, and explicitly out of scope

If another doc disagrees with this table, this table wins.

| Capability | Status | Where to read |
|---|---|---|
| Auth, RBAC (admin / broker / paid / free), role simulator | **Live** | doc 05, doc 15 |
| Member directory + storefronts + product catalogue | **Live** (live DB only — DATA-001) | doc 04 |
| Seller brands (`/brands`, `/brands/:slug`, storefront brand strip) | **Live** | doc 04 |
| Admin CMS — **Bulletin** (circulars) + Ads | **Live** | doc 04, doc 13 |
| Home shell — hero, live ticker, quick actions, category grid, New Products, New Members, membership CTA | **Live** | doc 04 |
| Community Feed (`/market`) — posts, comments, likes, views, polls, PDFs, images (clipboard paste), rich link/oEmbed previews, anonymous posting | **Live** | doc 04 |
| RFQ board (`/rfq`) — listings with 1–90 day expiry, logged contact reveal | **Live** | doc 04 |
| Admin **Feature Access** toggle (opens Market + RFQ to guests/free during pilot) | **Live** | doc 04, doc 13 |
| Dashboard — 5-step OnboardingChecklist + dismissible InstallAppNudge | **Live** | doc 03 |
| Public authority pages — `/faq` (JSON-LD), `/knowledge` + `/knowledge/:slug`, `/contact` | **Live** | doc 04 |
| Forms page (`/forms`) — Advertise + Submit Circular tabs | **Live** | doc 04 |
| KYC verification (admin-managed via `/account/moderation`) | **Live** | doc 23 |
| Native forum tables (posts + comments) | **Read-only archive** — superseded by `/market` | doc 04 |
| Markdown documentation hub — 29 docs (7 public 00–06 + 22 internal 07–28) | **Live** | doc 06 |
| PWA install (Android Chrome + iOS Safari) | **Live** | doc 06 |
| Razorpay payment links | **Built, test-mode only** — live keys gated on the legal pack going public (LEGAL-001) | doc 12 |
| Legal pack as public routes (`/privacy`, `/terms`, `/refund`, `/grievance`) | **Drafted, not promoted** — counsel review pending | docs 19–22 |
| Pilot — 8–10 sellers + 8–10 buyers, 90 days | **Active** (Week 3 of 12, PILOT-001) | doc 27 |
| Behavioral Intelligence Layer (BIL) | **Planned**, external API (TECH-001) | doc 05, doc 14 |
| Buyer reputation scoring (GOV-001) | **Planned** — Q3 2026 | doc 06 |
| Demand-trend chips on every card | **Planned** | doc 06 |
| WhatsApp Business API | **Out of scope** (TECH-003) — `wa.me` deeplinks only | doc 11 |
| Lead Packs module | **Killed** (BIZ-001) | doc 11 |
| Silver / Gold / Platinum tiers | **Killed** (BIZ-002) — single ₹10K Paid tier | doc 11 |
| Separate broker price / "₹5K addon" | **Killed** (BIZ-003) — broker is a flag on the same ₹10K plan | doc 11 |
| /forms Verification Request flow | **Removed v3.1.3** — verification is admin-driven only | doc 04 |

## Reading path by role

Pick your role. Read those 3–5 docs in order. The other 24 are reference material — open them only when one of these tells you to.

### If you are a committee member or office operator (start here)
1. **Doc 17 — Owner Quickstart** · "where do I…?" task index.
2. **Doc 25 — Committee Operator Guide (Non-technical)** · zero-SQL walkthrough of every committee task: approve members, publish a bulletin, flip Feature Access, run a refund, handle a grievance.
3. **Doc 22 — Grievance & Redressal Mechanism** · the SOP the Grievance Officer follows.
4. **Doc 13 — Operations Runbook** · for the rare situations doc 25 does not cover; pass to the developer if it asks for SQL.

> **Hard rule (OPS-001):** committee and office staff never run SQL. Doc 25 is sufficient for every standing task.

### If you are a prospective member
1. **Doc 01 — Vision & Pitch** · why the platform exists and what it does for you.
2. **Doc 02 — Business & Scope** · what's included for ₹10,000/year, what's not.
3. **Doc 27 — Pilot Plan & Success Criteria** *(internal)* · ask your committee contact for access.

### If you are a regulator or government auditor
1. **About the Association** above — the 95-year context.
2. **Doc 19 — Privacy Policy** · DPDP Act 2023 grounded notice.
3. **Doc 22 — Grievance & Redressal Mechanism** · IT Rules 2021 §3(11) compliance.
4. **Doc 23 — KYC & Verification Policy** · what we check at each tier.
5. **Doc 26 — Data Retention & Deletion Policy** · per data class.

### If you are a developer inheriting the build
1. **Doc 05 — Architecture & Tech** · stack, layering rules, data model, RLS model, BIL contract.
2. **Doc 06 — Build & Operations** · local setup, required secrets, deploy, the canonical roadmap.
3. **Doc 07 — Database Reference** *(internal)* · every table, RLS policy, function, trigger.
4. **Doc 11 — Decisions Log** *(internal)* · every locked decision with a permanent ID.
5. **Doc 24 — SOW & Maintenance SLA** *(internal)* · contractual context for a solo-engineered build.

## Trade terms you'll hit immediately

The full glossary lives in **doc 14**. These six are the ones the very first page of doc 01 uses without defining:

- **Mamra** — a small, sweet, premium grade of almond (Iranian origin).
- **Sanora** — a larger, harder Californian-style almond grade.
- **Mandi** — wholesale physical market; here, the historic Masjid Bunder market.
- **APMC** — Agricultural Produce Market Committee; the regulated wholesale market complex in Vashi, Navi Mumbai.
- **Storefront** — a Paid member's curated product showcase at `/store/:slug`, with brand strip and category tabs.
- **BIL** — Behavioral Intelligence Layer; the planned external service that turns member activity into demand-trend chips and buyer-reputation scores. Not live today.

## A note on the build

The platform was built and is maintained by a single engineer under a Statement of Work plus an ongoing maintenance SLA. The full contractual context — scope, severity targets, IP, succession — lives in **doc 24**. Anything requiring multi-engineer coordination (a security audit, a large migration, a second build phase) is explicitly out of the standing SLA and is scoped separately.

## Read next

Pick your role above and follow the 3–5 docs it points to. Then come back here and look at the status table again — most "is this live?" questions are answered in the table without opening a single other file.
