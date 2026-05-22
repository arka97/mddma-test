# Mobile-First Redesign Plan — for Non-Tech-Savvy B2B Traders

## Goal
Rebuild MDDMA's primary surfaces (Home, Header/Nav, Directory, Products, Product detail, Storefront, RFQ flow) so:

1. **Mobile is the default** — desktop is progressive enhancement
2. **Non-tech-savvy traders can use it without help** — APMC merchants, brokers, family-run trading houses, many 40+ years old, often more comfortable in Hindi/Marathi than English, used to WhatsApp and phone calls, not dashboards

Reference vectors:
- **IA** from Misumi-EC + McMaster mobile (B2B catalog density done right)
- **Aesthetic & rhythm** from hims.com + forhers.com (warm, editorial, generous space)
- **Simplicity discipline** from WhatsApp, Google Pay, IRCTC Rail Connect — apps that work for first-time smartphone users

---

## Design principles for non-tech users (these guide every decision)

1. **One screen, one job.** Never ask a user to do two things at once. Long forms → wizard with one question per step + progress dots.
2. **Words people actually say.** Replace jargon everywhere: "RFQ" → "Ask for price", "Storefront" → "Seller's page", "Directory" → "Find sellers", "Membership tier" → "Your plan", "Authentication" → "Login", "Submit" → "Send".
3. **Always offer Hindi.** Add a language toggle (English / हिंदी / मराठी) in the header and onboarding. Even if full i18n is phase 2, ship key CTAs + form labels bilingually now.
4. **Show, don't make them read.** Big icons + short labels under every action. Empty states show a one-line instruction + an illustration, not a wall of text.
5. **Forgiving by default.** Every destructive action (delete, cancel RFQ, remove from cart) shows a confirm dialog + an Undo toast for 8 seconds. Auto-save drafts. Never lose typed input on navigation.
6. **Never dead-end.** Every error message says *what happened* + *what to do next*, with a button to do it. No raw codes. No "Something went wrong" alone.
7. **Tap before type.** Prefer chips, dropdowns, steppers, and saved-suggestions over free-text entry wherever possible.
8. **Big & obvious.** Min tap target 48×48 (above the usual 44). Primary CTA is always the largest button on screen, full-width on mobile, single color, plain verb.
9. **Trust at every step.** Verified badges, "1,240 traders use MDDMA", small testimonials, a visible WhatsApp/phone help button on every page.
10. **No surprise costs or sign-ups.** Browsing is free; auth is only asked when sending an RFQ, with a clear "Why login?" line.

---

## What changes

### 1. Global shell & navigation
- Compact 56px top bar: **logo · search icon · menu · cart**
- Replace right Sheet with **full-screen drilldown drawer**: tap "Categories" → next panel slides in (one decision per screen)
- **Bottom tab bar on mobile** (`md:hidden`): **Home · Find · Cart · Help** — "Help" is a dedicated tab, not buried in a footer
- Floating WhatsApp help button bottom-right on every page (above CartFab when both present)
- Add **language switcher** (EN / हिं / मरा) in header and drawer
- Hide MarketTicker on mobile or collapse to a single tappable strip

### 2. First-run onboarding (new)
- 3-screen welcome carousel on first visit: "Find verified sellers" / "Send one price request to many" / "Get replies on WhatsApp" — Skip + Next, never modal-trapped
- After welcome, land on Home with a soft tooltip pointing at the search bar: "Start by searching for what you want to buy"
- Stored in localStorage so it never shows again

### 3. Home page — hims rhythm + trader clarity
- **Hero**: stacked single column — large display headline in plain language ("Buy and sell APMC commodities, the verified way"), one-line subhead, ONE primary CTA ("Start a price request"), one secondary text link ("Browse sellers"), soft tinted background, one editorial image
- **Search band** under hero with placeholder in 2 languages ("Search: dal, sugar, rice…")
- **4 big category tiles** with icon + name in Hindi+English (e.g. "दाल / Pulses")
- All `grid-cols-2` mobile grids → **single-column dense rows** (image-left, name + 1 spec line, tap-target = whole row)
- Section headers: small eyebrow + large headline + single text link, stacked on mobile
- **Trust strip**: verified members count, GST-verified, years in market, "as featured in" line
- **"How it works" in 3 steps**: numbered, illustrated, one sentence each
- **FAQ accordion** at the bottom in plain language ("Is it free?", "How do I get paid?", "Can I use it in Hindi?")
- Alternating soft tinted bands (cream → white → sand → white), `py-12 md:py-20`

### 4. Directory & Products
- Mobile: single-column dense list rows
- Filters in **bottom sheet** with chips not dropdowns ("Sort: Newest" / "Verified only" / "Near me") — never a multi-select tree
- Sticky "Filters · 2 active" button shows count; one tap to clear all
- Empty states: illustration + "No sellers match. Try removing filters." + a clear button

### 5. Product / Storefront detail
- Full-bleed image carousel, dot indicators
- **Sticky bottom action bar**: qty stepper (− 1 +) + big "Ask for price" button
- Specs / variants / seller signals as **accordions**, collapsed by default
- "Call seller" + "WhatsApp seller" buttons visible without scroll for verified members
- Related products as one horizontal-scroll chip row

### 6. RFQ flow — the highest-stakes surface for non-tech users
- **Cart drawer** opens full-screen bottom sheet on mobile; clear "X items in your request" header
- Submission becomes a **3-step wizard**: (1) Confirm items + qty (2) Your contact details (pre-filled if logged in) (3) Review + Send
- Progress dots at top; back button always visible; Save Draft auto-runs every change
- After send: full-screen confirmation with "We'll send replies to your WhatsApp" + a single "Back to home" button
- Undo toast on remove-from-cart (8s)
- Pre-typed message templates ("Need 50 bags by next week" / "Best price please") to avoid blank-text-box paralysis

