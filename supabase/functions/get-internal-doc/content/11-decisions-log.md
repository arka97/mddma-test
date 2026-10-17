# Decisions Log

> **v3.3 · Documentation reviewed 17 October 2026.** Current source and selected hosted schema, policies, settings and buckets were checked. This is not a full security audit, legal approval or device-delivery certification.


## How to read this log

Permanent IDs preserve business/governance history. Historical architecture may be superseded by shipped source without implying a newly approved commercial contract. Current source and the checked hosted policies are documented in 07/15. This refresh does not change roles, prices or permissions.

## Retained decisions

| ID | Decision | Current qualification |
|---|---|---|
| BIZ-001 | No Lead Packs / pay-per-lead | No /leads route; remains rejected |
| BIZ-002 | Free / single ₹10,000/year Paid baseline; no Silver/Gold/Platinum | Retained helpers/baseline; current account/business pages are not priced checkout; packaging unresolved |
| BIZ-003 | Broker flag, same fee/no addon | Broker capability and legacy role do not grant a paid trust badge; /broker redirects to directory filter |
| TECH-001 | BIL is external API, not edge inference | Proposed architecture; deployed BIL ingest/inference not established |
| TECH-002 | BrowserRouter with managed SPA fallback | Provider/routes source; no custom rewrites file |
| TECH-003 | wa.me only; no WhatsApp Business API | Direct user-initiated links |
| TECH-004 | Membership/payment schema deferred | **Historical status replaced:** hosted membership table absent; current client payment/activation/cancellation are disabled stubs, not a pending runnable checkout |
| UX-001 | Commodity price ranges/stock bands/trends, not exact price/stock | Contact gate is separately implemented; membership fee display is not commodity-price disclosure |
| UX-002 | RFQ mutations require identity | Current hosted RFQ reads are also authenticated; writes require appropriate approved business |
| UX-003 | Multi-item cart/FAB/drawer | **Superseded and removed:** do not restore CartContext/CartFab/CartDrawer/RFQModal or legacy RFQ tables |
| GOV-001 | Buyer reputation over seller rating | Governance direction; automated BIL scoring planned, not a credit guarantee |
| DATA-001 | Live-only discovery | Never merge fixture businesses/products into production reads |
| ROLE-001 | Paid/Broker excludes Free | Protected role-table invariant; separate from company-team roles |
| LEGAL-001 | Public legal pack before Razorpay live | Counsel approval and /privacy /terms /refund /grievance publication still pending |
| LEGAL-002 | Aditya Parmar named Grievance & Data Protection Officer | grievance@mddma.org; historical office contact/hours require confirmation before publishing policies |
| OPS-001 | Committee never runs SQL | Doc 25; unsupported admin tasks go to developer |
| DATA-001b | RFQ audit: anonymise at 7 years, hard-delete at 10 | Legacy snapshot-column instructions are obsolete; map current listings/reveals/quotes/deals with counsel before implementing; no retention-cron |
| PILOT-001 | 8–10 sellers + 8–10 buyers, 90 days | Plan/targets retained; actual dates/progress/outcome unverified |
| GTM-001 | Public authority content and transactional noindex | Design direction retained; current sitemap/prerender parity is known stale and needs separate work |

## Current source evolution (not new commercial approvals)

- Native community feed at **/**; Updates/Buzz lanes and Following/Bulletin chips. /market, /community, /circulars indexes redirect, but /market/:postId remains active.
- One-level display threads (deeper replies flattened), safe author names, reconciled reposts, action order comment/share/like/repost/save, native/copy/WhatsApp share only.
- RFQ listing board plus private **rfq_quotations** and **deal_rooms/deal_messages**, replacing the earlier “contact-only board” description without reviving a cart. Private conversation exists; trade settlement/escrow does not.
- Business registration at /apply, account/business distinction at /membership, business team/switch context; verification does not equal purchased membership or Association affiliation.
- Notifications and Web Push infrastructure; generated /sw.js with imported push handlers, native install where supported and manual iOS installation, installed startup branding.
- White/ink Burgundy & Gold UI; old Ivory/Royal Heritage UI/token tables are historical.
- Private feed/Bulletin media, opaque feed paths, one-hour signing; no hosted KYC bucket.

## Override conflict recorded by this review

Both features_open_to_all and verification_open_to_all were **true on 17 October 2026**. They only affect paths that call their helpers. Hosted RFQ INSERT/quotation INSERT still directly require verified approved visible businesses; RFQ SELECT is authenticated; get_company_whatsapp still checks Paid/Broker/Admin. Therefore “all features open” UI descriptions are not a reliable access specification. Correcting that behavior requires a separate approved implementation request; no policies are changed here.

## Contract/operational authority

The draft SLA percentages/terms in doc 24 and old public milestone splits conflict; no signed contract was verified. Legal citations, refund thresholds, founding promises and retention commitments require counsel/owner approval. Preserve these as drafts, not completed compliance. Do not set past Gantt milestones to done or reuse a pilot decision ID for a new outcome. Record an actual committee outcome with a new entry and dated evidence.
