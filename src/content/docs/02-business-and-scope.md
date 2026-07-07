# Business & Scope


> **v3.2 Update Notice (July 2026)** — This doc has been updated for **v3.2**. Key changes since v3.1.3:
>
> - **RFQ is back**, under a new schema. The `/rfq` route is live, backed by the `rfq_listings` and `rfq_contact_reveals` tables. It is open to paid members and admins; contact reveal is logged. The old `rfqs` / `inquiry_products` / `rfq_responses` tables, the multi-item RFQ cart, `CartContext`, `CartFab` / `CartDrawer` / `RFQModal`, and the `/account/rfqs` inbox all remain **removed**. Any older reference below to those artifacts is historical.
> - **`/market` is now the Community Feed**, not Market News. It uses `community_posts`, `post_comments`, `post_likes`, `post_views`, and `anonymous_identity_log` (admin-only RLS). Paid + admin can post; free members are read-only for the first 7 days; guests see a teaser; anonymous posting is paid-only.
> - **Mobile bottom tab bar** order is now **Home (`/`) · Market (`/market`) · RFQ (`/rfq`) · Members (`/directory`) · Account (`/dashboard`)**.
> - **Admin Feature Access toggle** — while the pilot is running, admins can flip a global switch (`app_settings.features_open_to_all`, exposed via the `is_features_open()` SQL function) that temporarily opens Community Feed posts and RFQ listings to guests and free members. RLS on `community_posts` and `rfq_listings` reads `is_features_open()`; the frontend reads `featuresOpen` / `isEffectivePaid` from `RoleContext`. Managed from **Admin → Moderation → Feature Access**.
>
> The **/forms Verification Request** flow remains **removed** — members are verified during admin onboarding, not via a self-serve form.

---


This document defines **what the platform is for the Association as a business**: strategic goals, monetisation, the engagement scope, and the boundaries we deliberately enforce.

## Strategic goals

1. **Concentrate trust** inside the Association by making "verified MDDMA member" the only badge that matters in the trade.
2. **Protect pricing power** by suppressing exact-price discovery on the public web.
3. **Capture signal** — every directory view, storefront visit, contact-reveal and circular read becomes a data point the Association governs.
4. **Move discovery off WhatsApp** into a searchable, auditable directory + storefront layer, while keeping negotiation itself on `wa.me`.

## Monetisation — one tier, one flag

The earlier multi-tier ladder (Silver / Gold / Platinum) is killed. It created decision fatigue with no revenue lift. The model is now binary plus an optional broker flag — **same price either way**.

```mermaid
flowchart TD
  Visitor((Visitor)) -->|signs up free| Free[Free Member<br/>browse directory<br/>read circulars<br/>post in forum]
  Free -->|pays ₹10,000/yr| Paid[Paid Member<br/>storefront<br/>products + variants<br/>brands<br/>verification badge<br/>full contact reveal]
  Paid -.ticks 'I operate as a broker'.-> Broker[is_broker = true<br/>listed on /broker<br/>SAME ₹10,000 fee]
```

| Tier | Annual fee | What's included |
|---|---|---|
| Free | ₹0 | Browse directory, read circulars, view & post in community forum, read knowledge & market news |
| Paid | ₹10,000 | All Free + public storefront, product catalogue with variants, brand pages, verification badge, full contact reveal |
| Broker | ₹10,000 | A Paid Member with `profiles.is_broker = true`. Listed on `/broker`. **No separate fee** (BIZ-003). |

**Lead Packs are not part of the product** and never will be (BIZ-001). Selling buyer-attention by the unit conflicts with the Association's role as a trust authority.

## Engagement scope (Statement of Work)

