# Start Here

If you have never opened MDDMA before, read **this page first**. Five minutes. It tells you what the Association is, what the platform actually does today, and which of the other 28 docs is the right next read for you.

## About the Association

The **Mumbai Dry-fruits & Dates Merchants Association (MDDMA)** is a **95-year-old non-profit trade body** founded in 1930. It represents **~350 wholesale dry-fruit and dates member firms** trading out of APMC Vashi and the historic Masjid Bunder mandi. The Association is governed by an elected committee — currently chaired by **Bhuta-ji** — and is run day-to-day from the office in Sector 19, APMC Market, Vashi, Navi Mumbai.

Until 2026 the Association coordinated almost everything — circulars, rate enquiries, member RFQs, dispute notices — through a constellation of **WhatsApp groups**. That worked for fellowship but failed for audit, search, verification, and onboarding new members. The MDDMA digital platform replaces that WhatsApp-first status quo with a single, auditable surface that the committee owns.

Named **Grievance & Data Protection Officer** under DPDP Act 2023 §8(9) and IT Rules 2021 §3(11): **Aditya Parmar** — grievance@mddma.org · +91 22 2784 1234.

## What the platform is, in one paragraph

A **Behavioral Trade Operating System** for the Association: a verified member directory, a multi-item RFQ engine, an admin-managed circulars and ads CMS, a price-controlled product catalogue, and a native community forum — wrapped in an installable PWA, role-aware (Guest / Free / Paid / Broker / Admin), DPDP-compliant, and built on Lovable Cloud (Auth + Postgres + Storage + Edge Functions). No exact prices, no exact stock counts are ever rendered — that is the "controlled transparency" rule (UX-001) the rest of the spec is built around.

## What's live, planned, and explicitly out of scope

The single most asked question from a new reader. The table below is the source of truth — if another doc disagrees, this one wins.

| Capability | Status | Where to read |
|---|---|---|
| Auth, RBAC (admin / broker / paid / free), role simulator | **Live** | doc 05, doc 15 |
| Member directory + storefronts + product catalogue | **Live** (live DB only — no sample merge, DATA-001) | doc 04 |
| Multi-item RFQ engine + cart (auth-required, UX-002) | **Live** | doc 04 |
| Admin CMS (circulars + ads) | **Live** | doc 04, doc 13 |
| KYC verification center (basic + business tiers) | **Live** | doc 23 |
| Native forum (posts + comments) | **Live** (read-only archive; Discourse is the primary forum) | doc 04 |
| Markdown documentation hub (this) — 29 docs | **Live** | doc 06 |
| PWA install (Android Chrome + iOS Safari) | **Live** | doc 06 |
| Razorpay payment links | **Built, test-mode only** — live keys gated on the legal pack going public (LEGAL-001) | doc 12, doc 11 |
| Legal pack as public routes (`/privacy`, `/terms`, `/refund`, `/grievance`) | **Drafted, not promoted** — counsel review pending | docs 19–22 |
| Pilot — 8–10 sellers + 8–10 buyers, 90 days | **Active** (Week 3 of 12, PILOT-001) | doc 27, doc 28 |
| Behavioral Intelligence Layer (BIL) | **Planned**, external API (TECH-001) | doc 05, doc 14 |
| Buyer reputation scoring (GOV-001) | **Planned** — Q3 2026 | doc 06 |
| Demand-trend chips on every card | **Planned** | doc 06 |
| WhatsApp Business API | **Out of scope** (TECH-003) — `wa.me` deeplinks only | doc 11 |
| Lead Packs module | **Killed** (BIZ-001) | doc 11 |
| Silver / Gold / Platinum tiers | **Killed** (BIZ-002) — single ₹10K Paid tier | doc 11 |
| Separate broker price / "₹5K addon" | **Killed** (BIZ-003) — broker is a flag on the same ₹10K plan | doc 11 |
| Public authority layer (home, about, membership, circulars, knowledge, FAQ) | **Live** — prerendered, AI-friendly (GTM-001) | doc 11 |
| Transactional core (directory, products, RFQ, storefronts, broker) | **Live** — `noindex` + auth-walled (GTM-001) | doc 11 |

