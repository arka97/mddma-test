# Functional Spec

> **v3.3 · Last verified September 2026** against `src/routes.tsx`, the live database, edge functions and storage buckets.

Module-by-module specification with acceptance criteria. Each module names its data dependencies, the role gates that apply, and the behaviour expected on the happy path.

## Module map

```mermaid
flowchart LR
  Home --> Disc[Discover /discover]
  Disc --> Dir[Directory]
  Disc --> Prod[Products]
  Disc --> Brands[Brands]
  Home --> Bulletin[Bulletin in feed]
  Home[Home = Community Feed /] --> Buzz[Buzz reels]
  Home --> RFQ[RFQ board /rfq]
  Dir --> Mem[Member Profile]
  Mem --> Store[Storefront]
  Prod --> PP[Product Page]
  Store --> PP
  Brands --> BP[Brand Page]
  PP --> Contact[Contact CTA<br/>wa.me / tel]
  RFQ --> RC[RFQ Contact Reveal<br/>logged]
  Account[Account Hub /dashboard] --> Profile
  Account --> Company
  Account --> ProductsMgr[Products + Variants]
  Account --> BrandsMgr[Brands]
  Admin[Admin /account/moderation] --> CMS[Bulletin + Ads CRUD]
  Admin --> Mod[Community + RFQ moderation]
  Admin --> Anon[Anonymous-post log]
  Admin --> Access[Feature Access toggle]
  Public[/faq · /knowledge · /contact · /about · /membership/] --> Home
```

## Home modules

Discover (`/discover`) renders, in order: **HomeHero** → Homepage banner ad → **QuickActionsGrid** (4 tiles, live counts for Bulletin + RFQ) → **CategoryGrid** (two horizontal snap-strips: 4 mobile / 8 desktop tiles, featured first) → interstitial ad → **New Products** (`RecentListingsList`) → **New Members** (`NewMembersList`) → **MembershipCTA**. All modules obey controlled-transparency; ads live in the `ad-assets` bucket, admin-only write.

## Discovery modules

### Directory `/directory`
- Lists verified Association members from the live database only (DATA-001).
- Public list (name, badges, city, category chips). Full contact card requires Paid or Feature Access ON.
- Filters: category, city, verified, broker (accepts `?type=Broker`, which is where the retired `/broker` route now redirects).
- **Acceptance:** a member added in admin appears within one cache cycle; non-Paid users see "Become a member to view contact" instead of phone numbers.

### Member Profile `/directory/:slug`
- Public summary; storefront link; "Contact seller" CTA (auth-gated reveal).
- **Acceptance:** an unauthenticated visitor tapping Contact is sent to `/login` and returned to the same profile.

### Storefront `/store/:slug`
- A single member's curated product showcase with brand strip, featured products, and category tabs.
- Backed by the `companies_public` view (`security_invoker=true`), which grants safe columns only to `anon` / `authenticated` (no `email`, `phone`, `gstin`, `address`).
- **Acceptance:** only Paid members can have a storefront; URL for non-Paid resolves to a 404-style empty state; sticky contact bar reveals wa.me only for Paid or Feature Access ON.

### Products `/products` and `/products/:slug`
- Cross-member catalogue with variant-level browsing.
- Price shown as a range; stock as a band; demand trend from BIL signal (or local fallback).
- **Acceptance:** no rendered price matches an exact rupee value from the database.

### Brands `/brands` and `/brands/:slug`
- Cross-company house-brand discovery. Brand page links to the brand's products and to the owning company's storefront. Branded SKUs may link to an external B2C URL.
- **Acceptance:** brands without active products are still listed and show an empty state on the brand page.

