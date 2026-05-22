# Plan — Doc 00 "Start Here" + Red-Team Reconciliation Pass

The orientation gap and the contradictions are one task. Writing Doc 00 honestly forces the cleanup, and cleanup without an on-ramp leaves the suite still un-navigable. Done together in one pass.

Audience lead: **new committee member / operator** (non-technical institutional tone). Other audiences get sub-sections, not separate docs.

---

## Part A — Reconcile drift FIRST (before Doc 00 references anything)

Three contradictions confirmed against code and locked decisions. Fix at source, then Doc 00 can quote a single truth.

### A1. Broker pricing — strip every "+₹5K" / "addon" survival

- **Truth (BIZ-003, memory):** Broker is a flag on the single ₹10K Paid plan. No addon. No separate tier.
- **Action:** grep the suite for `5,000`, `5K`, `addon`, `+₹5`, `Silver`, `Gold`, `Platinum` and the RBAC mermaid in `03-product-and-ux.md`. Rewrite any survivors. Most likely hits: doc 03 mermaid, doc 12 (money), older roadmap text.

### A2. Live + sample data merge — remove the "merged" language

- **Truth (verified from `src/lib/dataSource.ts`):** "All directory and product data comes from Lovable Cloud. No dummy fallback." `mergeDirectory` / `mergeProducts` just map live rows; sample arrays in `src/data/` are type fixtures only.
- **Action:**
  - Fix doc 04 and doc 05 wording ("merged from live + sample, live wins on slug conflict" → "live-only; sample arrays retained as type fixtures and offline previews").
  - Update `mem://architecture/v3-1-locked-decisions` and the Core memory line that still says "merged with sample" → "live-only (DATA-001)".
  - Add `DATA-001` row to doc 11 decisions log if missing (currently referenced but never logged).

### A3. Pilot size — lock at 8–10 two-sided

- **Truth (your decision this turn):** 8–10 members, two-sided (buyers + sellers both onboarded).
- **Action:**
  - Add `PILOT-001` row to `11-decisions-log.md`: "Pilot scope = 8–10 two-sided members; supersedes earlier '20' / '25' figures."
  - Replace "20 members" / "25 anchor members" in: `02-business-and-scope.md`, `06-build-and-operations.md` (gantt + ops table), `14-roadmap-and-glossary.md`, `27-pilot-plan-and-success-criteria.md` (internal).
  - Update `mem://architecture/implementation-status` pilot line.

### A4. Single roadmap source of truth

- Three gantts disagree (docs 02, 06, 14). Pick **doc 06 as canonical** (it's the build & ops doc). Replace the other two gantts with a one-line "see doc 06 for the live roadmap" + a tight bullet list of current-quarter milestones only. No more parallel gantts.

---

## Part B — Write Doc 00 (Start Here)

New public doc at `src/content/docs/00-start-here.md`, registered in `_meta.ts` as the first entry. Public (not internal).

### Structure (one page, ~800 words, committee-led tone)

1. **About the Association** (150 words)
   - 95-year-old non-profit trade body, ~350 wholesale dry-fruit member firms, committee-governed, currently chaired by Bhuta.
   - Replacing a WhatsApp-based status quo (circulars, RFQs, rate-checks scattered across groups) with one auditable surface.
   - Grievance & Data Protection Officer: Aditya Parmar.

2. **What this platform is, in one paragraph**
   - Behavioral Trade OS: member directory + RFQ engine + circulars + price-controlled product catalogue, on a PWA, India-DPDP-aware.

3. **What's live, planned, and explicitly out of scope** — the status board (the missing table)

   | Capability | Status | Where to read |
   |---|---|---|
   | Auth, RBAC, role simulator | Live | doc 05, doc 15 |
   | Member directory + storefronts + product catalogue | Live (live DB, no sample merge) | doc 04 |
   | Multi-item RFQ engine + cart | Live | doc 04 |
   | Admin CMS (circulars + ads) | Live | doc 04, doc 13 |
   | Native forum (posts + comments) | Live (read-only archive; Discourse is primary) | doc 04 |
   | KYC verification center | Live | doc 23 |
   | Razorpay payment links | Built, test-mode only | doc 12, doc 06 |
   | Behavioral Intelligence Layer (BIL) | Planned, external API (TECH-001) | doc 05 |
   | Buyer reputation scoring | Planned (Q3) | doc 06 |
   | WhatsApp Business API | **Out of scope** (TECH-003); `wa.me` deeplinks only | doc 11 |
   | Lead Packs module | **Killed** (BIZ-001) | doc 11 |
   | Silver/Gold/Platinum tiers | **Killed**; single ₹10K Paid + broker flag (BIZ-003) | doc 11 |

4. **Reading path by role** (4 short sub-sections, 3–5 links each)
   - **Committee member / operator** (lead role) → doc 17 (owner quickstart) → doc 25 (zero-SQL guide) → doc 22 (grievance SOP) → doc 13 (runbook).
   - **Prospective member** → doc 01 (pitch) → doc 02 (scope & pricing) → doc 27 (pilot status).
   - **Government / regulator** → "About the Association" above → doc 19 (privacy) → doc 22 (grievance) → doc 23 (KYC) → doc 26 (retention).
   - **Developer** → doc 05 (architecture) → doc 06 (build & ops, incl. local setup) → doc 07 (DB) → doc 11 (decisions log).

5. **Trade-term mini-glossary** (6 inline one-liners: Mamra, Sanora, mandi, APMC, RFQ, BIL) → "full glossary in doc 14".

6. **One-line context note** for the developer audience (kept small, not in the institutional intro): "Built and maintained by a single engineer under an SOW + SLA — see doc 24." This avoids it reading as a risk signal to regulators while still giving devs the context doc 17 assumes.

### Registration

- Prepend Doc 00 to `DOCS` array in `src/content/docs/_meta.ts` with `number: "00"`, `internal: false`.
- Doc 00 is bundled (public), so it goes in `SOURCES` like docs 01–06. No edge-function changes needed.
- Update `DocumentsHub.tsx` copy: "Public spec (7 docs) plus owner-only reference (22 docs)".

---

## Part C — Memory updates

- `mem://index.md` Core: remove "merged with sample" → "live-only".
- `mem://architecture/implementation-status`: pilot size 8–10 two-sided; payment status = test-mode; doc count = 29.
- `mem://architecture/v3-1-locked-decisions`: add PILOT-001; reaffirm DATA-001 (live-only).

---

## Out of scope (explicit)

- No code changes outside docs + `_meta.ts` + `DocumentsHub.tsx` copy.
- No new edge functions, routes, RLS, or schema.
- No edits to docs 19–22 "effective date" lines (counsel review still pending).
- No new internal docs — Doc 00 is **public** because regulators and prospective members need it.
- Not touching the BIL design or the Razorpay live-mode work — those stay in their existing planned slots.

---

## Deliverable order

1. Reconcile (A1–A4) — quick grep-and-replace pass across ~8 files.
2. Write Doc 00 (B) — new file + `_meta.ts` + Hub copy.
3. Memory sync (C).
4. Report back with: files changed, contradictions fixed (with before/after one-liners), and the new doc count.

Approve and I'll execute in that order.
