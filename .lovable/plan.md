# Rebuild `/about` — MDDMA About Us

Replace the current minimal `/about` with a comprehensive, MDDMA-branded page that combines real content from **mddma.com** (history, committee, contact) with the structural polish of NDFCI's About / Organisation / Contact pages — all in our existing navy + gold design system.

Single route, single file rewrite. No backend, no schema, no new dependencies.

## Page sections

```text
[ Hero — navy band ]
  About MDDMA
  Mumbai Dryfruits & Dates Merchants Association · Est. 1930
  Stat chips: 95+ Years · APMC Vashi · Founded by 11 Pioneer Traders

[ Our Story — long-form, 2-col ]
  Para 1: 1930 founding by importers/traders of dates & dry fruits
          from Muscat (Oman), Basra (Iraq), Iran and Afghanistan.
  Para 2: 1975 reconstruction → "The Bombay Kharek Bazar &
          Mewa Merchants Association".
  Para 3: APMC shift from Masjid Bunder to Navi Mumbai.
  Para 4: 1998 renaming → "The Bombay Dry Fruits & Dates Association"
          (Govt order NTC 1596/463(92), 4 May 1998), now MDDMA.
  Right column: gold-bordered "Founder Members" card listing all 11
  founders verbatim (S. Jagit Singh, Ishwardas Maganlal, Jadavji C.
  Kothari, Surendra Natwarlal, Jugaldas Damodar Mody, Haji Usman
  Haji Aziz, Mansukhlal H. Sheth, S. Harnam Singh, Vallabhdas Ramji,
  Tulsidas Pragji Khandhar, Himatlal H. Khandhar).

[ Aim · Vision · Mission — 3 cards ]
  AIM     — Protect and advance the interests of Mumbai's dry-fruits
            & dates trade community.
  VISION  — A structured, association-governed digital trade hub
            that preserves member margins and formalises the trade.
  MISSION — Verify members, govern fair trade, advise on regulations,
            and connect importers, traders and buyers across India.

[ Why MDDMA — 4×3 icon grid, 12 tiles ]
  Adapted from NDFCI's "Objectives & Goals" but rewritten for
  Mumbai dates/dry-fruits trade:
    Verified Trader Network · Trade Dispute Resolution · Govt &
    APMC Liaison · Market Intelligence · Quality & FSSAI Standards ·
    Import Policy Advocacy · Educational Seminars · Trade Show
    Representation · Networking & Brotherhood · Women in Trade ·
    Legal & Technical Guidance · Annual MDDMA Meet
  Each tile: lucide icon (gold) + title + 1-line description.

[ History Timeline — vertical ]
  1930 Foundation · 1975 Reconstruction · 1998 Renaming ·
  APMC Vashi shift · 2020s Digital Transformation
  Navy line + gold year medallions (reuse pattern from current page).

[ Office Bearers — leadership cards ]
  Real names from mddma.com/committe_members.html:
    • Shri Vijay Bhuta — President
    • Shri Chandan Mehta — President
    • Shri Girish Bhandary — Hon. Gen. Secretary
    • Shri Manesh Lund — Hon. Jt. Secretary
    • Shri Suresh Dama — Hon. Treasurer
    • Shri Rajendra Shah — Hon. Jt. Treasurer
  Card: gold circle with initials (no photos available) + name + role.

[ Committee Members — compact grid ]
  Shri Chandrashi Jesrani · Shri Mukesh Dattani · Shri Mahesh
  Jothawani · Shri Arjan Khatri · Shri Ramesh Soni · Shri Jatin
  Ashar · Shri Darshan Kapadia · Shri Dilip Jain.

[ Contact Us — 2-col block ]
  Left:
    Address: C/o E-29, APMC Market-I, Phase-II, Sector-19,
             Masala Market, Navi Mumbai 400 705
    Tel:     022-27650827 / 27666501
    Email:   vijaybhuta@gmail.com
    Hours:   Mon-Sat 10AM-6PM (from Footer)
  Right:
    Embedded Google Maps iframe pointing to APMC Market Vashi.
  CTA row: "Apply for Membership" → /apply ·
           "View Member Directory" → /directory
```

## Files

- **`src/pages/About.tsx`** — full rewrite into the structure above.
- No other files touched. Route already wired in `App.tsx`.

## Design rules

- Navy `bg-primary` hero; alternate `bg-background` / `bg-muted/50` between sections for vertical rhythm.
- All colors via semantic tokens (`primary`, `accent`, `muted-foreground`, `card`, `border`). No raw hex anywhere.
- `lucide-react` icons only (already a dep). Section icons in `text-accent` (gold).
- shadcn `Card` / `CardContent` for grouped content.
- Single `<h1>` in hero; sections use `<h2>`. Decorative icons get `aria-hidden`.
- Mobile: every grid collapses to 1 col; timeline stays vertical.

## SEO

- Set `<title>` "About MDDMA — Mumbai Dry Fruits & Dates Merchants Association" and a 150-char meta description via a small `useEffect` in About.tsx (no new dep).

## Out of scope

- No leadership photos (placeholders use initial avatars; user can supply images later).
- No CMS-backed leadership/committee data; hard-coded with a comment noting where to swap to DB later.
- No changes to Header, Footer, routing, auth, or any other page.
