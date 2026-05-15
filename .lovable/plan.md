## Problem
The homepage gives no visual cue that this is MDDMA. The navbar shows only a small icon crest (no wordmark), and the hero section never mentions "MDDMA" or "Mumbai Dry Fruits and Dates Merchants Association".

## Solution

### 1. Navbar — add visible wordmark next to the logo mark
`src/components/layout/Header.tsx`
- Keep `Logo variant="mark"` (the crest) at the current `h-[60px] w-[60px]`
- Add a text span reading **"MDDMA"** immediately to the right of the crest, styled with `font-bold tracking-tight text-lg` (or `text-base` if space is tight on smaller desktops)
- Keep the existing nav link items, search bar, and buttons untouched
- Mobile sheet header: same mark + "MDDMA" text at a smaller size (`text-sm`)

### 2. Hero — surface the full association name
`src/components/home/HeroSection.tsx`
- Insert a new line **below the eyebrow, above the H1**:
  ```
  Mumbai Dry Fruits and Dates Merchants Association
  ```
  Styled as `text-sm uppercase tracking-widest text-muted-foreground` so it reads as institutional context without competing with the headline.
- Alternatively, fold it into the eyebrow if it feels too busy:
  ```
  Established 1930 · Mumbai Dry Fruits and Dates Merchants Association
  ```
  (preferred — keeps the vertical rhythm tight)

### 3. No other changes
- Do not modify `Logo.tsx` or the SVG assets
- Do not change hero headline copy, search bar, market ticker, or CTAs
- Do not alter footer, SEO tags, or any other page sections

## Files to edit
- `src/components/layout/Header.tsx`
- `src/components/home/HeroSection.tsx`