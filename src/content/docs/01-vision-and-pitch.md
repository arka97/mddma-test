# Vision & Pitch

> **v3.2 · Last verified July 2026** against the live app shell, database and routes.

> **Thesis.** G-BAU-G does not expose the dry-fruits and dates market — it **structures and controls** it. The platform is a Behavioral Trade Operating System for the Mumbai Dryfruits & Dates Merchants Association: a verified directory, a controlled-transparency catalogue, seller storefronts and brands, a community feed and RFQ board that keep member intent on-platform, and a published authority layer (knowledge, bulletin, FAQ, contact) designed to keep pricing power inside the association.

> **Where this doc sits.** This is doc **01 of 29** — the start of the canonical reading order. Public spec runs **00 → 06**; owner-only deep reference runs **07 → 28**. Read in order on first pass; later, jump by topic. Authoritative invariants live in **11 · Decisions Log** — when narratives in earlier docs conflict with a decision entry, the decision entry wins.

## The problem

Mumbai's dry-fruits and dates trade runs on phone calls, WhatsApp screenshots, and broker memory. Three things are broken:

1. **Price leakage.** Public marketplaces broadcast exact prices and stock, eroding member margins and exposing the trade to price-shoppers.
2. **Trust asymmetry.** Buyers cannot tell a verified Association member from a stranger; sellers waste time on unqualified enquiries.
3. **Fragmented signals.** Demand spikes, festival cycles, port arrivals, and rate movements live in private chats — not in any single source the Association can govern.

## The solution — Controlled Transparency

G-BAU-G shows enough to enable trade, hides enough to preserve margin, and gates the rest behind verified membership.

```mermaid
sequenceDiagram
    participant B as Buyer
    participant P as G-BAU-G Platform
    participant S as Verified Seller
    B->>P: Browse a product, storefront or RFQ
    P-->>B: Range price + stock band (High/Med/Low) + demand trend
    B->>P: Tap "Contact seller" (login required)
    P-->>B: Reveals phone / wa.me deeplink (logged)
    B->>S: Direct WhatsApp / call (off-platform)
    Note over P: Exact price & exact stock<br/>never leave the platform
```

The platform never renders exact prices or exact stock to anyone. Buyers see ranges and bands; sellers see verified contact requests; the Association sees the full directory, catalogue and content flow. Negotiations happen off-platform via `wa.me` deeplinks, and each reveal is logged (RFQ reveals in `rfq_contact_reveals`, storefront reveals in the storefront event log).

## The four member-facing surfaces

1. **Directory & Storefronts** — verified profiles, brand pages, product catalogue with variants. The public trust layer.
2. **Community Feed (`/market`)** — the day-to-day posting surface. Text, images (with clipboard paste), PDFs, polls, price ranges, oEmbed link previews, anonymous mode (audit-logged), pinned rate cards. Replaces the "market news" chat firehose.
3. **RFQ board (`/rfq`)** — structured buy/sell intent with 1–90 day expiry and one-tap contact reveal. Complements — does not replace — the wa.me negotiation.
4. **Authority layer** — `/`, `/about`, `/membership`, `/circulars` (Bulletin), `/knowledge` + `/knowledge/:slug`, `/faq` (with FAQPage JSON-LD), `/contact`. Prerendered, AI-crawler-friendly, cited by search when members are Googled.

## Lean canvas

```mermaid
flowchart LR
  subgraph Problem
    P1[Price leakage]
    P2[Unverified buyers]
    P3[Signals trapped in chats]
  end
  subgraph Solution
    S1[Verified directory]
    S2[Controlled-transparency catalogue]
    S3[Storefronts + brands]
    S4[Community Feed + RFQ board]
    S5[Authority layer — knowledge, FAQ, bulletin]
    S6[Behavioral Intelligence Layer]
  end
  subgraph Channels
    C1[Association onboarding]
    C2[wa.me deeplinks]
    C3[Bulletin + community feed]
  end
  subgraph Revenue
    R1[Free tier ₹0]
    R2[Paid member ₹10,000/yr]
    R3[Broker = is_broker flag · same fee, no addon]
  end
  Problem --> Solution --> Channels --> Revenue
```

| Block | Content |
|---|---|
| **Customer segments** | Verified Association members; institutional buyers; brokers |
| **Unfair advantage** | Association-controlled trust + behavioral signal layer no public marketplace can replicate |
| **Key metrics** | Verified members, contact reveals/month, storefront views, RFQ fill rate, bulletin reach, buyer-reputation distribution |
| **Cost structure** | Lovable Cloud, BIL API compute, light human moderation |

## ROI for the committee

A single typical lot saved from price-shopping recovers more than the annual paid-member fee. Break-even target: **40 paid members in year one** covers all platform costs and funds the BIL roadmap.

| Year | Paid members (incl. brokers) | Annual revenue at ₹10K/yr |
|---|---|---|
| 1 | 40 | ₹4.0 lakh |
| 2 | 120 | ₹12.0 lakh |
| 3 | 250 | ₹25.0 lakh |

Brokers are not a separate SKU — `profiles.is_broker = true` flips a flag on the same Paid membership and filters into `/directory?type=Broker` (the legacy `/broker` route redirects there). See decision **BIZ-003** in doc 11.

## What we are explicitly **not** building

- A public, price-comparison marketplace.
- A multi-item in-app RFQ cart / negotiation engine (the v3.2 RFQ board is single-listing intent, not a shopping cart — RFQ-001).
- A WhatsApp Business API integration (`wa.me` deeplinks only).
- Lead Packs or pay-per-lead monetisation (rejected — undermines membership value).
- Tiered Silver / Gold / Platinum plans (collapsed into one Paid tier).
- Native mobile apps (PWA install covers the use case).

These omissions are not gaps; they are the design.

> **Suite scope:** documentation runs to **29 docs** — 7 public (00–06, including the Start Here orientation) and 22 internal (07–28). The pack 18–28 covers the legal, operator, and pilot policies — Privacy, Terms, Refund, Grievance, KYC, SOW & SLA, Committee Guide, Retention, Pilot Plan, GTM playbook, and the Member-Data Migration plan.

## Read next

- **02 · Business & Scope** — what we sell and what's in the contract.
- **03 · Product & UX** — how members experience the platform.
- **19 · Privacy Policy** & **27 · Pilot Plan** — the operator-facing essentials.
