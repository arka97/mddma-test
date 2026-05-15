# Components & Design System

Inventory of every non-trivial component in the app, plus the complete design token reference.
Logo finalized — **Royal Heritage palette** (May 2026). All tokens below reflect the approved brand.

> **Migration note (May 2026).** The old "Navy + Gold on near-white" palette was replaced with the Royal Heritage palette (Navy + Burgundy + Antique Gold on Ivory). If a screenshot or component still looks cooler/whiter than the rest of the app, it is pre-migration — re-render and re-capture. `--destructive` is intentionally **not** burgundy: errors stay red so brand actions and destructive actions are never visually confused.

---

## 1. Brand Identity

### Logo

The MDDMA logo is shipped as four variants, all served from `src/assets/brand/` (and mirrored under `/public/brand/` for the favicon and OG tags). The `Logo` component is the only correct way to render any of them.

| `variant` prop | Asset | Use |
|---|---|---|
| `horizontal` (default for marketing) | `MDDMA_Royal_Heritage_Logo.svg` | Site header lockup, email signatures, banners, documents |
| `stacked` | `MDDMA_Royal_Heritage_1to1.svg` | Footer, hero badges, install screen, social profile, app icon, WhatsApp DP |
| `mark` | `MDDMA_logomark.svg` | Favicon, header crest, embossed seals, watermarks, loading spinner |
| `typemark` | `MDDMA_typemark_square.svg` | Letterheads, certificates, co-branding lockups |

```tsx
import { Logo } from "@/components/brand/Logo";

<Logo variant="mark" className="h-8 w-8" />
<Logo variant="horizontal" className="h-12 w-auto" />
<Logo variant="stacked" className="h-24 w-auto" />
```

### Logo construction

- **Emblem (logomark):** Circular scene — farmer → factory → cargo ship — cradled by a sweeping hand. Globe grid background. Flat dry-fruit silhouettes (almond, cashew, walnut, date) with leafy branch. Gold arc reading `· SINCE 1930 ·`.
- **Typemark:** `MDDMA` in bold, all letters uniform burgundy. Small gold leaf on the right leg of the A, not exceeding cap height.
- **Divider:** Thin gold horizontal line with centered gold dot, equal spacing above and below.
- **Full name:** `MUMBAI DRYFRUITS AND DATES MERCHANTS ASSOCIATION` in burgundy, two lines, centered, lighter weight than the acronym.

### Clear space & minimum size

- Minimum clear space: **½ × the height of the M letterform** on all sides.
- Minimum digital size: **32px height** for the logomark, **120px width** for the horizontal lockup.
- Never stretch, rotate, recolor, add drop shadows, or place the logo on a busy photographic background.

### Logo don'ts

- Do not use the older green palette versions — Royal Heritage is the only approved palette.
- Do not separate the gold leaf from the A.
- Do not change `MDDMA` to mixed colors — all five letters must be uniform burgundy.
- Do not place on backgrounds darker than `--cream` without using the reversed (white) variant — the dark navy header wraps the mark in a small ivory tile so contrast is preserved.
- Do not recreate the logo in inline SVG or CSS. Always render it through the `Logo` component.

---

## 2. Design Tokens — the source of truth

All colors are HSL channel triplets in `src/index.css`. Tailwind resolves semantic classes like `bg-primary` to `hsl(var(--primary))`. **Never hard-code hex or rgb values in components.**

### Royal Heritage brand colors (reference)

These are the approved logo hex values. The HSL tokens below are calibrated to match them.

| Name | Hex | Role |
|---|---|---|
| Navy | `#1B2F5E` | Primary brand, structure, headers, body text on ivory |
| Burgundy | `#7B1F2E` | Typemark, primary CTAs, active nav indicator |
| Antique Gold | `#C9A84C` | Arc, divider, leaf, accents, focus ring |
| Ivory | `#F8F4ED` | Background canvas |

### Light mode (`:root`)

