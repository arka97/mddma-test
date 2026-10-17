# Data Retention & Deletion Policy

> **v3.3 · Documentation reviewed 17 October 2026.** Current source and selected hosted schema, policies, settings and buckets were checked. This is not a full security audit, legal approval or device-delivery certification.


Draft schedule for current identity/social/commercial data and a member's right to erasure. The legacy RFQ snapshot schema is removed; current-table mapping, legal bases and all cited timelines need counsel/developer review before implementation. The rule: **operational audit data is retained for fixed legal periods; identifying personal data is minimised, anonymised or deleted on schedule.**

## 1. Why we retain anything at all

- **Trade dispute defence** — a buyer or seller may claim a quote, RFQ or commitment that we need to reconstruct.
- **Tax and accounting** — Income-Tax Act §44AA, GST rules: payment records kept 8 years.
- **Anti-fraud** — repeat offenders are detected by historical patterns.
- **Regulator response** — DPDP, IT Rules, and GST notices may require historical lookups.

Retention is a **specified purpose** under DPDP §6 and is disclosed in the Privacy Policy.

## 2. Retention schedule

| Data | Retention | Deletion mechanism | Source of obligation |
|---|---|---|---|
| Active `profiles` row | While account active + 90 days post-deletion request | Hard delete via admin SDK | DPDP §8(7) |
| `companies` row | Same as profile | Hard delete | DPDP §8(7) |
| `products`, `product_variants`, `brands` | Same as parent company | Hard delete | — |
| Current RFQ audit (`rfq_listings`, `rfq_contact_reveals`, `rfq_quotations`) | Historical draft baseline: **7 years** | Proposed anonymisation at year 7, hard delete at year 10; map actual schema/legal holds first | Counsel must validate current scope/basis |
| `deal_rooms`, `deal_messages` | **Not yet approved** | Define trade/private-conversation schedule and identity/body handling with counsel | Do not silently inherit indefinite or RFQ retention |
| `community_posts`, `post_comments` and legacy posts/comments | Draft: while account active; review anonymisation/redaction on closure | No verified sentinel/automatic cleanup implementation; review media/body re-identification too | Final basis/rights review pending |
| Likes/views/reposts/bookmarks/poll votes/follows | **Schedule not yet approved** | Define minimisation/deletion across person/company relationships | Include in erasure inventory |
| Notifications/preferences/push subscriptions | **Schedule not yet approved** | Revoke/delete device subscriptions and personal delivery state on approved closure | No retention guarantee inferred |
| Anonymous identity audit | **Schedule/hold rules unresolved** | Admin-only; reconcile prior permanent-log wording with minimisation/legal requirements | Counsel/committee decision required |
| KYC evidence (proposed private workflow) | Draft doc 23: revoked/superseded 24 months, rejected 90 days, seven-year cap | No hosted KYC bucket/job; secure custody and deletion verification required | Resolve conflict with doc 19 before publication |
| Razorpay payment references | 8 years | Hard delete after window | Income-Tax §44AA, GST rules |
| `circulars`, `advertisements` | Indefinite (no PII) | — | — |
| Web server / edge function logs | Proposed 30 days | Hosted provider retention not verified; confirm configured period | — |
| Migration consent log | 7 years | Manual delete | DPDP record-keeping |
| Grievance log | 7 years | Manual delete | IT Rules best practice |

## 3. Historical RFQ anonymisation mapping — do not execute

The removed `rfqs` schema used the following snapshot fields. This is historical context only; these columns are **not** a valid cleanup recipe for current RFQ tables. Preserve the seven/ten-year proposed baseline, but obtain current-schema mapping and counsel approval before any job:

| Column | Replaced with |
|---|---|
| `buyer_id` | `NULL` (FK is intentionally absent; no integrity issue) |
| `buyer_name` | `"[redacted]"` |
| `buyer_email` | `NULL` |
| `buyer_phone` | `NULL` |
| `buyer_company` | `"[redacted company]"` |
| `message` | `"[redacted]"` |
| `delivery_location` | `NULL` |

The historical intention was aggregate analytics without identity. Do not assume stripping IDs anonymises free-text notes, delivery details, quotation terms or private messages; review residual re-identification.

At year 10, the row is hard-deleted.

## 4. Forum content on member deletion

When a member is deleted:

- Proposed author anonymisation must cover current community posts/comments and legacy content; no verified Former Member sentinel account or automated rewrite exists. Review constraints before any change.
- The body is **not** redacted, because partial deletion would corrupt replies. Members are told this upfront in the Terms.
- If the member specifically requests the body be redacted, the Grievance Officer reviews — granted unless redaction would corrupt a thread of public interest (e.g. a regulatory advisory).

## 5. Right to erasure (DPDP §12) — workflow

When a member emails `grievance@mddma.org` requesting erasure:

1. Acknowledge within 24h with ticket ID.
2. Verify identity (reply from the registered email).
3. Within 15 days:
   - Delete `profiles`, `companies`, `products`, `brands`, KYC documents.
   - Cascade-cleanup `product_variants`, gallery images, logo/cover storage objects.
   - Review current posts/comments/media, follows, interaction history, notification/push state and private trade data for approved deletion/anonymisation.
   - Retain only data supported by an approved obligation/legal hold. The old “do not delete rfqs” command is not valid against removed tables; current mapping and lawful scope must be resolved.
   - **Do not** delete Razorpay reference IDs younger than 8 years.
4. Send the member a written confirmation listing exactly what was deleted, anonymised, and retained, and why.
5. Log the ticket in `grievance-log.xlsx`.

## 6. Exceptions

Retention may be **extended** beyond the schedule when:
- An active legal dispute, regulatory notice, or law-enforcement preservation request applies — the affected rows enter a **Legal Hold** state (tracked in `legal-hold-register.xlsx`) and are exempt from the deletion cron until the hold is lifted.
- A member has an unresolved financial obligation to MDDMA.

In every case the exception is documented and the affected member is notified unless prohibited by law.

## 7. Cron job (implementation note)

**Not implemented:** no retention-cron function/job is present in current source. A monthly job and officer-coordinated quarterly manual review are proposals, not verified scheduled operations. Committee staff never run SQL; any interim action is approved and performed by the developer with deletion/read-back evidence.

When the cron ships:
- Logs each row touched to a private `retention-runs` table (no PII, just counts and IDs).
- Sends a monthly summary email to the Grievance Officer.

## 8. Conflict resolution

If a member's right to erasure conflicts with a retention obligation:
- The obligation wins, but only for the **minimum data** required to satisfy it.
- The member receives a clear written explanation.
- Escalation path: Data Protection Board of India (DPDP §28).

This policy is reviewed annually by the Grievance Officer and the Committee Chair.

## Approval and implementation gaps

This is a draft, not proof of compliant automated erasure. Doc 19’s 90-day closure language conflicts with this workflow’s 15-day action target; KYC revocation retention also differs. Preserve existing draft numbers but resolve these contradictions explicitly with counsel before publication. Payment-record retention does not mean current payments exist. Include current media objects, business representatives, quotations/messages, push keys, audit/legal holds and provider backups in the final inventory. A database row delete alone does not prove blob/backup erasure; no schedule was invented for new data classes.