### Community Feed — the home page `/`
- The live posting surface and the app's landing screen. `/market`, `/community` and `/circulars` all redirect here.
- **Lanes:** `community_posts.channel` is `updates` or `buzz`. **Updates** = prices, alerts, sourcing, polls and bulletins (list view). **Buzz** = humor, gossip and member news media, rendered as a vertical snap-scroll reels view. Admins can move a post between lanes.
- **Chips:** circular dashed-ring icon chips — Updates · Buzz · Following · Bulletin · Price Signals — with horizontal swipe between lanes and hide-on-scroll chrome.
- Tables: `community_posts`, `post_comments` (self-referencing `parent_id` for threaded replies), `post_likes`, `post_views`, `post_reposts`, `post_polls`, `post_poll_options`, `post_poll_votes`, `anonymous_identity_log` (admin-only RLS).
- Compose supports **text · images (clipboard paste) · PDFs · video (MP4/MOV/WebM, ≤50 MB) · polls · price ranges · Update/Buzz switch · anonymous toggle**, in a keyboard-aware full-height sheet. Links auto-expand into rich previews via the `fetch-link-preview` edge function (oEmbed for YouTube/Vimeo, direct-image/video/PDF detection). Pinned rate cards can be featured by admins.
- Compose media uploads land in the `community-media` bucket. Update policy on the bucket requires `is_paid_or_admin` — losing paid status removes overwrite rights.
- Engagement bar is an evenly spaced grid in the order **comment · share · like · repost · save**; view counts appear only on an opened post. Share offers native share, copy link and WhatsApp only. Reposts persist in `post_reposts` via the `set_business_post_repost` / `get_post_repost_summary` RPCs and show a "You reposted" line. Replies support one level of threading with "Replying to" context, and every author shows their real name and avatar via the `get_public_profiles` RPC.
- Access: **any signed-in member** can post, reply, like, repost, bookmark, share and follow while the Feature Access and "verification not required" toggles are ON. **Guests can read the feed but cannot interact.** Admin-only actions (pin, hide, move lane) stay gated. Anonymous posting writes the real identity to `anonymous_identity_log` for admin audit.
- When **Feature Access** is ON (`is_features_open() = true`), RLS opens read to guests + free members.
- Floating "Post" FAB sits above the bottom tabs using shared safe-area geometry (`src/lib/chrome-layout.ts`) and slides down with the tab bar when chrome hides. Mobile-scroll regression tests cover chip, chrome and FAB alignment across Updates, Buzz and Following.
- **Acceptance:** any signed-in member can post/like/comment/repost/poll; guests see the feed read-only; anonymous posts hide the author from other members but are visible to admins via the log; pin escalation is blocked at RLS (`WITH CHECK` prevents authors from self-pinning).

### RFQ board `/rfq`
- Paid members and admins create and browse RFQ listings (buy or sell intent).
- Backed by `rfq_listings` (1–90 day expiry) and `rfq_contact_reveals`. Contact reveal is a one-tap flow gated by the `get_company_whatsapp` RPC and logged.
- The legacy `rfqs` / `inquiry_products` / `rfq_responses` cart schema, `CartContext`, `CartFab` / `CartDrawer` / `RFQModal` and `/account/rfqs` inbox remain **removed**.
- When Feature Access is ON, RLS opens read to guests + free members.
- **Acceptance:** a paid member creates a listing with expiry; another paid member reveals contact once and the reveal appears in `rfq_contact_reveals`; expired listings drop from the public feed.

### Bulletin (in the feed)
- Admin-managed announcements with title, slug, body, optional attachment URL, `published_at`. The standalone page is gone — bulletins are interleaved into the Updates feed and surfaced by the **Bulletin** chip; `/circulars` redirects to `/`.
- Attachments served via **1-hour signed URLs** (tightened from the earlier 5-year signing).
- **Acceptance:** drafts are not visible to non-admins; published entries are reachable by slug; the home QuickActions "Bulletin" tile shows a live count of published entries.

## Public authority pages

| Route | Contents | Notes |
|---|---|---|
| `/discover` | Discover shell above | Prerendered |
| `/about` | Association history + committee members + office bearers | Prerendered |
| `/membership` | 2-card grid (Free vs Paid) + side-by-side comparison table | Prerendered |
| `/apply` | Single Paid plan checkout + "I operate as a broker" flag | — |
| `/install` | PWA install guide (iOS Safari, Android Chrome) | Prerendered |
| `/knowledge` | Article index (markdown-backed via `src/content/knowledge/*.md`, loaded through `import.meta.glob`) | Prerendered |
| `/knowledge/:slug` | Individual article | Prerendered |
| `/faq` | Categorised FAQs + `FAQPage` JSON-LD generated from the same source | Prerendered |
| `/contact` | Real office address, phone, hours, Grievance Officer, mailto form | Prerendered |

