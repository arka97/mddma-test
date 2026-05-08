# Components & Design System

Inventory of every non-trivial component in the app, plus the complete design token reference. Use this when you need to know what something does, what it accepts, or what color/spacing token to reach for.

## Design tokens — the source of truth

All colors are HSL channel triplets stored in `src/index.css`. Tailwind is configured (`tailwind.config.ts`) so semantic classes like `bg-primary` resolve to `hsl(var(--primary))`. **Never** hard-code colors in components.

### Light mode (`:root`)

| Token | Value (HSL) | Use |
|---|---|---|
| `--background` | `210 40% 98%` | App canvas |
| `--foreground` | `215 45% 15%` | Primary text |
| `--card` | `0 0% 100%` | Card surface |
| `--card-foreground` | `215 45% 15%` | Card text |
| `--popover` | `0 0% 100%` | Floating panels |
| `--primary` | `215 60% 23%` | Navy — buttons, headers |
| `--primary-foreground` | `45 90% 96%` | Text on navy |
| `--secondary` | `215 35% 90%` | Soft navy |
| `--secondary-foreground` | `215 60% 23%` | Text on soft navy |
| `--muted` | `210 30% 95%` | Subtle backgrounds |
| `--muted-foreground` | `215 20% 45%` | Subdued text |
| `--accent` | `38 75% 45%` | Heritage gold |
| `--accent-foreground` | `0 0% 100%` | Text on gold |
| `--destructive` | `0 72% 51%` | Errors, delete |
| `--border` | `215 25% 88%` | Hairlines |
| `--input` | `215 25% 88%` | Form borders |
| `--ring` | `38 75% 45%` | Focus ring (gold) |
| `--radius` | `0.5rem` | Default radius |

Custom MDDMA brand tokens (use directly via `bg-navy`, `text-gold`, etc.):

| Token | HSL | |
|---|---|---|
| `--navy` / `-light` / `-dark` | `215 60% 23%` / `215 45% 35%` / `215 65% 15%` | Navy stack |
| `--gold` / `-light` / `-dark` | `38 75% 45%` / `45 85% 55%` / `35 70% 35%` | Gold stack |
| `--cream` | `45 40% 96%` | Warm canvas |
| `--warm-gray` | `30 10% 50%` | Captions on cream |

Sidebar tokens (`--sidebar-*`) follow the same pattern in navy-on-navy contrast.

### Dark mode (`.dark`)

Inverted: dark navy backgrounds (`215 65% 8%`), gold becomes the primary action color (`38 75% 50%`), and text uses warm cream (`45 30% 95%`). Applied automatically via the `dark` class.

### Custom utilities (`@layer components`)

| Class | Effect |
|---|---|
| `.heritage-badge` | Gold gradient pill with navy text, used for verification + tier badges |
| `.section-title` | `text-3xl md:text-4xl font-bold text-primary` |
| `.gold-gradient-text` | Three-stop gold gradient clipped to text |
| `.card-hover` | `transition-all duration-300 hover:shadow-lg hover:-translate-y-1` |

### Custom utilities (`@layer utilities`)

`.bg-navy[-light/-dark]`, `.bg-gold[-light]`, `.bg-cream`, `.text-navy[-light]`, `.text-gold[-dark]`, `.border-gold` — direct shortcuts to the brand tokens.

### Animations

Defined in `tailwind.config.ts`:

| Animation | Trigger |
|---|---|
| `accordion-down`, `accordion-up` | Radix accordion |
| `fade-in` (0.5s) | Section reveals on scroll |
| `slide-in-right` (0.5s) | Drawer / toast entries |
| `ticker-scroll` (CSS keyframe in `index.css`) | Live ticker translateX(-50%) loop |

### Typography

| Font | Used for |
|---|---|
| `Inter` (system fallback) | Everything — body and headings |
| `font-feature-settings: "cv02", "cv03", "cv04", "cv11"` | Active by default for cleaner numerals and disambiguated `1lI0O` |

Headings: `font-semibold tracking-tight`. No display font — corporate, not editorial.

### Breakpoints

Tailwind defaults plus a 1400px container cap (`screens.2xl`). Container has 2rem horizontal padding by default.

### Radius scale

`lg` = `var(--radius)` (0.5rem), `md` = -2px, `sm` = -4px. Cards use `lg`, badges/inputs use `md`, tags use `sm`.