| Token | Value (HSL) | Hex approx | Use |
|---|---|---|---|
| `--background` | `45 40% 96%` | `#F8F4ED` | App canvas — matches logo ivory |
| `--foreground` | `215 55% 23%` | `#1B2F5E` | Primary text |
| `--card` | `0 0% 100%` | `#FFFFFF` | Card surface (lifts off ivory) |
| `--card-foreground` | `215 55% 23%` | `#1B2F5E` | Card text |
| `--popover` | `0 0% 100%` | `#FFFFFF` | Floating panels |
| `--primary` | `215 55% 23%` | `#1B2F5E` | Navy — buttons, headers |
| `--primary-foreground` | `45 90% 96%` | `#FDF8EE` | Text on navy |
| `--secondary` | `215 35% 90%` | `#D6DDF0` | Soft navy tint |
| `--secondary-foreground` | `215 55% 23%` | `#1B2F5E` | Text on soft navy |
| `--muted` | `45 30% 93%` | `#F2EDE2` | Subtle warm backgrounds |
| `--muted-foreground` | `215 20% 45%` | `#607090` | Subdued text |
| `--accent` | `38 55% 54%` | `#C9A84C` | Heritage gold |
| `--accent-foreground` | `0 0% 100%` | `#FFFFFF` | Text on gold |
| `--destructive` | `0 72% 51%` | `#DC2626` | **Errors only** — kept red, not burgundy |
| `--border` | `215 25% 88%` | `#D4DAE8` | Hairlines |
| `--input` | `215 25% 88%` | `#D4DAE8` | Form borders |
| `--ring` | `38 55% 54%` | `#C9A84C` | Focus ring (gold) |
| `--radius` | `0.5rem` | — | Default border radius |

### Custom MDDMA brand tokens

Use directly via utility classes — `bg-navy`, `text-burgundy`, `border-gold`, etc.

| Token | HSL | Hex | Use |
|---|---|---|---|
| `--navy` | `215 55% 23%` | `#1B2F5E` | Primary navy |
| `--navy-light` | `215 45% 35%` | `#3A538A` | Hover / lighter navy |
| `--navy-dark` | `215 65% 15%` | `#111E3D` | Dark navy for text on cream |
| `--burgundy` | `350 60% 30%` | `#7B1F2E` | Typemark, primary CTAs |
| `--burgundy-light` | `350 50% 42%` | `#A03040` | Hover state |
| `--burgundy-dark` | `350 65% 20%` | `#52141E` | Pressed / dark contexts |
| `--gold` | `38 55% 54%` | `#C9A84C` | Antique gold — accents |
| `--gold-light` | `45 75% 65%` | `#DFC070` | Hover / highlight |
| `--gold-dark` | `35 60% 38%` | `#98762A` | Borders, dividers |
| `--cream` | `45 40% 96%` | `#F8F4ED` | Warm canvas background |
| `--warm-gray` | `30 10% 50%` | `#857D74` | Captions on cream |

> Burgundy is **not** mapped to `--destructive`. Errors render in red so destructive UX is never confused with brand actions.

### Dark mode (`.dark`)

Dark navy backgrounds (`215 65% 8%` ≈ `#090E1D`). Gold becomes the primary action color. Text uses warm cream (`45 30% 95%`). **Burgundy is lifted to `350 55% 65%` (≈ `#D4707E`)** for legibility against dark navy. Applied automatically via the `dark` class.

### Custom utilities (`@layer components`)

| Class | Effect |
|---|---|
| `.heritage-badge` | Gold gradient pill with navy text — verification and tier badges |
| `.section-title` | `text-3xl md:text-4xl font-bold text-primary` |
| `.gold-gradient-text` | Three-stop gold gradient clipped to text |
| `.card-hover` | `transition-all duration-300 hover:shadow-lg hover:-translate-y-1` |
| `.burgundy-underline` | 2px burgundy bottom border — active nav indicator |
| `.ivory-surface` | `bg-cream`, gold/20 border, `lg` radius — warm content panel |

### Custom utilities (`@layer utilities`)

