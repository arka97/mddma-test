# Member Data Audit & Migration Plan


> **v3.2 Update Notice (July 2026)** — This doc has been updated for **v3.2**. Key changes since v3.1.3:
>
> - **RFQ is back**, under a new schema. The `/rfq` route is live, backed by the `rfq_listings` and `rfq_contact_reveals` tables. It is open to paid members and admins; contact reveal is logged. The old `rfqs` / `inquiry_products` / `rfq_responses` tables, the multi-item RFQ cart, `CartContext`, `CartFab` / `CartDrawer` / `RFQModal`, and the `/account/rfqs` inbox all remain **removed**. Any older reference below to those artifacts is historical.
> - **`/market` is now the Community Feed**, not Market News. It uses `community_posts`, `post_comments`, `post_likes`, `post_views`, and `anonymous_identity_log` (admin-only RLS). Paid + admin can post; free members are read-only for the first 7 days; guests see a teaser; anonymous posting is paid-only.
> - **Mobile bottom tab bar** order is now **Home (`/`) · Market (`/market`) · RFQ (`/rfq`) · Members (`/directory`) · Account (`/dashboard`)**.
> - **Admin Feature Access toggle** — while the pilot is running, admins can flip a global switch (`app_settings.features_open_to_all`, exposed via the `is_features_open()` SQL function) that temporarily opens Community Feed posts and RFQ listings to guests and free members. RLS on `community_posts` and `rfq_listings` reads `is_features_open()`; the frontend reads `featuresOpen` / `isEffectivePaid` from `RoleContext`. Managed from **Admin → Moderation → Feature Access**.
>
> The **/forms Verification Request** flow remains **removed** — members are verified during admin onboarding, not via a self-serve form.

---


Closes the long-standing "Task 1" (memory): how 350+ legacy MDDMA members move from WhatsApp groups, spreadsheets and the office register into the Lovable Cloud database, without losing data, duplicating people, or violating consent.

> **Owner:** Aditya Parmar (Grievance & Data Protection Officer)
> **Status:** Plan ratified, execution pending pilot kickoff (see doc 26).

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
4. **First login** — User must complete `/apply`, which re-confirms consent via checkbox bound to the Privacy Policy version hash.

Opt-in evidence is logged in a private spreadsheet (`migration-consent-log.xlsx`) owned by the Grievance Officer for 7 years (matches DPDP record-keeping practice).

## 5. Seeding mechanics

For opted-in members:

1. Create an `auth.users` row via the admin SDK (`supabase.auth.admin.createUser`) with a temporary password and `email_confirm: false`.
2. Trigger `handle_new_user` auto-creates `profiles` and the `free_member` role.
3. Insert a draft `companies` row with `review_status='pending'`, `is_hidden=true`.
4. Send each member a personalised magic-link email: *"Claim your MDDMA listing"*.
5. On first claim, the user reviews their pre-filled company, edits, submits.
6. Admin approves in `/account/moderation`, which flips `review_status='approved'`, `is_hidden=false`.

No payment is required for legacy members during the founding window (per Membership doc 12). Their role stays `free_member` until they choose to pay.

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
2. `supabase.auth.admin.deleteUser(id)` — cascades through `profiles`, `user_roles`, `companies` (the latter via app-level cleanup, not FK).
3. Re-run the corrected pipeline.

After day 30, users may have created RFQs, posts, brands. Use surgical fixes (admin moderation) instead of deletion to preserve buyer audit trails (per doc 25).

## 8. Sign-off

This plan is executed only after:
- [ ] Privacy Policy (doc 19) published at `/privacy`.
- [ ] Terms (doc 20) published at `/terms`.
- [ ] Grievance contact (Aditya Parmar) live in footer.
- [ ] Committee chair signs the consent-notice text.
