# Data Retention & Deletion Policy


> **v3.2 Update Notice (July 2026)** — This doc has been updated for **v3.2**. Key changes since v3.1.3:
>
> - **RFQ is back**, under a new schema. The `/rfq` route is live, backed by the `rfq_listings` and `rfq_contact_reveals` tables. It is open to paid members and admins; contact reveal is logged. The old `rfqs` / `inquiry_products` / `rfq_responses` tables, the multi-item RFQ cart, `CartContext`, `CartFab` / `CartDrawer` / `RFQModal`, and the `/account/rfqs` inbox all remain **removed**. Any older reference below to those artifacts is historical.
> - **`/market` is now the Community Feed**, not Market News. It uses `community_posts`, `post_comments`, `post_likes`, `post_views`, and `anonymous_identity_log` (admin-only RLS). Paid + admin can post; free members are read-only for the first 7 days; guests see a teaser; anonymous posting is paid-only.
> - **Mobile bottom tab bar** order is now **Home (`/`) · Market (`/market`) · RFQ (`/rfq`) · Members (`/directory`) · Account (`/dashboard`)**.
> - **Admin Feature Access toggle** — while the pilot is running, admins can flip a global switch (`app_settings.features_open_to_all`, exposed via the `is_features_open()` SQL function) that temporarily opens Community Feed posts and RFQ listings to guests and free members. RLS on `community_posts` and `rfq_listings` reads `is_features_open()`; the frontend reads `featuresOpen` / `isEffectivePaid` from `RoleContext`. Managed from **Admin → Moderation → Feature Access**.
>
> The **/forms Verification Request** flow remains **removed** — members are verified during admin onboarding, not via a self-serve form.

---


Reconciles the deliberate snapshotting of buyer details inside `rfqs` (doc 07) with a member's right to erasure under DPDP §12. The rule: **operational audit data is retained for fixed legal periods; identifying personal data is minimised, anonymised or deleted on schedule.**

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
| `rfqs` (incl. snapshotted `buyer_name/email/phone/company`) | **7 years** from creation | Anonymisation at year 7, hard delete at year 10 | Trade audit + Limitation Act §17 |
| `inquiry_products` (RFQ lines) | Same as parent `rfqs` row | Cascaded by app cleanup job | — |
| `rfq_responses` | Same as parent `rfqs` row | Cascaded | — |
| `posts`, `comments` | While account active; on deletion, **author replaced by "Former Member"**, body retained for thread continuity | UPDATE rather than DELETE | Free-speech / thread integrity |
| KYC documents (`kyc-documents` bucket) | Per doc 23 §7 (24 months after revocation; 7-year hard cap) | Cron job + manual review | DPDP §8(7) |
| Razorpay payment references | 8 years | Hard delete after window | Income-Tax §44AA, GST rules |
| `circulars`, `advertisements` | Indefinite (no PII) | — | — |
| Web server / edge function logs | 30 days | Cloud retention default | — |
| Migration consent log | 7 years | Manual delete | DPDP record-keeping |
| Grievance log | 7 years | Manual delete | IT Rules best practice |

## 3. Anonymisation rules

When `rfqs` reach the 7-year mark, the following columns are overwritten:

| Column | Replaced with |
|---|---|
| `buyer_id` | `NULL` (FK is intentionally absent; no integrity issue) |
| `buyer_name` | `"[redacted]"` |
| `buyer_email` | `NULL` |
| `buyer_phone` | `NULL` |
| `buyer_company` | `"[redacted company]"` |
| `message` | `"[redacted]"` |
| `delivery_location` | `NULL` |

The row is **kept** with `product_name`, `quantity`, timestamps, `status` — sufficient for aggregate analytics, insufficient to re-identify the buyer.

At year 10, the row is hard-deleted.

## 4. Forum content on member deletion

When a member is deleted:

- `posts.author_id` and `comments.author_id` are updated to a system "Former Member" sentinel UUID, owned by an internal placeholder account.
- The body is **not** redacted, because partial deletion would corrupt replies. Members are told this upfront in the Terms.
- If the member specifically requests the body be redacted, the Grievance Officer reviews — granted unless redaction would corrupt a thread of public interest (e.g. a regulatory advisory).

## 5. Right to erasure (DPDP §12) — workflow

When a member emails `grievance@mddma.org` requesting erasure:

1. Acknowledge within 24h with ticket ID.
2. Verify identity (reply from the registered email).
3. Within 15 days:
   - Delete `profiles`, `companies`, `products`, `brands`, KYC documents.
   - Cascade-cleanup `product_variants`, gallery images, logo/cover storage objects.
   - Anonymise `posts` and `comments` per §4.
   - **Do not** delete `rfqs` younger than 7 years — explain why in the response, citing this policy.
   - **Do not** delete Razorpay reference IDs younger than 8 years.
4. Send the member a written confirmation listing exactly what was deleted, anonymised, and retained, and why.
5. Log the ticket in `grievance-log.xlsx`.

## 6. Exceptions

Retention may be **extended** beyond the schedule when:
- An active legal dispute, regulatory notice, or law-enforcement preservation request applies — the affected rows enter a **Legal Hold** state (tracked in `legal-hold-register.xlsx`) and are exempt from the deletion cron until the hold is lifted.
- A member has an unresolved financial obligation to MDDMA.

In every case the exception is documented and the affected member is notified unless prohibited by law.

## 7. Cron job (implementation note)

The anonymisation and deletion cron is implemented as a Supabase Edge Function `retention-cron`, scheduled monthly. Until that function is shipped, the Grievance Officer runs the same operations manually via the developer once per quarter.

When the cron ships:
- Logs each row touched to a private `retention-runs` table (no PII, just counts and IDs).
- Sends a monthly summary email to the Grievance Officer.

## 8. Conflict resolution

If a member's right to erasure conflicts with a retention obligation:
- The obligation wins, but only for the **minimum data** required to satisfy it.
- The member receives a clear written explanation.
- Escalation path: Data Protection Board of India (DPDP §28).

This policy is reviewed annually by the Grievance Officer and the Committee Chair.
