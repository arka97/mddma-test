# KYC & Verification Policy

The Platform's single biggest trust claim — a *locked KYC-maximalist* product decision (memory). This doc is the **policy** behind the mechanics already described in docs 12 and 16: what we collect, how we collect it, who can see it, how long we keep it, and how a member is promoted, demoted or rejected.

## 1. Verification tiers (recap)

The `profiles.verification_tier` enum, in ascending trust:

| Tier | What we check | Public badge |
|---|---|---|
| `unverified` | Nothing beyond email | None |
| `email` | Email link confirmation | "Email verified" |
| `company` | Company name + address + at least one document (e.g. utility bill / GST cert) | "Company verified" |
| `gst` | Valid, active GSTIN matched to company name; PAN; for food handlers FSSAI; for importers/exporters IEC | "GST-verified" (gold) |

Each promotion records a timestamp (`email_verified_at`, `company_verified_at`, `gst_verified_at`). Tiers are monotonic by intent but reversible by admin if fraud is found.

## 2. Documents we may request

| Tier sought | Mandatory | Optional |
|---|---|---|
| `email` | One-time email link | — |
| `company` | Company registration certificate **or** utility bill < 3 months old in company name | Logo, cover image |
| `gst` | GSTIN certificate, PAN card, one identity proof of the authorised signatory | FSSAI licence (food), IEC certificate (importer/exporter), ISO certificates |

We do **not** collect Aadhaar. We do not store PAN or GST numbers in unencrypted exports.

## 3. How documents are submitted

KYC uploads use a dedicated private storage bucket (`kyc-documents`, to be provisioned when the in-app KYC flow ships — see doc 16). Path convention: `kyc-documents/<user_id>/<tier>/<document_type>-<timestamp>.<ext>`.

- Max file size: **10 MB** per document.
- Allowed MIME: `image/jpeg`, `image/png`, `application/pdf`.
- SVG is rejected (XSS surface).
- Files are stored **private**; reads require an admin-issued signed URL with a short TTL.

Until that flow ships, KYC documents are accepted out-of-band (email to grievance@mddma.org) and stored on the office NAS under the same retention rules. The Grievance Officer is the sole custodian.

## 4. Who can see KYC documents

| Role | Access |
|---|---|
| The submitting member | Can re-upload but cannot list previously uploaded documents (write-only by design) |
| Admin (Aditya Parmar + designated office staff) | Read via signed URL, audit-logged |
| Other members | **Never** — only the resulting tier badge is public |
| Lovable Cloud staff | Only at-rest encrypted blobs; not browsed |
| Law enforcement | Only on lawful written request (DPDP §17(1)(c)) |

## 5. Promotion procedure

1. Member submits documents.
2. Admin reviews within **5 business days**.
3. If approved:
   - `verification_tier` is updated by the admin (server-side, bypassing the `prevent_profile_privilege_escalation` trigger via the `admin` role check).
   - The relevant `*_verified_at` timestamp is set.
   - Member receives an in-app and email notification.
4. If rejected:
   - Member is told the reason in plain English (e.g. "GSTIN does not match company name on record").
   - Member may re-submit corrected documents.
   - Tier is **not** changed.

## 6. Demotion / revocation

The tier may be **lowered** if:
- The underlying document expires (FSSAI is term-bound; we ask members to re-upload before expiry),
- We discover the document was forged or belongs to a third party,
- The GSTIN becomes inactive per the GSTN portal,
- The member requests demotion / withdraws consent,
- A regulator orders us to.

Demotion is recorded with reason in `grievance-log.xlsx`. The downgraded member is notified within 48 hours.

## 7. Retention

- **Active documents:** kept while tier is held.
- **Revoked / superseded documents:** kept **24 months** for audit, then permanently deleted.
- **Rejected submissions:** kept **90 days**, then permanently deleted.
- Hard cap: **7 years** from upload, after which all KYC documents are deleted regardless, save for those subject to a regulator's hold.

On member account closure: documents are deleted within 90 days unless retention is required to defend against an active claim.

## 8. Brokers

Holding the `is_broker` flag does not require a higher tier than `gst`. However, since brokers transact on behalf of others, we additionally require:
- A signed declaration of broking relationship for each principal they list, on letterhead (PDF upload).
- Disclosure of any past disqualification by APMC or any commodity exchange.

False declaration is a Terms breach (doc 20 §6).

## 9. Member's rights over their KYC data

The member retains all DPDP rights (doc 19 §8). In particular, they may withdraw consent — in which case the tier is revoked and documents enter the deletion queue per §7.

## 10. Annual review

The Grievance Officer performs a sample audit every 12 months:
- Random 10% of `gst`-tier members re-verified against the GSTN portal.
- Any expired documents flagged for renewal.
- Any deviations recorded in `kyc-audit-YYYY.xlsx`.

The audit report is reviewed by the MDDMA committee chair.
