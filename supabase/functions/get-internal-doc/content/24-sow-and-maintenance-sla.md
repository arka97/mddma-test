# Statement of Work & Maintenance SLA

**Parties:** MDDMA ("Client") and the solo developer ("Contractor"). This document scopes the build phase and the ongoing maintenance phase, and protects the Contractor from indefinite, unbilled work.

> **Status:** Draft template. Both parties sign a printed copy before any further deliverables; this doc is the canonical reference inside the codebase.

## 1. Engagement model

- **Solo developer**, supported by the Lovable agent.
- **Build-and-maintain** in two phases (Build, then Maintenance) with a clean handover gate between them.
- Day-to-day instructions flow from the MDDMA Committee Chair (or a single delegated point of contact). Committee-wide change requests must be consolidated before reaching the Contractor.

## 2. Build phase — scope (in)

Everything specified across docs 01–17 of this documentation suite at the version pinned at signature, including:

- Directory, Storefront, Products, Variants, Brands
- Multi-item RFQ Cart + RFQ Inbox
- Membership flow (Free / Paid ₹10,000) with Razorpay
- Forum (native posts/comments + optional Discourse embed)
- Admin CMS (circulars, ads, posts moderation)
- KYC tier ladder (mechanics; the in-app KYC upload flow ships in Maintenance unless explicitly added here)
- PWA + Install
- Documents Hub (this suite, password-gated)
- Behavioural signals UI (stock bands, demand trend, live ticker)
- Role simulator (demo)

## 3. Build phase — scope (explicitly out)

- WhatsApp Business API (memory TECH-003)
- Lead Packs module (memory BIZ-001)
- Behavioural Intelligence Layer external API beyond the Phase 1 façade (memory)
- Native mobile apps (Android / iOS) beyond PWA
- Multi-language UI (English only at launch)
- Custom-built escrow or payment-holding wallet
- Tax filings, GST reconciliation, accounting software integration
- Migration of legacy member data (covered by doc 18; execution is a separate billable task)

## 4. Milestones & payment

| # | Milestone | Acceptance criteria | Payment |
|---|---|---|---|
| M1 | Repo + design system + auth + role simulator | Demo login as each role; all design tokens documented | 25% |
| M2 | Directory + Products + Storefront + Brands | Browsing flows complete; sample data renders | 25% |
| M3 | RFQ Cart + RFQ Inbox + Forum + Circulars + Ads CMS | End-to-end RFQ submission and response; CMS CRUD working | 25% |
| M4 | Membership flow + Razorpay + KYC mechanics + Documents Hub + PWA + production deploy | First real Paid member onboarded; PWA installable; sitemap published | 25% |

Each milestone is signed off within **5 business days** of demo. Unanswered sign-off after 10 business days is deemed accepted.

## 5. Change requests during Build

- Up to **2 hours per week** of minor changes are included.
- Beyond that, changes are quoted at the agreed hourly rate before work starts.
- Any change that touches scope §3 ("out") triggers a written addendum.

## 6. Maintenance phase — start

Begins on M4 sign-off. Initial term: **12 months**, auto-renewing for further 12-month terms unless either party gives **60 days' written notice**.

## 7. Maintenance — what's included

| Bucket | Included |
|---|---|
| **Hosting oversight** | Lovable Cloud status checks weekly; respond to outages |
| **Security patches** | Dependency updates (`bun update`) monthly; emergency CVE patches within 72h of public disclosure |
| **Bug fixes** | Reproducible regressions of features delivered in Build, at no extra cost |
| **Backups** | Verify Cloud snapshot health monthly; export critical storage objects quarterly |
| **Minor copy / config tweaks** | Up to **4 hours per month** rolled over to next month only (max 8h carry) |
| **Quarterly health review** | Written note: linter findings, role audit, perf, recommended improvements |

## 8. Maintenance — what's billable

| Bucket | Billed at hourly rate |
|---|---|
| **New features** (anything not in Build §2) | Quoted in writing first |
| **Data migrations / bulk imports** beyond doc 18's plan | Quoted |
| **Third-party integrations** (Discourse, analytics, ERP, accounting) | Quoted |
| **Design changes** (palette, typography, layout overhaul) | Quoted |
| **Emergency work outside office hours** | 1.5× hourly rate (Sat/Sun/IST night), with prior approval where possible |
| **Training & non-technical guides** | 1h per quarter included; further training quoted |

## 9. Response & resolution SLA

Office hours = Mon–Sat 10:00–18:00 IST.

| Severity | Definition | First response | Target resolution |
|---|---|---|---|
| **S1 — Critical** | Site down, payments broken, data leak | 1 office hour | 8 office hours |
| **S2 — High** | Major feature broken for many users (RFQ submit, login) | 4 office hours | 2 office days |
| **S3 — Medium** | Minor feature degraded, workaround exists | 1 office day | 5 office days |
| **S4 — Low** | Cosmetic, copy, UX nit | 3 office days | Next maintenance cycle |

Severity is set by the Contractor in consultation with the point of contact; disagreements are escalated to the Committee Chair.

## 10. Communication & handover

- One Slack / WhatsApp channel between Contractor and the single point of contact.
- All formal requests captured in writing (email or shared sheet) — no scope changes by voice call only.
- Quarterly "state of the platform" call with the committee, 60 minutes, included.

## 11. IP & ownership

- All code authored under this engagement is **owned by MDDMA** upon payment of the relevant milestone.
- The Contractor retains the right to reuse generic helpers, design system primitives, and prompts that do not embed MDDMA-specific business logic.
- The Lovable account hosting the project is transferred to the MDDMA-controlled email at the end of the engagement (or at MDDMA's written request earlier).

## 12. Confidentiality

Both parties keep non-public information confidential during the engagement and for 3 years after. Personal data is additionally governed by docs 19 and 25.

## 13. Liability

- Contractor's liability is capped at **fees paid in the preceding 12 months**.
- No liability for indirect or consequential damages.
- Carve-outs for fraud, wilful misconduct, breach of confidentiality.

## 14. Termination

Either party may terminate with 60 days' written notice. On termination:
- All outstanding sign-off-pending milestones are billed pro-rata for the work completed.
- The Contractor delivers credentials, secrets and documentation.
- The Contractor remains available for **30 days** at the hourly rate for transition questions.

## 15. Governing law

Indian law. Mumbai jurisdiction.

## 16. Signatures

Printed and countersigned by:
- _______________________ (Contractor)
- _______________________ (MDDMA Committee Chair)
- Date: _______________
