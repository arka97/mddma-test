# Icon-circle feed chips (Gondal APMC style)

Replace the flat text pills at the top of the home feed with a row of circular icon
buttons + labels underneath, in the style of the reference screenshot.

## What it looks like

```text
  ( ⚡ )   ( ▶ )   ( ★ )   ( 📄 )   ( ₹ )   ( ! )   ...
 Updates   Buzz  Following Bulletin Price   Market
                                   Signals  Alerts
```

- Each chip = a 56px circle (48px on small phones) with a dashed ring, white/card
  fill, and a coloured icon inside, with a 2-line label below.
- Active chip: solid primary (burgundy) ring + tinted fill + gold icon, label turns
  bold foreground. Inactive: muted ring, muted label.
- The row stays horizontally scrollable (snap), showing ~4.5 chips at a time on
  mobile so users know to swipe; on desktop the whole set fits in one row, centred.
- Sits on a subtle banded background strip so the circles read as a distinct
  navigation band, like the reference — but using existing burgundy/gold tokens,
  not the reference's green/teal.

## Icons per chip

| Chip | Icon (lucide) |
|---|---|
| Updates | Newspaper |
| Buzz | PlayCircle |
| Following | UserCheck |
| Bulletin | ScrollText |
| Price Signals | IndianRupee |
| Market Alerts | Siren |
| Sourcing | Search |
| Member News | Users |
| Polls | BarChart3 |

## Behaviour kept as-is

- Same chip ids and order, so swipe-between-chips, the Reels/Buzz view, and all
  feed filtering keep working unchanged.
- Same sticky/hide-on-scroll chrome container and z-index rules; only the inner
  rendering changes, so the mobile-chrome regression tests keep passing.
- Chips remain buttons with `aria-pressed`, keyboard focusable.

## Technical notes

- Only `src/components/market/TopicChips.tsx` changes: add an `icon` field to the
  `CHIPS` array and render circle + label instead of the pill.
- Colours come from semantic tokens (`primary`, `accent`/gold, `muted-foreground`,
  `card`, `border`) — no hard-coded hex.
- Height of the chip band grows (~76px vs ~34px). `Home.tsx` measures the chrome
  height at runtime for the Buzz/reels top inset, so no constant needs updating.