```mermaid
gantt
  title MDDMA build & rollout
  dateFormat  YYYY-MM-DD
  section Discovery
  Stakeholder interviews        :done, 2026-01-15, 2w
  Decisions locked              :done, 2026-02-01, 1w
  section Build
  Cloud + auth + RBAC           :done, 2026-02-08, 2w
  Directory + storefront        :done, 2026-02-22, 3w
  Brands + product catalogue    :done, 2026-03-15, 3w
  Admin CMS (circulars, ads, news) :done, 2026-04-05, 2w
  Forum + verification          :done, 2026-04-19, 2w
  v3.1.3 RFQ + /forms removal   :done, 2026-06-01, 1w
  section Pilot & launch
  Pilot · 8–10 two-sided (PILOT-001) :active, 2026-05-03, 12w
  Public launch (committee)     : 2026-06-21, 1w
  section Phase 2
  Behavioral Intelligence Layer : 2026-06-28, 6w
```

### Deliverables

- A production web app at the Association's domain, installable as a PWA.
- Admin CMS for circulars, ads, market news, brands and member moderation.
- Verified-member onboarding flow with KYC document upload, reviewed by an admin.
- Member directory, seller storefronts (`/store/:slug`), brand pages (`/brands/:slug`) and a cross-member product catalogue.
- Native community forum (posts + comments, now a read-only archive) + Discourse-embedded live forum.
- Forms surface (Advertise enquiry + Submit Circular) at `/forms` and `/contact`.
- Documentation suite — **29 docs as of June 2026** (7 public 00–06 + 22 internal 07–28), versioned in source control. The pack 18–28 covers the legal, policy and operator essentials below.

### Legal, policy & operator pack (shipped May 2026)

| # | Doc | Why it exists |
|---|---|---|
| 18 | Member Data Audit & Migration | 350+ legacy members move in with consent and dedupe |
| 19 | Privacy Policy | DPDP Act 2023 + IT Rules 2021 compliance |
| 20 | Terms of Service | Account, listing, payment, liability terms |
| 21 | Refund & Cancellation | Required by Razorpay; cooling-off + pro-rata rules |
| 22 | Grievance & Redressal | Named officer + IT Rules timelines |
| 23 | KYC & Verification Policy | The "what / how long / who can see" behind the tier ladder |
| 24 | SOW & Maintenance SLA | Build + maintenance scope, severity SLAs, IP |
| 25 | Committee Operator Guide | Zero-SQL guide for office staff |
| 26 | Data Retention & Deletion | Anonymisation + erasure workflow |
| 27 | Pilot Plan & Success Criteria | 90-day cohort, must-hit metrics, decision rule |
| 28 | GTM & Onboarding Playbook | Pattern D execution, anchor scripts, founding window |

### Milestones & payments

| # | Milestone | Trigger | Share |
|---|---|---|---|
| M1 | Cloud + auth + role simulator live | Demo accepted | 25% |
| M2 | Directory + storefronts + brands + catalogue | Pilot kickoff | 35% |
| M3 | CMS + forum + verification | Public launch | 25% |
| M4 | BIL phase-2 contract & first signal endpoint | Signed off by committee | 15% |
| M5 | Legal & operator doc pack (18–28) | Counsel review + committee sign-off | included in maintenance |

### Ways of working

- Source of truth: this `/documents` suite, versioned in git.
- Decisions are recorded directly in the relevant doc — no parallel "change log" overlay.
- Weekly written update during build; bi-weekly committee review during pilot.
- All credentials and infrastructure under the Association's account.

## What's **out of scope**

| Out of scope | Why |
|---|---|
| Public price comparison | Violates controlled-transparency thesis |
| In-app RFQ / negotiation engine | Removed v3.1.3 — WhatsApp deeplink is the negotiation surface |
| WhatsApp Business API | Cost + compliance overhead; `wa.me` deeplinks suffice |
| Lead Packs / pay-per-lead | Conflicts with membership trust model |
| Multi-tier paid plans | Decision fatigue; no observed revenue lift |
| Native mobile apps | PWA install covers the use case |
| In-platform escrow / payments between members | Trade settlement stays bank-to-bank |

## Read next

- **03 · Product & UX** — who the users are and how they experience this.
- **06 · Build & Operations** — how we ship and maintain it.
