# Refund & Cancellation Policy


> **v3.2 Update Notice (July 2026)** — This doc has been updated for **v3.2**. Key changes since v3.1.3:
>
> - **RFQ is back**, under a new schema. The `/rfq` route is live, backed by the `rfq_listings` and `rfq_contact_reveals` tables. It is open to paid members and admins; contact reveal is logged. The old `rfqs` / `inquiry_products` / `rfq_responses` tables, the multi-item RFQ cart, `CartContext`, `CartFab` / `CartDrawer` / `RFQModal`, and the `/account/rfqs` inbox all remain **removed**. Any older reference below to those artifacts is historical.
> - **`/market` is now the Community Feed**, not Market News. It uses `community_posts`, `post_comments`, `post_likes`, `post_views`, and `anonymous_identity_log` (admin-only RLS). Paid + admin can post; free members are read-only for the first 7 days; guests see a teaser; anonymous posting is paid-only.
> - **Mobile bottom tab bar** order is now **Home (`/`) · Market (`/market`) · RFQ (`/rfq`) · Members (`/directory`) · Account (`/dashboard`)**.
> - **Admin Feature Access toggle** — while the pilot is running, admins can flip a global switch (`app_settings.features_open_to_all`, exposed via the `is_features_open()` SQL function) that temporarily opens Community Feed posts and RFQ listings to guests and free members. RLS on `community_posts` and `rfq_listings` reads `is_features_open()`; the frontend reads `featuresOpen` / `isEffectivePaid` from `RoleContext`. Managed from **Admin → Moderation → Feature Access**.
>
> The **/forms Verification Request** flow remains **removed** — members are verified during admin onboarding, not via a self-serve form.

---


**Effective date:** to be set on publication.
**Applies to:** MDDMA Paid Membership (₹10,000 per year, inclusive of the broker flag where applicable).
**Required by:** Razorpay merchant onboarding; DPDP; consumer law.

> **Draft notice.** First draft pending counsel review.

## 1. What you are paying for

The MDDMA Paid Membership grants the holder:

- A verified storefront on the directory,
- Ability to list products, variants and brands,
- Receipt of and response to RFQs from buyers,
- Forum posting privileges,
- Access to market signals and the live ticker,
- The trust badges they qualify for under doc 23 (KYC Policy).

The subscription term is **12 months** from the date of activation (the date the Razorpay payment is captured and `paid_member` role is granted).

## 2. Founding-member window

The first 90 days of the Platform's life are a **founding window**. Members who pay during this window enjoy a price lock for an extended period defined on `/membership` at the time of payment. After the founding window closes, list price applies. The founding lock, once granted, is honoured.

## 3. Cooling-off period (7 days)

A first-time Paid Member may request a **full refund within 7 calendar days** of payment, no questions asked, provided that during those 7 days they have:

- Not received more than **5 RFQs**, and
- Not submitted more than **5 RFQs**, and
- Not had any KYC document approved at `gst` tier.

If any of those thresholds were crossed, the refund is at our discretion (see §4).

## 4. Pro-rata refund (after cooling-off)

After day 7 but within the 12-month term, members may cancel at any time. Refunds in this window are **discretionary** and considered case-by-case, typically on the following basis:

- We compute `months_remaining = ceil((expires_at - today) / 30)`.
- A goodwill refund of up to `(months_remaining / 12) × paid_amount − ₹2,000 admin fee` may be issued.
- Refunds will not be issued where the account is being closed for breach of the Terms.

## 5. Non-refundable circumstances

We will **not** refund where:
- The account is suspended or terminated for breach of the Terms (doc 20 §15),
- KYC documents submitted are found to be forged or third-party,
- The member used the Platform to spam, scrape or harass,
- More than 11 months of the term have elapsed.

## 6. How to request a refund

Email **grievance@mddma.org** with:
- Subject: `Refund request — <full name> — <registered email>`
- Date of payment and Razorpay payment / order reference ID
- Reason (cooling-off / cancellation / breach claim)

The Grievance Officer (Aditya Parmar) will acknowledge within 24 hours and decide within 15 days. Approved refunds are processed via Razorpay to the **original payment instrument**. Bank settlement typically completes in 5–7 business days after we issue the refund.

## 7. Cancellation mechanics (server-side)

When a refund is approved:
1. Admin marks the refund in Razorpay dashboard.
2. Admin runs `SELECT downgrade_to_free('<user_id>');` per doc 17.
3. The user retains read-only access to their account; listings are hidden; RFQ history is preserved for 7 years per doc 25.

The user may re-subscribe at the then-current list price; founding-lock pricing does **not** carry over after a refund.

## 8. Service interruptions

If the Platform is unavailable for **more than 72 continuous hours** in a calendar month due to faults under our control (excluding force majeure, third-party outages, scheduled maintenance announced ≥ 48 hours in advance), we will, on written request, credit the affected month pro-rata against the next renewal.

## 9. Chargebacks

If you initiate a chargeback through your card issuer, we will:
- Suspend the account pending resolution,
- Submit evidence (payment reference, usage logs, this policy) to Razorpay,
- Reserve the right to recover costs and ban future accounts associated with the same identity if the chargeback is found to be wrongful.

## 10. Contact

- **Grievance & Refund queries:** Aditya Parmar — grievance@mddma.org
- **Billing queries:** info@mddma.org
- **Postal address:** c/o MDDMA Office, Sector 19, APMC Market, Vashi, Navi Mumbai 400705