## Forms `/forms`

Two tabs only: **Advertise** and **Submit Circular**. The Verification Request tab has been removed (v3.1.3) — verification is admin-driven through `/account/moderation`. Contact phone number is **+91 98200 69545**.

## Account hub `/dashboard`, `/account/*`

Mobile bottom-tab "Account" opens `/dashboard`. The dashboard shows a gold-underlined hero card, the **OnboardingChecklist** (5 live-progress steps) and the **install promo card**.

| Route | Purpose |
|---|---|
| `/account/profile` | Edit display name, contact preferences, view membership state |
| `/account/company` | Edit company name, GST, address, categories, branding |
| `/account/products` | CRUD products and variants (with image + video upload) |
| `/account/brands` | CRUD brands belonging to the user's company |
| `/account/moderation` | Admin only: approve companies, manage Bulletin + Ads, Community + RFQ moderation, Anonymous-log tab, **Feature Access** toggle |

There is **no `/account/rfqs`** and **no `/account/verify`** route. KYC tier promotion happens through admin moderation (`profiles.verification_tier`, `*_verified_at` timestamps) — the trigger `prevent_profile_privilege_escalation` blocks any non-admin write to those fields.

## Admin CMS `/account/moderation`

```mermaid
stateDiagram-v2
  [*] --> Pending: Member submits KYC during onboarding
  Pending --> UnderReview: Admin opens record
  UnderReview --> Verified: Docs approved
  UnderReview --> Rejected: Docs rejected with reason
  Rejected --> Pending: Member resubmits
  Verified --> [*]
```

- **Bulletin CRUD:** title, slug, body, publish toggle, attachment.
- **Ads CRUD:** placement (home / category / directory), image (uploaded to `ad-assets`, admin-only write), link, active window. Ad slots are image-only (no title/footer strip) with a compact "Ad" badge and dot indicator when carousel.
- **Community moderation:** hide posts, soft-delete comments, pin (admin only — authors cannot self-pin).
- **RFQ moderation:** hide listings, mark expired.
- **Anonymous-post log:** admin-only view over `anonymous_identity_log` (RLS locked to admins).
- **Feature Access toggle:** flips `app_settings.features_open_to_all`; `useAppSettings` hook syncs it in real time; `RoleContext.isEffectivePaid` follows.
- **Member moderation:** approve verification, toggle broker flag, suspend, set `review_status` and `is_hidden`.

## Notifications

In-app notifications plus Web Push. Tables cover notifications, push subscriptions and per-type preferences; database triggers fire on replies, likes, follows, deal-room activity, announcements and market signals. Delivery runs through the `push-vapid-key` and `send-push` edge functions and the app-shell service worker; the header bell badge updates in realtime, `/notifications` lists history, and `/account/profile` holds the per-type switches.

*The Live Ticker, Market News and Humor modules were removed in v3.3.*

## SEO surfaces (GTM-001)

Public authority routes are prerendered, listed in `sitemap.xml`, and allowlist GPTBot / ClaudeBot / PerplexityBot / Google-Extended in `robots.txt`. `index.html` carries an Organization JSON-LD block. The transactional core (`/` feed, `/directory`, `/products`, `/store/:slug`, `/brands`, `/brands/:slug`, `/rfq`, `/notifications`, `/dashboard`, `/account/*`, `/documents`, `/login`, `/forms`) is `noindex` via `<Seo noindex />` and contains no price / stock / contact in indexable HTML.

## Acceptance principle

Every module ships with a single rule: **exact prices and exact stock figures must not appear in the rendered DOM**, regardless of role. UI components (`<GuardedPrice>`, `<PriceBand>`, `<StockBand>`, trend chip) are the enforcement point.

## Member-facing legal & policy pages

Privacy (doc 19), Terms (doc 20), Refund (doc 21) and Grievance (doc 22) live behind the `/documents` password today. Promoting them to public routes (`/privacy`, `/terms`, `/refund`, `/grievance`) with a footer link block is a follow-up task — required before Razorpay live mode and before any large-scale member onboarding.

## Read next

- **05 · Architecture & Tech** — how this is implemented.
- **23 · KYC & Verification Policy** — the trust ladder in policy form.