## Reading path by role

Pick your role. Read those 3–5 docs in order. The other 24 are reference material — open them only when one of these tells you to.

### If you are a committee member or office operator (start here)
1. **Doc 17 — Owner Quickstart** · "where do I…?" task index.
2. **Doc 25 — Committee Operator Guide (Non-technical)** · zero-SQL, screenshots-only walkthrough of every committee task: approve members, publish a circular, run a refund, handle a grievance.
3. **Doc 22 — Grievance & Redressal Mechanism** · the SOP that the Grievance Officer (Aditya Parmar) follows for any member complaint.
4. **Doc 13 — Operations Runbook** · for the rare situations the operator guide does not cover; pass to the developer if it asks for SQL.

> **Hard rule (OPS-001):** committee and office staff never run SQL. Doc 25 is sufficient for every standing task.

### If you are a prospective member
1. **Doc 01 — Vision & Pitch** · why MDDMA exists and what it does for you.
2. **Doc 02 — Business & Scope** · what's included for ₹10,000/year, what's not.
3. **Doc 27 — Pilot Plan & Success Criteria** *(internal)* · proof the platform actually works; ask your committee contact for access.

### If you are a regulator or government auditor (credibility audience)
1. **About the Association** above — the 95-year context.
2. **Doc 19 — Privacy Policy** · DPDP Act 2023 grounded notice; categories collected, lawful basis, retention, rights.
3. **Doc 22 — Grievance & Redressal Mechanism** · IT Rules 2021 §3(11) compliance; named officer, timelines, escalation.
4. **Doc 23 — KYC & Verification Policy** · what we check at each tier, who can see KYC documents, retention.
5. **Doc 26 — Data Retention & Deletion Policy** · per data class, including the RFQ-snapshot anonymisation at 7 years / hard delete at 10 (DATA-001b).

### If you are a developer inheriting the build
1. **Doc 05 — Architecture & Tech** · stack, layering rules, data model, auth model, BIL contract.
2. **Doc 06 — Build & Operations** · local setup, required secrets, deploy, the canonical roadmap.
3. **Doc 07 — Database Reference** *(internal)* · every table, RLS policy, function, trigger.
4. **Doc 11 — Decisions Log** *(internal)* · every locked decision with a permanent ID. Re-read this before refactoring anything.
5. **Doc 24 — SOW & Maintenance SLA** *(internal)* · build and maintenance scope. MDDMA is a solo-engineered build under an SOW + ongoing maintenance SLA; this is the contractual context for everything else.

## Trade terms you'll hit immediately

The full glossary lives in **doc 14**. These six are the ones the very first page of doc 01 uses without defining:

- **Mamra** — a small, sweet, premium grade of almond (Iranian origin).
- **Sanora** — a larger, harder Californian-style almond grade.
- **Mandi** — wholesale physical market; here, the historic Masjid Bunder market.
- **APMC** — Agricultural Produce Market Committee; the regulated wholesale market complex in Vashi, Navi Mumbai.
- **RFQ** — Request For Quotation; a buyer's structured ask for price + availability on one or more items.
- **BIL** — Behavioral Intelligence Layer; the planned external service that turns member activity into demand-trend chips and buyer-reputation scores. Not live today.

## A note on the build

The platform was built and is maintained by a single engineer under a Statement of Work plus an ongoing maintenance SLA. The full contractual context — scope, severity targets, IP, succession — lives in **doc 24**. Anything that requires multi-engineer coordination (a security audit, a large migration, a second build phase) is explicitly out of the standing SLA and is scoped separately.

## Read next

Pick your role above and follow the 3–5 docs it points to. Then come back here and look at the status table again — most "is this live?" questions are answered in the table without opening a single other file.
