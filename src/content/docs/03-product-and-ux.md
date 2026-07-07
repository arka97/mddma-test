# Product & UX


> **v3.2 Update Notice (July 2026)** — This doc has been updated for **v3.2**. Key changes since v3.1.3:
>
> - **RFQ is back**, under a new schema. The `/rfq` route is live, backed by the `rfq_listings` and `rfq_contact_reveals` tables. It is open to paid members and admins; contact reveal is logged. The old `rfqs` / `inquiry_products` / `rfq_responses` tables, the multi-item RFQ cart, `CartContext`, `CartFab` / `CartDrawer` / `RFQModal`, and the `/account/rfqs` inbox all remain **removed**. Any older reference below to those artifacts is historical.
> - **`/market` is now the Community Feed**, not Market News. It uses `community_posts`, `post_comments`, `post_likes`, `post_views`, and `anonymous_identity_log` (admin-only RLS). Paid + admin can post; free members are read-only for the first 7 days; guests see a teaser; anonymous posting is paid-only.
> - **Mobile bottom tab bar** order is now **Home (`/`) · Market (`/market`) · RFQ (`/rfq`) · Members (`/directory`) · Account (`/dashboard`)**.
> - **Admin Feature Access toggle** — while the pilot is running, admins can flip a global switch (`app_settings.features_open_to_all`, exposed via the `is_features_open()` SQL function) that temporarily opens Community Feed posts and RFQ listings to guests and free members. RLS on `community_posts` and `rfq_listings` reads `is_features_open()`; the frontend reads `featuresOpen` / `isEffectivePaid` from `RoleContext`. Managed from **Admin → Moderation → Feature Access**.
>
> The **/forms Verification Request** flow remains **removed** — members are verified during admin onboarding, not via a self-serve form.

---


How real members experience MDDMA — personas, what each role can see, the controlled-transparency rules that govern every screen, and how a buyer moves from discovery to contact.

## Personas

| Persona | Role enum | Primary goal |
|---|---|---|
| **Trader Buyer** | `paid_member` | Source verified supply at fair ranges; negotiate via WhatsApp |
| **Trader Seller** | `paid_member` | Get discovered in directory, storefront and brand pages; protect price discovery |
| **Broker** | `broker` (paid + `is_broker`) | Match supply and demand across members |
| **Visitor / Free member** | `free_member` | Establish trust before paying; browse circulars and directory |
| **Association admin** | `admin` | Verify members, publish circulars and market news, moderate forum, manage ads |

A header **role simulator** lets the committee experience the site as any role during demos and reviews.

## Home shell

The home page (`/`) stacks: Homepage banner ad → Today header → Live Rates Ticker → Quick Actions → Category Grid → **New Products** (recent listings) → **New Members** → Membership CTA → Partners Strip. The bottom mobile tab bar order is **Today · Brands · Circulars · Members · Account**, where Account opens `/dashboard`.

## Role-based access

```mermaid
flowchart TD
  G[Guest] -->|signup| F[Free member]
  F -->|pays ₹10K| P[Paid member]
  P -->|is_broker flag, same fee| B[Broker]
  P -->|appointed by Association| A[Admin]

  G -.can see.-> Public[Directory list, Circulars, Forum read, Knowledge, Market News]
  F -.+can.-> FreeAdds[Forum post, Apply for paid membership]
  P -.+can.-> PaidAdds[Storefront, Products, Variants, Brands, Full contact reveal, Account hub]
  B -.+can.-> BrokerAdds[Broker board listing]
  A -.+can.-> AdminAdds[CMS: circulars, ads, market news, members, moderation]
```

| Capability | Guest | Free | Paid | Broker | Admin |
|---|:-:|:-:|:-:|:-:|:-:|
| Browse directory | ✓ | ✓ | ✓ | ✓ | ✓ |
| See full member contact / wa.me reveal | — | — | ✓ | ✓ | ✓ |
| Read forum / knowledge / market news | ✓ | ✓ | ✓ | ✓ | ✓ |
| Post in forum | — | ✓ | ✓ | ✓ | ✓ |
| Storefront + products + brands | — | — | ✓ | ✓ | ✓ |
| Listed on Broker board | — | — | — | ✓ | — |
| Publish circulars / ads / market news | — | — | — | — | ✓ |
| Verify members | — | — | — | — | ✓ |

## The controlled-transparency rules

These rules are non-negotiable and enforced in components, not policy:

1. **Never render an exact price.** Use a range (₹X–₹Y per kg) computed from the seller's input.
2. **Never render an exact stock figure.** Use bands: **High**, **Medium**, **Low**.
3. **Always render a demand trend** (rising / steady / cooling) instead of raw search counts.
4. **No public price comparison view.** Search and filter never sort by exact price.
5. **Contact details are gated.** Phone / WhatsApp deeplink reveal requires Paid status.

The `<GuardedPrice>` and stock-band components are the single point of enforcement — UI cannot accidentally leak raw values.

## Discovery → Contact flow

Negotiations happen off-platform. The journey ends in a `wa.me` deeplink or a revealed phone number — there is no in-app RFQ, cart, or inbox (RFQ-001 removed v3.1.3).

```mermaid
stateDiagram-v2
  [*] --> Browse: Buyer lands on home / directory / products / brands
  Browse --> Detail: Open storefront, product or brand page
  Detail --> Gate: Tap "Contact seller"
  Gate --> Reveal: Authenticated as Paid member
  Gate --> Upgrade: Free / guest -> /membership
  Reveal --> Off: Opens wa.me / tel: link
  Off --> [*]
```

## Buyer reputation, not seller reputation

Public marketplaces rate sellers and let buyers hide. MDDMA inverts this:

- **Buyers will carry a reputation score** (planned, GOV-001) visible to sellers reviewing inbound enquiries.
- Sellers' reputations are implicit in their verified-member status — that's what the Association badge means.
- This shifts power back to suppliers and discourages price-shoppers.

## Verification & badges

A **Verified** badge appears next to a member when KYC documents (GST, business registration, identity) have been reviewed and approved by an admin via `/account/moderation`. Verification is a one-time gate, not a recurring re-check, and the badge is the single visual proof of trust on the platform. The **/forms Verification Request** flow has been removed (v3.1.3) — members are verified during admin onboarding, not via a self-serve form. The full policy lives in **doc 23 (KYC & Verification Policy)**.

## Member-facing policies

Privacy Policy (doc 19), Terms of Service (doc 20), Refund & Cancellation (doc 21) and the Grievance & Redressal mechanism (doc 22) are first-class member-facing documents. **Aditya Parmar** is the named Grievance & Data Protection Officer; their contact appears on the relevant pages and in the footer once the policies are promoted to public routes.

## Read next

- **04 · Functional Spec** — module-by-module specification.
- **05 · Architecture & Tech** — how these rules are enforced in code.
