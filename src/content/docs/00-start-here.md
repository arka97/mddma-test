# Start Here

> **v3.3 · Documentation reviewed 17 October 2026.** Current source and selected hosted schema, policies, settings and buckets were checked. This is not a full security audit, legal approval or device-delivery certification.

## What is G-BAU-G?

**G-BAU-G is the business network operated by the Mumbai Dryfruits & Dates Merchants Association (MDDMA), founded in 1930.** Current onboarding welcomes legitimate Indian and overseas businesses across nuts, dry fruits, seeds, dates, spices and allied food trade. Platform business verification, MDDMA Association membership and commercial packaging are separate statuses.

The home page is a community feed, not a marketing page. Browse permitted content, create an individual account to interact, and register an existing business for the commercial actions that require approval. Company verification confirms evidence review; it does not guarantee inventory, quality, fulfilment or creditworthiness.

## The essentials

- **Updates:** price signals, market information, sourcing, polls and notices.
- **Buzz:** humor, gossip and member-news text/images/video, displayed in a vertical media lane.
- **Following:** content from followed people and businesses.
- **Bulletin:** Association circulars inside the feed.
- **Discover:** businesses, categories, New Products, New Members and install promotion at `/discover`.
- **RFQ / quotations / Chat:** buy/sell intent, private range-based responses and company conversations; the legacy multi-item cart is gone.
- **Controlled transparency:** commodity prices are ranges; stock is bands, not exact quantities. A membership fee is not a commodity price.

## Navigation and routes

| Surface | Current destination |
|---|---|
| Home / Discover / Firms | `/`, `/discover`, `/directory` |
| RFQ / quotations / Chat | `/rfq`, `/quotes`, `/messages`, `/messages/:roomId` |
| Opened post | `/market/:postId` (still active) |
| Catalogue / storefront / brands | `/products`, `/products/:slug`, `/store/:slug`, `/brands`, `/brands/:slug` |
| Account / team / businesses / saved | `/dashboard`, `/account/*` including team, companies and bookmarks |
| Help and authority | `/about`, `/faq`, `/knowledge`, `/knowledge/:slug`, `/contact`, `/install` |
| Join / business registration | `/membership`, `/apply` |
| Notifications / docs | `/notifications`, `/documents`, `/documents/:slug` |

Mobile header: account avatar on the left, centred logo, notification bell. Mobile bottom tabs: **Home · Discover · RFQ · Firms · Chat**. Account tools are reached from the avatar/drawer. Header, ad, chips and bottom tabs hide when scrolling down and return when scrolling up; the Post button follows safe-area geometry.

Redirected indexes: `/market`, `/community`, `/circulars` → home; `/broker` → `/directory?type=Broker`; `/directorylist` → directory. There is no `/circulars/:slug`, `/account/rfqs`, `/account/verify` or `/leads` route.

## Access: intent versus checked implementation

Guests can view permitted public feed/discovery content but must sign in before social interaction. The two admin access settings were **ON when checked on 17 October 2026**. They relax paths that consult them, not every rule:

- RFQ listing reads still require authentication.
- RFQ writes and quotations still check verified, approved, visible businesses and appropriate representation.
- `get_company_whatsapp` still explicitly checks Paid/Broker/Admin.
- Private chat/quotes depend on participating business access; admin tools stay admin-only.

This is a documented access inconsistency, **not fixed by this documentation update**. See docs 07/15 for the hosted-policy snapshot. Do not promise that every feature is available merely because both switches are on.

## What is implemented, proposed or unverified?

| State | Capability |
|---|---|
| Implemented | Home feed/channels, social interactions, safe author-name lookup, business/person following, keyboard-aware compose/replies |
| Implemented | Catalogue/business/team pages, RFQ/quotations/deal-room source and hosted entities |
| Implemented | In-app notification history/realtime badge, Web Push infrastructure, PWA install promotion and branded startup |
| Conditional | Native install prompt and push: browser support, HTTPS, subscription, permission and OS settings required |
| Disabled / historical | Membership payment management; `memberships` is absent and client helpers return disabled errors |
| Pending | Counsel-approved public Privacy/Terms/Refund/Grievance routes, commercial packaging, BIL automation, retention job |
| Unverified | Pilot dates/progress/outcome, migration execution, recovery guarantees, device push/sound delivery |

Retained commercial baseline: Free / ₹10,000/year Paid, broker same fee without addon. Current `/membership` and `/apply` are account/business onboarding, **not a paid checkout**. Do not imply purchase of verification. Legal/SLA/refund texts remain drafts or proposed commitments until approved.

## Documentation reading order

29 docs: **7 public-marked (00–06)** and **22 owner-only (07–28)**. The whole `/documents` UI has a shared password gate. Public-marked means client-bundled specification; internal bodies are fetched only after server-side password verification. This is not equivalent to public policy publication.

- **New member:** 00 → 01 → 03 → 04.
- **Committee/office:** 00 → 25 (non-technical guide) → 22 (grievances) → 27 (pilot targets).
- **Developer:** 05 → 07 → 09 → 15 → 16 → 13.
- **Policy reviewer:** 19 → 20 → 21 → 22 → 23 → 26; 24 is an unsigned SOW template.

**Committee never runs SQL (OPS-001).** Unsupported actions are handed to the developer, not invented as UI buttons. Named Grievance & Data Protection Officer: **Aditya Parmar**, grievance@mddma.org. Contact details and any legal statutory interpretations require owner/counsel confirmation before policy publication.

Current project context reports `https://gbaug.lovable.app` as published, with no custom domain attached. Historical mddma.org links are not evidence that the domain or policy routes are live.