`.bg-navy[-light/-dark]`, `.bg-burgundy[-light/-dark]`, `.bg-gold[-light]`, `.bg-cream`
`.text-navy[-light]`, `.text-burgundy[-light]`, `.text-gold[-dark]`, `.text-warm-gray`
`.border-gold`, `.border-navy`, `.border-burgundy`

---

## 3. Typography

| Font | Used for |
|---|---|
| `Inter` (system fallback) | Everything — body and headings |
| `font-feature-settings: "cv02","cv03","cv04","cv11"` | Active by default — cleaner numerals, disambiguated `1lI0O` |

- Headings: `font-semibold tracking-tight text-primary` (navy)
- Body: `text-foreground leading-relaxed`
- Captions / meta: `text-warm-gray text-sm` or `text-muted-foreground`
- Gold accents (prices, badges, decorative highlights only): `text-gold font-medium`
- Burgundy (CTAs, active states, section emphasis): `text-burgundy font-semibold`

No display font — corporate, not editorial. Do not introduce decorative typefaces.

### Type scale (Tailwind defaults)

| Size | Class | Use |
|---|---|---|
| 36–48px | `text-4xl / text-5xl` | Hero headings |
| 24–30px | `text-2xl / text-3xl` | Section titles (`.section-title`) |
| 20px | `text-xl` | Card headings |
| 16px | `text-base` | Body |
| 14px | `text-sm` | Meta, labels, table content |
| 12px | `text-xs` | Badges, captions |

---

## 4. Animations

Defined in `tailwind.config.ts`:

| Animation | Trigger | Duration |
|---|---|---|
| `accordion-down` / `accordion-up` | Radix accordion | Auto |
| `fade-in` | Section reveals on scroll | 0.5s |
| `slide-in-right` | Drawer / toast entries | 0.5s |
| `ticker-scroll` | Live ticker `translateX(-50%)` loop | CSS keyframe in `index.css` |

**Animation budget:** `fade-in` and `slide-in-right` for entries; `card-hover` for cards. No bouncy springs, no parallax — corporate aesthetic throughout.

---

## 5. Breakpoints & Layout

- Tailwind defaults plus a `1400px` container cap (`screens.2xl`).
- Container: `2rem` horizontal padding by default.
- Logo minimum widths: `120px` horizontal lockup, `48px` square / stacked lockup.

### Radius scale

| Token | Value | Used on |
|---|---|---|
| `lg` | `0.5rem` | Cards, panels, modals |
| `md` | `calc(0.5rem - 2px)` | Badges, inputs, buttons |
| `sm` | `calc(0.5rem - 4px)` | Tags, chips |

---

## 6. Component Inventory

### Brand & layout

| Component | What it does |
|---|---|
| `brand/Logo.tsx` | Renders the approved brand asset. `variant`: `mark` (default), `stacked`, `horizontal`, `typemark`. Each variant has a sensible default size that can be overridden via `className`. |
| `layout/Header.tsx` | Top nav. Wraps `Logo variant="mark"` in an ivory tile for contrast on navy. Active links use `.burgundy-underline`. Includes the role simulator for demos. |
| `layout/Footer.tsx` | Footer with Association links and contact. Renders `Logo variant="stacked"`. |
| `layout/Layout.tsx` | Page shell: `MarketTicker` + `Header` (sticky) + `TrustStrip` + content + `Footer`. |
| `layout/MarketTicker.tsx` | Global scrolling ticker — "Live" badge + commodity rows: `name range ±%`. Reads live `products` rows; falls back silently when fewer than 1 priced row exists. |
| `layout/TrustStrip.tsx` | Persistent strip of verification + "Established 1930" credibility cues under the header. |

### Commodity & catalogue

| Component | Role |
|---|---|
| `commodity/GuardedPrice.tsx` | **Single point of enforcement for UX-001.** Renders price as `₹X–₹Y/unit` range. Refuses to render an exact rupee value. |
| `commodity/CommodityImage.tsx` | Smart image with fallback by commodity name |
| `commodity/ProductMediaCarousel.tsx` | Cover + up to 3 gallery images + optional video |
| `commodity/SellerScoreboard.tsx` | Verification tier + RFQ response rate of the seller |
| `commodity/SellerSignals.tsx` | BIL-driven badges: rising demand, low stock, fast mover |