---

## Component inventory

### Brand & layout

| Component | What it does |
|---|---|
| `brand/Logo.tsx` | MDDMA wordmark + crest, uses `gold-gradient-text` |
| `layout/Header.tsx` | Top nav, includes the **role simulator** for demos |
| `layout/Footer.tsx` | Footer with Association links and contact |
| `layout/Layout.tsx` | Page shell wrapper |
| `layout/MarketTicker.tsx` | Global scrolling ticker — "Live" badge + commodity rows: `name range ±%`. Reads live `products` rows; falls back to nothing when fewer than 1 priced row exists. |
| `layout/TrustStrip.tsx` | Bar of verification logos and counts |

### Commodity & catalogue

| Component | Role |
|---|---|
| `commodity/GuardedPrice.tsx` | **Single point of enforcement for UX-001.** Renders price as a `₹X–₹Y/unit` range. Refuses to render an exact rupee value. |
| `commodity/CommodityImage.tsx` | Smart image with fallback by commodity name |
| `commodity/ProductMediaCarousel.tsx` | Cover + up to 3 gallery images + optional video |
| `commodity/SellerScoreboard.tsx` | Verification tier + RFQ response rate of the seller |
| `commodity/SellerSignals.tsx` | BIL-driven badges: rising demand, low stock, fast mover |

### Cart & RFQ

| Component | Role |
|---|---|
| `cart/CartFab.tsx` | Floating action button (bottom-right). Shows count badge. |
| `cart/CartDrawer.tsx` | Slide-over drawer listing items, auth-required submit |
| `RFQModal.tsx` | Single-product RFQ shortcut (legacy single-item path) |

### Membership & trust

| Component | Role |
|---|---|
| `account/MembershipStatusCard.tsx` | Shows tier, status, expiry; CTA varies by state |
| `account/KYCDocsSection.tsx` | Upload + tier-promotion buttons → `promote-verification` |
| `trust/BuyerTrustBadge.tsx` | Reads `buyer_reputation_score`, maps to tier label via `get_buyer_reputation_tier` |

### Behavioral / signals

| Component | Role |
|---|---|
| `behavioral/BehavioralCues.tsx` | Demand pulses, view counters, derived from `products.demand_score` |
| `MarketSignals.tsx` | Aggregated signals card on home/dashboard |
| `pitch/PitchSection.tsx` | Lightweight reuse of vision content on home |

### Home

`home/HeroSection`, `home/RecentListingsSection`, `home/FeaturedMembersSection`, `home/FeaturedCategoriesSection`, `home/CommunitySection`, `home/NewsSection`, `home/SponsorsSection`, `home/AdBanner`, `home/WhyMddmaSection` — composable strips. Each is responsible for one section of the home page.

### Account / admin

| Component | Role |
|---|---|
| `products/VariantManager.tsx` | CRUD for `product_variants` of a single product |

### Docs

| Component | Role |
|---|---|
| `docs/Markdown.tsx` | Renders markdown using react-markdown + GFM. Mermaid blocks are extracted and rendered separately. |
| `docs/Mermaid.tsx` | Lazy-loads mermaid, theme-aware |
| `docs/DocPage.tsx` | Page chrome — TOC, progress bar, download `.md`, print, mark-as-read |

### Gates

| Component | Role |
|---|---|
| `PasswordGate.tsx` | Form + cache for `/documents` |
| `ProtectedRoute.tsx` | Auth + role gate for `/account/*` |

### UI primitives

`components/ui/*` — shadcn/ui set (Radix-based). Don't fork; extend via `cva` variants when a one-off style is needed (e.g. the `premium` button variant in `button.tsx`).

## Design rules — non-negotiable

1. **HSL semantic tokens only.** No `text-white`, no `#hex`, no rgb(). Use `text-primary-foreground`, `bg-card`, etc.
2. **`GuardedPrice` for any price display.** A direct `₹{p.price_min}` is a bug.
3. **Stock band, never stock count.** UI shows `High / Medium / Low`.
4. **Trend chip, never raw search count.** UI shows `Rising / Stable / Cooling`.
5. **Contact reveal is gated.** The phone/WhatsApp deeplink only renders for `paid_member` and above.
6. **Animation budget.** `fade-in` and `slide-in-right` for entries; `card-hover` for cards. No bouncy springs, no parallax — corporate aesthetic.
