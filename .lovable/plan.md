## Goal

Bring every `/documents` markdown file into alignment with the platform's actual state as of today (22 May 2026). The 11 new docs (18–28) were added in the last turn but the older docs still claim a "6-document suite", an outdated roadmap, and stale "what's shipped" lists. This refresh closes that gap without changing any product behaviour.

## What's drifted (verified by reading the files)

- **Docs 01–06** repeatedly say "the 6 documents in this suite" / "Read next: 06" — the suite is now 28 docs.
- **Doc 02 §Deliverables** lists "this set of 6 documents" and **§Engagement scope** has no entry for the policy/operator pack (18–28).
- **Doc 06 §Roadmap** marks the markdown hub "shipped" but predates the policy pack, mobile responsiveness pass, and the internal-doc edge-function bundle fix.
- **Doc 06 §Required secrets** is current but doesn't mention the new internal docs.
- **Doc 11 (Decisions Log)** has no entry for the GO-LIVE-blocker decisions implied by 19/20/21 (legal stack required) or the KYC-maximalist follow-through (doc 23).
- **Doc 13 (Operations Runbook)** SQL-heavy recipes should cross-link to doc 25 (non-technical guide) so admins know there's a friendlier path.
- **Doc 14 (Roadmap & Glossary)** still shows the old roadmap and a glossary missing terms now used by the new docs (Grievance Officer, founding-window, legal hold, anchor cohort).
- **Doc 17 (Owner Quickstart)** "Add an internal doc" recipe is correct but the "Where do I…?" table doesn't list the new pages.
- **Memory `architecture/implementation-status`** still claims "currently using realistic sample data" — outright wrong; live DB has been in for weeks.

## What gets edited (no new docs, no code, no schema)

### Public canonical (`src/content/docs/`)

1. **01-vision-and-pitch.md** — update "Read next" to point at the new docs that matter (19 Privacy, 27 Pilot). Add one line acknowledging the legal & operator pack now exists.
2. **02-business-and-scope.md**
   - Replace "this set of 6 documents" with "this suite (28 docs as of May 2026)".
   - Add a milestone row M5 (legal & operator pack shipped, May 2026).
   - Add a new "What's now also in scope" sub-section listing: Privacy / Terms / Refund / Grievance / KYC policy / SOW / Committee guide / Retention / Pilot plan / GTM playbook / Migration plan — each one-line.
3. **03-product-and-ux.md** — add a single sentence in the governance section: "Member-facing policies (Privacy, Terms, Refund) are linked from the footer; the Grievance Officer is named in-app."
4. **04-functional-spec.md** — add a short "Member-facing legal & policy pages" subsection noting they live behind the `/documents` password until they are promoted to public routes (future work; not in this turn).
5. **05-architecture-and-tech.md** — refresh the doc-system paragraph: 6 public bundled + 22 internal (07–28) served by `get-internal-doc`. Note the bundle is generated from `./content/*.md`.
6. **06-build-and-operations.md**
   - §Roadmap: move "Pilot with 20 members" to ✅ done (active since 2026-05-03 per doc 02; we're in week 3). Add a new shipped row for "Mobile responsiveness pass" and "Legal & operator doc pack (18–28)". Push BIL v1 and buyer-reputation start dates by 2 weeks to reflect the doc-pack detour.
   - §Test strategy: note that the new docs add no new code paths — vitest scope unchanged.
   - §Operational runbook: add a row "Member asks for refund / data deletion → forward to grievance@mddma.org; see docs 21 & 26".
   - §Read next: add 17, 25, 27.

### Internal (`supabase/functions/get-internal-doc/content/`)

7. **11-decisions-log.md** — append 4 new locked-decision rows:
   - LEGAL-001: Privacy/Terms/Refund/Grievance are pre-requisites for Razorpay live mode (doc 21).
   - LEGAL-002: Grievance Officer is **Aditya Parmar**, single point of contact for DPDP and IT-Rules complaints.
   - OPS-001: Committee uses the non-technical guide (doc 25); no SQL in office hands.
   - DATA-001: RFQ rows anonymised at year 7, hard-deleted at year 10 (doc 26 §3).
8. **13-operations-runbook.md** — top-of-file note: "For zero-SQL recipes the committee can run themselves, see doc 25." Add cross-links from "Approve a company", "Publish a circular", "Run an ad", "Pin a post" rows to their doc-25 counterparts.
9. **14-roadmap-and-glossary.md**
   - Replace the dated roadmap with the post-doc-pack roadmap matching doc 06 above.
   - Glossary: add **Grievance Officer**, **Anchor (cohort)**, **Founding window**, **Legal hold**, **Pattern D**, **DPDP**, **IT Rules 2021**.
10. **17-owner-quickstart.md**
    - "Where do I…?" table: add rows for *"Member asks to delete their data"* → doc 26 §5, *"Member asks for refund"* → doc 21, *"Privacy/Terms/Refund/Grievance update"* → doc 19/20/21/22, *"Committee needs a guide they can read"* → doc 25.
    - "Feature → file map": add a "Member-facing policies" row pointing at the new docs (slug list).
    - Update the "internal doc count" passage to reflect 22 internal docs.

### Memory (one update, no others)

11. **`mem://architecture/implementation-status`** — rewrite from the stale "demo with sample data" to: "Cloud backend live since Feb 2026. Directory, RFQ, Forum, CMS, Membership flow, PWA, docs hub all shipped. 28-doc suite (6 public + 22 internal incl. legal/operator pack added May 2026). Pilot active week 3 of 12."

### Memory index — no change required

The index already references implementation-status; the body update flows through.

## Out of scope (deliberately)

- No new public routes (`/privacy`, `/terms`, `/refund` stay TODO — flagged as a future task in doc 04).
- No new edge functions; the existing bundle generation already handles 22 internal docs.
- No DB schema, no RLS, no auth changes.
- No code component changes; this is a documentation-only refresh.
- I will not edit the published "effective date" line on docs 19–22 — counsel review is still pending.

## Verification after edits

- Re-read `/documents` in the preview at the current 271195 password; spot-check that doc 02 §Deliverables, doc 06 §Roadmap, and doc 17 "Where do I…?" reflect the new state.
- Confirm `supabase/functions/get-internal-doc/content.ts` does not need regeneration (these edits are all in-place to existing files; the regen script reads file contents at build time — I will re-run the generator to be safe).

## Deliverable

One round of focused markdown edits to 10 existing files plus one memory update. No new files, no behaviour changes, no breaking changes to the docs URLs.
