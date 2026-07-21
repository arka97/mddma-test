Flip the existing admin "Open all features to everyone" switch to ON.

## Steps
1. Update the `features_open_to_all` row in `public.app_settings` to `true` via a data insert (UPDATE).
2. The existing `useAppSettings` realtime subscription will propagate the change — no code changes, no rebuild needed.

## Effect
- Guests, free members, paid, and broker users all get paid-tier UX (Market feed, RFQ contact reveals, link previews, etc.).
- Admin-only surfaces (moderation, admin panel, admin actions) remain protected — those check the real `admin` role, not this flag.
- Fully reversible any time from Admin → Moderation → Feature Access.