### 7. Forms everywhere
- One question per screen on mobile for any form ≥ 4 fields (Apply, Profile, Company, RFQ)
- Inline validation **after** the user leaves the field, not while typing
- Helper text under every field in plain language with an example
- Phone number: separate country-code chip + 10-digit field, auto-format
- File upload: big drop zone with "Take a photo" button (mobile camera capture)
- All buttons say the action: "Save profile", "Send request" — never "Submit"

### 8. Errors, loading, empty states
- Loading: skeleton + "Loading sellers…" text under it (silent spinners worry first-timers)
- Empty: illustration + 1 sentence + 1 button
- Error: red badge + "What happened" + "What to do" + retry button; never show stack traces or codes
- Network offline: persistent yellow banner "You're offline. We'll send your request once you're back online." + queue the action

### 9. Typography, color, spacing
- Display serif (Instrument Serif or DM Serif Display) for h1/h2; Inter for body; **base size 17px on mobile** (bigger than usual — older eyes)
- Line-height 1.6, max 65ch on text blocks
- Add surface tokens `--surface-cream/sand/sage/blush` as section backgrounds; **navy + emerald stay primary brand**
- Card radius `rounded-2xl`, soft `shadow-sm`, lighter borders
- Mobile container `px-4`; sections `py-12 md:py-20`
- Min tap target **48×48** (raised from 44)
- Focus rings always visible (keyboard + screen-reader users)

### 10. Help & support — always within reach
- Floating WhatsApp help button (bottom-right, persistent)
- "?" icon next to any complex term opens a small popover with a plain-language explanation
- A dedicated **/help** page reachable from the bottom tab: video walkthroughs, FAQ, phone number, WhatsApp link
- After any failed action, the error includes "Need help? Tap to WhatsApp us"

### 11. Performance & PWA
- Lazy-load below-the-fold sections; defer MarketTicker/AdBanner/FeaturedBrandsStrip until idle on mobile
- All images get explicit width/height + `loading="lazy"`
- Preload display serif
- PWA install prompt only after the user completes one meaningful action (don't nag on first visit)

---

## Technical details

**New / refactored files**
- `src/components/layout/MobileBottomNav.tsx` — Home · Find · Cart · Help, `md:hidden`
- `src/components/layout/Header.tsx` — compact mobile mode, search row, drilldown drawer, language switcher
- `src/components/layout/Layout.tsx` — bottom-nav slot, `pb-20 md:pb-0`, safe-area padding
- `src/components/help/WhatsappHelpFab.tsx` (new) — persistent help button
- `src/components/onboarding/WelcomeCarousel.tsx` (new) — 3-screen first-run flow
- `src/components/products/ProductListRow.tsx` (new) — Misumi-style row reused on Products/Directory/Storefront/Home
- `src/components/products/FiltersSheet.tsx` (new) — bottom sheet using `Sheet side="bottom"`
- `src/components/rfq/RfqWizard.tsx` (new) — 3-step wizard wrapper
- `src/components/ui/UndoToast.tsx` (new) — wraps Sonner with an action button
- `src/components/home/*` — restructure with new hero, trust strip, "How it works", FAQ, alternating bands
- `src/components/cart/CartDrawer.tsx` — `side="bottom"` mobile, `side="right"` md+
- `src/i18n/` (new, light) — JSON dictionaries for EN/HI/MR for CTAs, nav, form labels (full i18n later)
- `src/index.css` + `tailwind.config.ts` — display serif, surface tokens, softer shadows, base font 17px, `--header-h-mobile`, `--bottom-nav-h`
- `src/pages/Products.tsx`, `Directory.tsx`, `ProductPage.tsx`, `Storefront.tsx`, `Apply.tsx`, `account/*` — wire new components

**Breakpoint strategy**
- Mobile-first: base ≤ 640px, then `sm:` / `md:` / `lg:`
- `md` (≥768px) = grids return, `lg` (≥1024px) = sidebar layouts return

**Out of scope (this pass)**
- Backend, RLS, edge functions
- Full i18n machinery (light JSON dict only for key strings)
- Admin/CMS pages (low mobile traffic — separate pass)
- Color brand swap — navy/emerald stay; cream/sand/sage are surfaces only

---

## My top recommendations (read this even if you skim the rest)

1. **Replace every piece of jargon now.** This is the single biggest unlock for non-tech users. "Send a price request" beats "Submit RFQ" every time.
2. **Bilingual labels (EN + Hindi) for nav, CTAs, categories.** Cheap to ship, huge trust signal for the actual user base.
3. **Bottom tab bar with a Help tab + persistent WhatsApp help button.** Non-tech users want a way out; give it to them everywhere.
4. **Convert the RFQ submission into a 3-step wizard with auto-save.** This is your primary conversion flow — make it impossible to mess up.
5. **48px tap targets, 17px base font, plain-language errors with a "Get help" button.** Three small changes that compound into "this app respects me".
6. **First-run 3-screen welcome + a soft tooltip on the search bar.** Removes the "what do I do now?" moment that loses 30% of first-time users.
7. **Undo on every destructive action.** Forgiveness is the difference between a returning user and an uninstall.

---

## Validation
- Test at 360×800, 390×844, 414×896, 768×1024, 1024+, on all key routes
- No horizontal scroll, tap targets ≥48px, sticky bars never cover content, bottom nav doesn't overlap CartFab/WhatsApp FAB
- Read every visible string aloud — if it sounds like a developer wrote it, rewrite it
- Hand the phone to someone over 50 who has never used the app; they should complete an RFQ without being told how
- Lighthouse mobile ≥ 90 on Home and Products
