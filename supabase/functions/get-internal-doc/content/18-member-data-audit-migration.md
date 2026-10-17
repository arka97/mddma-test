# Member Data Audit & Migration Plan

> **v3.3 · Documentation reviewed 17 October 2026.** Current source and selected hosted schema, policies, settings and buckets were checked. This is not a full security audit, legal approval or device-delivery certification.


Proposed process for how 350+ legacy MDDMA members move from WhatsApp groups, spreadsheets and the office register into the Lovable Cloud database, without losing data, duplicating people, or violating consent.

> **Owner:** Aditya Parmar (Grievance & Data Protection Officer)
> **Status:** Proposed migration plan. Ratification, source counts, consent records, execution and pilot dates are unverified; see doc 27 for pilot targets.

## 1. Sources of truth (today)

| Source | Format | Approx rows | Custodian | Notes |
|---|---|---|---|---|
| MDDMA office register | Paper + Excel | ~350 | Office staff | Authoritative for membership #, year joined |
| WhatsApp "MDDMA Members" group | Phone numbers only | ~280 | Committee | Phone is the join key |
| Past circulars distribution list | Email + name | ~190 | Secretary | Names sometimes inconsistent (initials, suffixes) |
| Bhuta & Co. introductions | Ad-hoc | ~40 | Bhuta | High-trust seed cohort |
| Trade show business cards | Paper | ~50 | Misc | Unverified; do **not** auto-import |

**Source of truth precedence (highest → lowest):** Office register → Bhuta intros → Circular list → WhatsApp roster → Business cards.

## 2. Target schema mapping

| Source field | Target table.column | Cleaning rule |
|---|---|---|
| Member # | `companies` (memo only, not stored — used to track lineage in spreadsheet) | Keep in audit CSV, do not store in DB |
| Full name | `profiles.full_name` | Title-case, strip honorifics ("Shri ", "Mr."), retain in `bio` if relevant |
| Company name | `companies.name` | Dedup by lowercased slug |
| Phone | `profiles.phone` | Normalize to E.164 (`+91...`), strip spaces/dashes |
| Email | `auth.users.email` | Lowercase; reject if invalid |
| GSTIN | `companies.gstin` | Regex-validated; otherwise leave null |
| Address | `companies.address`, `city`, `state` | Best-effort split |
| Year joined | `companies.established_year` (if founder year) OR memo | Don't conflate "joined MDDMA" with "company founded" |
| Categories | `companies.categories` text[] | Map free text to canonical chips (almonds, dates, cashews, walnuts, raisins, pistachios, other) |

## 3. Deduplication algorithm

A row is a **duplicate** if any of:
1. Same E.164 phone OR
2. Same lowercased email OR
3. Same GSTIN OR
4. Same `slugify(company_name)` AND same city.

Conflicts are resolved by the precedence ladder in §1. The losing row is appended to the audit CSV with `dedup_kept = <kept_id>` so nothing is silently dropped.

## 4. Consent to migrate

Per DPDP Act §6 (consent), §7 (legitimate uses), and IT Rules 2021, we cannot mass-import people into a digital platform without notice + opt-in. The migration follows this sequence:

1. **Notice (Day 0)** — WhatsApp broadcast + SMS to every phone in scope, in English and Hindi, linking to the Privacy Policy (doc 19) and stating: *"MDDMA is moving its member directory online. Reply YES to opt in. Reply STOP to be excluded. No reply = excluded by default after 14 days."*
2. **Reminder (Day 7)** — Same channel, gentler tone.
3. **Cutoff (Day 14)** — Anyone who has not replied YES is **not** seeded.
4. **First login (required future acceptance flow)** — User reviews the business record and accepts the published Privacy/Terms notice. Current `/apply` is business registration and does not implement a policy-version-hash consent checkbox; implement and verify consent capture before migration.

Opt-in evidence is logged in a private spreadsheet (`migration-consent-log.xlsx`) owned by the Grievance Officer for 7 years (matches DPDP record-keeping practice).

## 5. Seeding mechanics

For opted-in members:

1. Use a reviewed developer-run invitation/account provisioning flow. Do not create arbitrary shared temporary passwords or directly modify managed Auth rows; retain normal email confirmation.
2. Trigger `handle_new_user` auto-creates `profiles` and the `free_member` role.
3. Insert a draft `companies` row with `review_status='pending'`, `is_hidden=true`.
4. Send each member a personalised magic-link email: *"Claim your MDDMA listing"*.
5. On first claim, the user reviews their pre-filled company, edits, submits.
6. Staff review is required. Current Companies moderation exposes Verify/Unverify and Hide/Unhide, not a full approval/claim workflow. A developer must implement or perform a reviewed approval before this planned migration is executable.

The earlier founding-window/no-payment passage is a proposed commercial arrangement, not a live payment rule. In-app membership management is disabled; confirm committee-authorised migration access separately.

## 6. Audit artefacts (kept by the Grievance Officer)

- `migration-source.csv` — every source row, raw.
- `migration-cleaned.csv` — post-normalisation, pre-dedup.
- `migration-final.csv` — what was actually inserted, with `auth_user_id`, `company_id`.
- `migration-rejected.csv` — rows skipped, with reason.
- `migration-consent-log.xlsx` — phone/email + YES/STOP/no-reply + timestamp.

Retention: 7 years from migration date, then permanently deleted.

## 7. Rollback

If we discover a systemic error in the first 30 days:

1. Identify affected `auth_user_id`s from `migration-final.csv`.
2. Have the developer verify dependencies, data retention/legal holds and object references before controlled rollback. Auth deletion does not prove all company/team/trade/media data is cascade-cleaned.
3. Re-run the corrected pipeline.

After day 30, users may have created RFQs, quotations, deal messages, posts and brands. Prefer scoped reviewed corrections over blanket account deletion; preserve required audit data (doc 26).

## 8. Sign-off

This plan is executed only after:
- [ ] Privacy Policy (doc 19) published at `/privacy`.
- [ ] Terms (doc 20) published at `/terms`.
- [ ] Grievance contact (Aditya Parmar) live in footer.
- [ ] Committee chair signs the consent-notice text.

## Current implementation and sign-off gaps

Source counts/custodians above are planning estimates, not verified inventories. The claim-link/import pipeline, policy-hash consent capture and complete approval UI are not shipped by this documentation update. Existing signup is not evidence of migration consent. Committee operators never run account/SQL import commands; they obtain opt-in and hand the approved batch to the developer. Use current verified URLs; /privacy and /terms have no public routes yet. Do not send those missing links as though published.
