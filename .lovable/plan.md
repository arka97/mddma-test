# Plan: Polish the floating WhatsApp button

Update `src/components/seller/WhatsappFab.tsx` only. No backend, RPC, gating, positioning, or page-integration changes — paid gating, route handling, and mount points on Product / Storefront / Brand stay exactly as they are today.

## Visual changes

1. **Replace icon** — swap the lucide `MessageCircle` for the official WhatsApp glyph as an inline SVG (same path as the snippet), `w-7 h-7`, `fill="currentColor"`, white. Drop the `MessageCircle` import.
2. **Button surface** — keep the 56px (`w-14 h-14`) circle but use the inspiration's brand colors via arbitrary Tailwind values so styling lives with the component (no token churn):
   - base: `bg-[#25D366]`
   - hover: `hover:bg-[#1ebe57]`
   - glow: `shadow-[0_8px_24px_rgba(37,211,102,0.45)]`
   - keep `ring-2 ring-background` and the existing `hover:scale-105 active:scale-95`.
3. **Ping halo** — replace the two static green overlays with a single `absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping` span (matches snippet, less visual noise than two layers).
4. **Markup shape** — keep the outer wrapper that holds the `--fab-bottom` CSS var and `right-4 / lg:right-6` positioning so mobile/desktop placement and the `mobileBottomOffset` prop continue to work. The `<button>` stays the click target (we keep the paid-gated `handleClick`, not an `<a href>` like the snippet, because guests must be routed to `/membership` instead of `wa.me`).
5. **Accessibility** — keep `aria-label="Chat with seller on WhatsApp"` on the button; mark the halo and SVG `aria-hidden`.

## Out of scope

- `get_company_whatsapp` RPC and paid-member gating
- `useRole` / `useAuth` / `useQuery` logic and the upgrade-nudge toast
- Positioning offsets, z-index, safe-area handling
- Any change to `ProductPage.tsx`, `Storefront.tsx`, `BrandPage.tsx`
