
# Plan — Royal Heritage Design System v2

Goal: take the enhanced doc you drafted and make it the actual source of truth — tokens, Tailwind config, utilities, button variants, and the markdown reference all aligned with the May 2026 logo (Navy `#1B2F5E`, Burgundy `#7B1F2E`, Antique Gold `#C9A84C`, Ivory `#F8F4ED`).

Today the app is **navy + gold on near-white**. The logo is **navy + burgundy + gold on ivory**. Burgundy doesn't exist as a token, the canvas is too cool, and `--destructive` is a generic red instead of brand burgundy. This plan fixes all of that without touching business logic.

---

## 1. Token retune — `src/index.css`

Light mode (`:root`):

- `--background` → `45 40% 96%` (ivory canvas, was cool off-white)
- `--foreground` → `215 55% 23%` (navy text, slight shift)
- `--primary` → `215 55% 23%` (navy, recalibrated to logo hex)
- `--muted` → `45 30% 93%` (warm muted, was cool)
- `--accent` → `38 55% 54%` (antique gold, was brighter)
- `--ring` → `38 55% 54%`
- `--destructive` → `350 60% 30%` (burgundy — brand-aligned errors)
- Brand stack additions:
  - `--burgundy 350 60% 30%`, `--burgundy-light 350 50% 42%`, `--burgundy-dark 350 65% 20%`
  - Retune `--gold` to `38 55% 54%`, `--gold-light 45 75% 65%`, `--gold-dark 35 60% 38%`
  - `--cream` stays `45 40% 96%` (now matches `--background`)

Dark mode (`.dark`):

- Keep navy backgrounds, gold-as-primary
- Add burgundy tokens lifted for legibility (`350 55% 65%` ≈ `#D4707E`)

## 2. Tailwind extensions — `tailwind.config.ts`

- Add `burgundy: { DEFAULT, light, dark }` color group mirroring navy/gold
- No keyframe changes (animation budget unchanged)

## 3. Utilities & component classes — `src/index.css`

Add to `@layer utilities`:
- `.bg-burgundy`, `.bg-burgundy-light`, `.bg-burgundy-dark`
- `.text-burgundy`, `.text-burgundy-light`, `.text-warm-gray`
- `.border-burgundy`, `.border-navy`

Add to `@layer components`:
- `.burgundy-underline` — active nav indicator
- `.ivory-surface` — `bg-cream border border-gold/20 rounded-lg` warm panel

## 4. Button & badge variants — `src/components/ui/button.tsx`

Add three variants via `cva` (no fork of shadcn):
- `premium` → burgundy CTA (primary action)
- `gold` → gold on navy-dark (featured / heritage)
- `outline-navy` → navy outline secondary

`badge.tsx`: keep, document the existing `.heritage-badge` as the `heritage` style.

## 5. Logo component — `src/components/brand/Logo.tsx`

Already supports `mark | stacked | horizontal | typemark`. Doc and code disagree on names (`square` vs `stacked`, `type` vs `typemark`). Decision: keep current code names, update the doc's variant table to match. No code rename — call sites already wired.

## 6. Surface-level color sweep (presentation only)

Light, additive pass — no logic changes:
- `Header`: active link → `.burgundy-underline`
- `CartFab` count badge → burgundy
- Primary CTAs on `Apply`, `MembershipPlans`, `Login` → `variant="premium"`
- `Footer` background stays navy-dark (already correct)
- Page backgrounds: ensure pages rely on `--background` (now ivory) — spot-check `Index`, `Directory`, `Documents`

This is intentionally narrow. We won't repaint every component — only the high-visibility CTAs and the header active state, so the burgundy actually shows up.

## 7. Documentation — `src/content/docs/10-component-and-design.md`

Replace with your enhanced draft, with two corrections:
- Logo variant names match code (`mark`, `stacked`, `horizontal`, `typemark`)
- Add a short "Migration notes (May 2026)" callout at the top listing what changed from the previous palette so future devs aren't confused by old screenshots

## 8. Verification

- Visually QA: home, directory, product page, apply, login, footer in light + dark
- Confirm WCAG: navy/ivory ≥ 7:1, burgundy/ivory ≥ 5.5:1 (DevTools contrast check)
- `bun run build` clean

---

## Recommendations (call out if you want them in scope)

1. **Burgundy as `--destructive` is unusual.** Errors will look like brand actions. Safer: keep `--destructive` as red, add `--burgundy` separately. I'd recommend this — flagging because your doc currently maps them together.
2. **Gold contrast.** `#C9A84C` on ivory is ~3.2:1 — fails AA for text. Your doc already says "decorative only" — good. I'll add a lint-style note in the doc and avoid gold text in any component sweep.
3. **Dark mode burgundy.** Pure `#7B1F2E` on dark navy is unreadable (~2:1). I'll lift it to `#D4707E` as noted.
4. **Logo asset names.** Doc references `logo-horizontal.png` etc., actual files are `MDDMA_Royal_Heritage_Logo.svg` etc. I'll update the doc to use real filenames (SVGs, not PNGs).
5. **Optional follow-up (not in this plan):** introduce a `gold-divider` component matching the logo's gold-line-with-dot motif as a section separator. Reinforces brand identity. Say the word and I'll add it.

---

## Files touched

- `src/index.css` (tokens, utilities, components layer)
- `tailwind.config.ts` (burgundy color group)
- `src/components/ui/button.tsx` (variants)
- `src/components/layout/Header.tsx` (active state)
- `src/components/cart/CartFab.tsx` (badge color)
- `src/pages/Apply.tsx`, `Login.tsx`, `MembershipPlans.tsx` (primary CTA variants)
- `src/content/docs/10-component-and-design.md` (replace)

No DB, no edge functions, no business logic.

---

Confirm and I'll implement. Tell me if you want recommendation #1 (keep destructive red) and #5 (gold divider component) folded in.
