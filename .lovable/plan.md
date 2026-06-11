## Floating WhatsApp button on seller pages

A circular WhatsApp FAB appears on `/products/:slug`, `/store/:slug`, and `/brands/:slug`. On mobile it sits at bottom-right, just above the Account tab in the bottom nav. On desktop it sits at the bottom-right corner. Tap behavior depends on membership:

- **Paid member / broker / admin** → opens `https://wa.me/<seller-number>?text=...` in a new tab with a prefilled "Hi, I saw this on MDDMA…" message.
- **Free member / guest** → routes to `/membership` (CTA toast: "Unlock direct contact — upgrade to a Paid membership").

If a seller has no number on file, the button is hidden entirely.

### What gets built

1. **Backend — paid-only contact RPC**
   - New SECURITY DEFINER function `public.get_company_whatsapp(_company_id uuid)` returning `text` (the phone). Returns the company's `phone` only when `auth.uid()` has role `paid_member`, `broker`, or `admin`; otherwise returns `NULL`. Grants `EXECUTE` to `authenticated`. No new tables, no schema changes to `companies`.

2. **Frontend — shared component**
   - `src/components/seller/WhatsappFab.tsx` — fixed-position round button using the existing accent token. Props: `companyId`, `companySlug`, `contextLabel` (e.g. product name, brand name, firm name).
   - Internal hook `useSellerWhatsapp(companyId)` wraps the RPC via React Query, paid-gated client-side (skips the RPC entirely for guests/free).
   - Positioning: `fixed right-4 z-40`, `bottom-[calc(env(safe-area-inset-bottom)+72px)] lg:bottom-6` so it clears the 64px mobile tab bar plus a small gap, and sits clean on desktop. Hides itself when the existing `StickyContactBar` is visible on Storefront to avoid stacking — Storefront mounts the FAB above the sticky bar by adjusting its bottom offset there only.
   - Click handler: if paid → `window.open(wa.me link)`; otherwise → `navigate('/membership')` and a sonner toast.

3. **Page integration (presentational only)**
   - `src/pages/ProductPage.tsx` → mount `<WhatsappFab companyId={product.company_id} contextLabel={product.name} />`.
   - `src/pages/Storefront.tsx` → mount `<WhatsappFab companyId={company.id} contextLabel={member.firmName} />` with the storefront-specific stacked offset.
   - `src/pages/BrandPage.tsx` → mount `<WhatsappFab companyId={brand.company_id} contextLabel={brand.name} />`.

### Out of scope

- No changes to existing in-page "WhatsApp / Call / Email" buttons on Storefront.
- No new public exposure of `companies.phone` — masking via `companies_public` view stays.
- No analytics/event tracking added in this pass.

### Technical details

- RPC signature:
  ```sql
  create or replace function public.get_company_whatsapp(_company_id uuid)
  returns text language sql stable security definer set search_path = public as $$
    select c.phone
    from public.companies c
    where c.id = _company_id
      and (
        public.has_role(auth.uid(), 'paid_member')
        or public.has_role(auth.uid(), 'broker')
        or public.has_role(auth.uid(), 'admin')
      );
  $$;
  grant execute on function public.get_company_whatsapp(uuid) to authenticated;
  ```
- Client: `supabase.rpc('get_company_whatsapp', { _company_id })`, cached under `['seller-whatsapp', companyId]`, only enabled when `effectiveRole` is paid/broker/admin.
- Link builder: strip non-digits, prepend `91` if length is 10 and no country code, then `https://wa.me/<digits>?text=<encoded message>`.
- Z-index `z-40` to match the bottom tab bar and stay below dialogs (`z-50`).
