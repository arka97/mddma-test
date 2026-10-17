# Roadmap & Glossary

> **v3.3 · Documentation reviewed 17 October 2026.** Current source and selected hosted schema, policies, settings and buckets were checked. This is not a full security audit, legal approval or device-delivery certification.

## Status-first roadmap

Calendar dates in earlier versions were proposals, not evidence of completed work. As of this review, pilot week/start/end and committee outcome are **unverified**. Do not carry forward “Week 3 of 12” from May into October.

| State | Capability / gate |
|---|---|
| Implemented in source | Feed as home, Updates/Buzz/Following/Bulletin chips, replies/reposts/simplified share, profile enrichment |
| Implemented in source | Unified mobile chrome/FAB geometry, keyboard-aware compose/replies, PWA installation promotion/splash |
| Source + hosted entities checked | RFQ listings/quotations, private deal rooms, team/business context, notification tables and private media |
| Needs end-to-end evidence | Cross-device push/sound delivery, restored business review workflow, full permissions/override consistency |
| Pending legal/committee approval | Public legal pack, binding SLA/refund terms, commercial packaging |
| Not runnable today | Membership payment/activation flow; hosted membership table absent |
| Planned | External BIL computation and automated buyer reputation, retention/anonymisation job |
| Owner confirmation required | Pilot progress/outcome, migration execution, founding-window availability, production domain and recovery guarantees |

## Next sequence (not delivery dates)

1. Reconcile open-feature/verification switch copy with actual RFQ/quote/contact policies.
2. Validate business review and representative access through real sessions.
3. Obtain counsel/committee sign-off and promote legal pages.
4. Restore/test payment integration only against approved commercial terms.
5. Run push/device/recovery/security drills and the two-sided pilot review.
6. Scope external BIL and retention automation with measurable contracts.

The pilot target remains **8–10 seller anchors + 8–10 buyer anchors for 90 days** (PILOT-001). Doc 27 defines targets, not achieved results. No paid acquisition during pilot; approved public authority content supports warm-intro credibility (GTM-001).

## BIL proposal — not a deployed API

BIL is a future external HTTPS service (TECH-001), not edge inference. Proposed endpoints:

```text
GET /signals/products?ids=...
GET /signals/companies?ids=...
POST /signals/events
GET /signals/buyer/:id
```

Proposed signal fields: product ID, demand_score, trend_direction, stock_band, rank_in_category, computed_at. Proposed cache/performance goals from the earlier spec: product/company signals 60s cache and p95 <200ms; event ack <100ms; buyer breakdown 5min cache and p95 <300ms. These are **design targets**, not a current SLA. Current repositories render stored market/product signals; no verified external BIL ingest is established. Authenticate user-scoped reads; keep ingest secrets server-side and minimise event identity.

## Rejected/retired

Lead Packs, Silver/Gold/Platinum, separate broker addon, exact-price comparison, anonymous RFQ mutations, WhatsApp Business API, native mobile builds, in-platform escrow, and roles in editable profiles remain rejected. The legacy multi-item RFQ cart/inbox is removed; new listing/quotation/deal-room features do not revive that cart.

## Glossary

| Term | Meaning |
|---|---|
| G-BAU-G | App/network operated by MDDMA |
| MDDMA | Mumbai Dryfruits & Dates Merchants Association; affiliation separate from business verification |
| Lot / grade / origin | Shipment batch / quality classification / growing or processing location |
| Mamra / Sanora | Trade almond-grade terminology |
| APMC / mandi | Regulated market committee/complex / physical wholesale market |
| MOQ | Minimum order quantity |
| GSTIN / FSSAI / IEC | Indian tax registration / food-business licence / import-export identifier |
| Controlled transparency | Commodity price ranges, stock bands and trends, not exact price/stock exposure |
| Updates / Buzz | Informational list feed / humor, gossip and member-news media lane |
| Following | Posts selected from followed people and businesses |
| Bulletin | Association circulars integrated into feed; `/circulars` redirects |
| RFQ | Buy/sell intent listing with expiry; authenticated network read and business-gated writes |
| Quotation | Private indicative/formal response with range terms, validity and status |
| Deal room | Private company conversation, possibly linked to RFQ/quote/product |
| Team role | owner/admin/editor/viewer within a company; not a platform RBAC role |
| Verified business | Evidence-reviewed business identity, not solvency/quality guarantee |
| Paid/Broker | Legacy platform roles; broker has no separate fee |
| Founding lock/window | Historical proposed commercial promises; not an implemented current subscription |
| PWA | Installable web app; platform-dependent install/push behavior |
| FAB | Floating Post action, safe-area-positioned |
| RLS / RPC | Database row-access policy / callable database function |
| VAPID / Web Push | Application-server signing / browser push delivery |
| BIL | Planned external Behavioral Intelligence Layer |
| Pattern D | Bhuta/committee warm-intro acquisition |
| Legal hold | Documented exception to a retention/deletion schedule |

The LiveTicker, old Market News, standalone Humor and Discourse surfaces are retired. Legacy files/tables may remain without being active routes. See doc 09 for current paths and doc 26 for retention uncertainties.
