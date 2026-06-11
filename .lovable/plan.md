## Goal
Make it obvious whose app this is. Remove the "KGVPL" location chip next to the logo in the mobile header and show the full association name.

## Changes (src/components/layout/Header.tsx)

1. **Remove the location pill button** (the `<button>` rendering `MapPin + locationLabel` that shows "KGVPL" / "Pydhonie, Mumbai") on mobile.
2. **Replace the short "MDDMA" wordmark** next to the logo with the full association name so it's visible across breakpoints:
   - Mobile (default): `MDDMA` bold + tiny one-line tagline `Mumbai Dryfruits & Dates Merchants Association` underneath (two-line stacked label).
   - Desktop (`sm+`): same stacked label, slightly larger.
3. Drop the now-unused `locationLabel` variable and `MapPin` import.

No other files, no business logic, no routing changes. Members can still reach their company via the avatar dropdown → My Company / Dashboard.

## Technical notes
- Logo stays as `variant="mark"`.
- Use semantic tokens (`text-foreground`, `text-muted-foreground`) — no hardcoded colors.
- Keep header height roughly the same; the two-line label fits within the existing 48px row.
