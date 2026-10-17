# Components & Design System

> **v3.3 · Documentation reviewed 17 October 2026.** Current source and selected hosted schema, policies, settings and buckets were checked. This is not a full security audit, legal approval or device-delivery certification.

## Current visual direction

G-BAU-G uses an X-style white/ink interface with burgundy actions, pale-gold accents and semantic status colors. Royal Heritage/Ivory and the old navy canvas are **historical**, not the default UI. The approved logo remains an asset rendered through `brand/Logo.tsx`; do not recreate/recolor it.

All color, shadow and gradient roles come from `src/index.css`; `tailwind.config.ts` maps tokens. Values below describe current light-mode tokens, not future immutable brand values.

| Token | HSL | Purpose |
|---|---|---|
| background/card/popover | `0 0% 100%` | White surfaces |
| foreground | `210 24% 9%` | Dark ink |
| primary/ring | `348 60% 27%` | Burgundy actions/focus |
| primary-foreground | `40 33% 97%` | On-primary text |
| secondary | `210 16% 96%` | Neutral controls |
| muted | `210 16% 97%` | Quiet surfaces |
| muted-foreground | `212 12% 43%` | Secondary text |
| accent | `38 55% 92%` | Pale-gold surface |
| accent-foreground/gold-dark/gold-strong | `32 70% 25%` | Legible dark-gold text |
| brand-gold/gold | `36 58% 51%` | Brand emphasis |
| border | `210 16% 91%` | Hairlines |
| input | `210 16% 86%` | Input outlines |
| success/up | `158 62% 38%` | Positive/verified state |
| destructive/danger/down | `358 76% 45%` | Destructive/negative state |
| like | `331 94% 53%` | Like interaction |
| repost | `160 84% 39%` | Repost interaction |

Dark-mode values are a separate `.dark` token set with warm-black surfaces and lifted burgundy/gold; do not copy light tokens into dark feature code. `--radius` is currently `1rem`; follow existing component shapes. Legacy navy aliases now map to ink/neutral values, not the old blue canvas.

Typography: Tailwind sans stack is **Inter Variable, Inter, system-ui, sans-serif**. No new font is introduced by this documentation update. Global numeric/font features and type utilities live in CSS. Gold fill is not suitable for small text on white; use foreground or dark-gold role. Verified states should use the semantic `success` role rather than hard-coded emerald utilities.

## Shell inventory

| Component | Current role |
|---|---|
| `layout/Header` | Account avatar/drawer, centred app mark and bell on mobile; desktop navigation |
| `layout/AccountDrawer` | Personal/business links, settings, installation and admin entry |
| `layout/MobileBottomTabBar` | Home · Discover · RFQ · Firms · **Chat** |
| `layout/FeedShell` | Desktop feed columns and mobile content shell |
| `contexts/ChromeVisibilityContext` | Coordinated header/ad/chip/bar visibility |
| `market/TopicChips` | Circular dashed-ring icon chips, horizontally scrollable |
| `home/today/AdSlot`, `home/AdBanner` | Compact fixed-slot creatives, off-ratio letterboxing/backdrop; no bottom title/footer strip |
| `pwa/InstallPromoCard`, `InstallBar`, `InstallAppButton`, `SplashScreen` | Install promotion, instructions and branded startup |
| `layout/NotificationsButton` | In-app unread badge/dropdown |

## Feed, catalogue and trade tools

- `market/ComposeSheet`: Update/Buzz destination, visible context, keyboard-aware text/media/poll composer, anonymous compliance notice.
- `market/CommentsSheet`, `pages/PostDetail`: author enrichment, Replying-to context, nested replies; mobile viewport and safe-area handling.
- `market/EngagementBar`: equal-width comment/share/like/repost/save; statistics only on opened posts.
- `market/PostMedia`, `reels/ReelsView`: signed image/PDF/video references and vertical Buzz media.
- `commodity/GuardedPrice`, `PriceBand`, `StockBand`, `TrendArrow`: controlled-transparency rendering; do not interpolate exact commodity prices/stock directly.
- `products/VariantManager`, `ProductTile`, `ListingRow`: catalogue browsing/editing.
- `rfq/CreateRfqSheet`, `QuoteRfqSheet`, `QuotationCard`, `RfqCard`: structured listing/quotation tools, **not a cart**.
- `deals/StartDealRoomButton`, `/messages` pages: private company conversation contexts.
- `social/FollowButton`, `CompanyHoverCard`, `company/CompanyTeamStrip`: people/business identity and following.
- `account/OnboardingChecklist`, `MembershipStatusCard`, admin moderation tabs: account state and business/admin actions.
- `docs/Markdown`, `Mermaid`, `DocPage`: GFM tables, diagrams, contents/progress, markdown download/print/read state.

## Mobile geometry

`chrome-layout.ts`: bar height **54px**, FAB gap **16px**, header reference **48px**. FAB bottom = safe-area inset + 70px with bar visible, safe-area + 16px hidden. Chrome/content/bar/FAB/overlay stack roles are centralized; hidden chrome must not intercept taps. Actual consumers and the mobile regression tests must agree with these values.

Inputs in mobile reply/compose contexts should stay at least 16px to avoid iOS focus zoom. Keyboard-aware viewport sizing and safe-bottom spacing are distinct from ordinary document scroll. Unit geometry tests do not replace physical iPhone/Android visual QA.

## Ad creative guidance

Current admin recommendation: desktop **1456×180** (728×90 @2x), mobile **720×200**, JPG/PNG/WebP preferably below **300KB**. This is creative guidance, not a server-enforced cap. Primary and optional mobile creatives, measured ratios and focal controls fit the existing slot rather than changing slot height for every advertiser.

## Design rules

Use semantic tokens and existing shadcn Button/controls; don't fork generic primitives for a one-off style. Preserve accessible names/focus/contrast. Use real uploaded product/business media. Keep animation purposeful and honor reduced motion. Removed LiveTicker, Market News and standalone Humor screens are not components to restore; Buzz can still contain humor. Never reintroduce CartContext, CartFab, CartDrawer or RFQModal.