### Cart & RFQ

| Component | Role |
|---|---|
| `cart/CartFab.tsx` | Floating action button (bottom-right). Count badge in burgundy. |
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
| `MarketSignals.tsx` | Aggregated signals card on home / dashboard |
| `pitch/PitchSection.tsx` | Lightweight reuse of vision content on home |

### Home

`home/HeroSection`, `home/RecentListingsSection`, `home/FeaturedMembersSection`, `home/FeaturedCategoriesSection`, `home/CommunitySection`, `home/NewsSection`, `home/SponsorsSection`, `home/AdBanner`, `home/WhyMddmaSection` — composable strips. Each owns one section of the home page.

### Account / admin

| Component | Role |
|---|---|
| `products/VariantManager.tsx` | CRUD for `product_variants` of a single product |

### Docs

| Component | Role |
|---|---|
| `docs/Markdown.tsx` | Renders markdown via react-markdown + GFM. Mermaid blocks extracted and rendered separately. |
| `docs/Mermaid.tsx` | Lazy-loads mermaid, theme-aware (navy + gold theme variables) |
| `docs/DocPage.tsx` | Page chrome — TOC, progress bar, download `.md`, print, mark-as-read |

### Gates

| Component | Role |
|---|---|
| `PasswordGate.tsx` | Form + cache for `/documents` |
| `ProtectedRoute.tsx` | Auth + role gate for `/account/*` |

### UI primitives

`components/ui/*` — shadcn/ui set (Radix-based). Don't fork; extend via `cva` variants. Approved custom variants on `Button`:

| Variant | Token used | Appearance | When to use |
|---|---|---|---|
| `default` | `bg-primary text-primary-foreground` | Navy fill | Generic primary button |
| `premium` | `bg-burgundy text-primary-foreground` | Burgundy fill | The single most important CTA on the screen (Apply, Sign In, Submit RFQ) |
| `gold` | `bg-gold text-navy-dark` | Gold fill | Heritage / featured-member action |
| `outline-navy` | `border-navy text-navy` | Navy outline | Secondary action |
| `destructive` | `bg-destructive` (red) | Red fill | Delete / irreversible actions only |

Plus `secondary`, `outline`, `ghost`, `link` from shadcn defaults.

`Badge` — extend via `.heritage-badge` for verification / tier badges.

---

## 7. Design Rules — Non-negotiable

1. **HSL semantic tokens only.** No `text-white`, no `#hex`, no `rgb()`. Use `text-primary-foreground`, `bg-card`, `text-burgundy`, etc.
2. **`GuardedPrice` for any price display.** A direct `₹{p.price_min}` in markup is a bug.
3. **Stock band, never stock count.** UI shows `High / Medium / Low`.
4. **Trend chip, never raw search count.** UI shows `Rising / Stable / Cooling`.
5. **Contact reveal is gated.** Phone / WhatsApp deeplink renders only for `paid_member` and above.
6. **Animation budget.** `fade-in` and `slide-in-right` for entries; `card-hover` for cards. No springs, no parallax.
7. **Logo integrity.** Always use the approved Royal Heritage palette lockup. Never recolor, stretch, or recreate the logo in CSS or SVG inline — render via `<Logo variant="…" />`.
8. **Burgundy for actions, navy for structure, gold for emphasis.** Never use all three at equal visual weight in one component — establish a clear hierarchy.
9. **Ivory background is the default canvas.** `--background` is now `#F8F4ED` (matches `--cream`). White (`bg-card`) is reserved for card surfaces that need to lift off the canvas.
10. **Accessibility.** Navy on ivory passes WCAG AA easily. Burgundy on ivory passes AA for body text. **Gold on ivory fails AA — never use gold for body text or small UI text, only for decorative elements, focus rings, and large headings (≥24px bold).**
11. **`destructive` ≠ burgundy.** Errors and irreversible actions stay red. Brand actions stay burgundy. Don't blend them.
