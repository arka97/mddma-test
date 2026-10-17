# Product & UX

> **v3.3 · Documentation reviewed 17 October 2026.** Current source and selected hosted schema, policies, settings and buckets were checked. This is not a full security audit, legal approval or device-delivery certification.

## People and identities

G-BAU-G serves individual readers, verified Indian/overseas food-trade businesses, buyers/sellers, brokers/agents, authorised business representatives and Association administrators. Business verification confirms reviewed evidence; MDDMA affiliation and legacy Paid/Broker roles are separate.

## Navigation

Mobile: **avatar/drawer · centred logo · bell**; bottom tabs **Home · Discover · RFQ · Firms · Chat**. Account/profile/business/team/saved tools are in the drawer/dashboard, not a fifth Account bottom tab. Desktop uses its current header/feed navigation.

`/` is the feed; `/discover` is the former home-discovery surface. `/market`, `/community`, `/circulars` indexes redirect to the feed, but **`/market/:postId` remains the opened-post route**. No circular detail route is shipped.

## Feed experience

Circular dashed-ring icon chips include Updates, Buzz, Following, Bulletin and Price Signals. Horizontal gestures change chips in order; Updates is a list, Buzz a vertical snap-scroll media lane. Older Updates receive an older-than-a-week divider and dimming, not a seven-day Free-member read expiry.

Header/ad/chips/bottom navigation hide on scroll-down and return on scroll-up. Floating Post clears the tab bar and iOS home indicator using shared geometry: safe inset + 70px with the 54px bar visible, safe inset + 16px hidden. Hidden chrome should not intercept content taps.

## Posting, replies and actions

- Destination switch: **Update / Buzz**; clear posting context and visible cursor/input.
- Text, up to four feed images, clipboard paste, PDF, video, poll, range signal and link preview.
- Keyboard-aware compose/reply sheet using visual viewport; 16px inputs reduce iOS focus zoom.
- Anonymous mode includes an admin-audit explanation; ordinary readers must not receive real author identity.
- Equal-width action order: **comment · share · like · repost · save**. View statistics appear only after opening a post.
- Share: native menu, copy link, WhatsApp; no X/LinkedIn menu items.
- Replies include Replying-to context; deeper descendants are displayed under one top-level thread.
- Names/avatars use the safe profile RPC for signed-in callers; unavailable/missing profiles can still fall back, not a promise that every row has a name.
- Repost reconciles with saved server state and shows You reposted; errors are surfaced rather than treating optimistic state as success.

## Following, notifications and install

Follow both people and businesses. Following selects content from those targets. Bell/history and realtime unread badges are implemented; sound/badge delivery on a device also depends on Web Push subscription/permission/browser/OS. Use profile preferences and Enable Push controls. Native install is prompted where supported; iOS follows Safari Share → Add to Home Screen. Installed startup shows app branding; unsupported/preview browsers do not get guaranteed install/push.

## Discover and account

Current Discover order: install strip → homepage ad → Today header → QuickActions → HomeHero → categories-above ad → category grid → New Products → New Members → membership CTA. Categories are two horizontal snap strips, four mobile tiles visible, featured first. Ad slot size remains compact; creatives with other ratios are fitted, not used to stretch the slot.

Dashboard contains account/onboarding/install tools. `/account/companies` and `/account/team` support business context/representatives; `/quotes` and `/messages` are protected trade pages. Do not infer one-company-per-user or storefront eligibility solely from the old Paid plan.

## Checked access matrix

| Action | Guest | Signed-in individual | Authorised verified business | Admin |
|---|---|---|---|---|
| Permitted feed/discovery reads | Yes | Yes | Yes | Yes |
| Social interactions | Login required | Per current RPC/settings | Per current RPC/settings | Yes |
| RFQ listing read | Login required | Non-hidden network rows | Non-hidden network rows | Includes admin exception |
| RFQ create / quote | No | Business gate | Approved/visible/verified checks | Applicable admin exceptions |
| Private quotation/chat read | No | Participant rules | Participant rules | Admin read policy |
| RFQ contact helper | No | Explicit role check | Paid/Broker/Admin still required | Yes |
| Content moderation/settings | No | No | No | Yes |

Both open-access switches were ON on 17 October 2026; this does not erase the narrower direct commercial gates. Role simulation is honored only signed out and never changes server privileges. This matrix reflects checked implementation, not a newly approved access policy.

## Controlled transparency and trust

Commodity prices use ranges; stock uses High/Medium/Low bands; trends use Rising/Stable/Cooling. BIL automation remains proposed, so stored/fallback trends are not evidence of a running scoring engine. Buyer reputation remains the governance direction; verification is revocable and not a guarantee. The removed `/forms` verification request stays removed; business registration uses `/apply` and current company review.

Read next: 04 Functional Spec; 15 access/security details; 25 operator guide.
