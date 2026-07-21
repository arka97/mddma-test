## Goal
Add a second admin switch — "Verification not required" — that mirrors the existing "Open all features to everyone" toggle. When ON, any signed-in user can do everything a verified business can (post to Market, comment, vote polls, upload media, submit RFQs/quotations, start deal rooms, send messages), without needing an approved verified company.

Guests still cannot interact — they must sign up first.

## Backend

1. Seed a new `app_settings` row `verification_open_to_all` (default `false`).
2. Add SQL helper `public.is_verification_open()` (STABLE SECURITY DEFINER) returning the flag value.
3. Update `public.has_verified_business()` so it returns `true` whenever `auth.uid() IS NOT NULL AND is_verification_open()`; otherwise fall back to the current verified-company check. This alone unlocks every RPC that gates on it: `create_business_post`, `create_business_poll_post`, `add_business_comment`, `cast_business_poll_vote`, `set_business_post_like`.
4. Patch the two RPCs that re-check the verified-company condition inline instead of calling the helper:
   - `start_deal_room` — allow when `is_verification_open()` is true (build a lightweight "my_company" using any company the user owns/is a member of; if none exists, reject with a clearer message asking them to create one first).
   - `send_deal_message` — same treatment for sender company lookup.
5. Update the community storage RLS on `community-media` so upload/read is permitted when the user is signed in AND (`is_features_open()` OR `is_verification_open()` OR verified), matching the pattern already used for feature-open.
6. Keep admin-only checks (pin/hide, moderation, role escalation) unchanged.

Note: the `start_deal_room` / `send_deal_message` path still needs a company row to attribute messages to. When verification-open is ON, we relax the `is_verified / review_status='approved'` requirement but still require the user to belong to some company. This matches the intent ("act like verified") without breaking the two-sided data model.

## Frontend

1. Extend `src/hooks/useAppSettings.ts` with `useVerificationOpenFlag()` + `setVerificationOpenFlag()` — same shape and realtime subscription as the features flag.
2. In `src/components/admin/FeatureAccessTab.tsx`, render a second card below the existing one:
   - Label: "Verification not required"
   - Helper text: signed-in users can post, quote, start deal rooms and message without submitting business evidence. Guests must still sign up. Admin/moderation controls stay locked.
   - Independent Switch wired to the new flag.
3. No other UI changes — the gating helpers propagate through existing RPCs and RLS.

## Verification

- With flag ON, sign in as a brand-new account (no company) → posting a message on `/market`, liking, voting a poll and commenting all succeed.
- Starting a deal room / sending a message still requires the user to be attached to a company (surface a clear error otherwise).
- With flag OFF, behaviour reverts to today's verified-only rules.
- Guests (signed out) still see the sign-in prompt.

## Technical details

- Migration order per project convention: helper function → update `has_verified_business` → patch `start_deal_room` / `send_deal_message` → seed `app_settings` row → storage policy update.
- All new SQL uses `SET search_path = public` and `SECURITY DEFINER` where the current helpers do.
- No changes to `is_paid_or_admin` / `is_features_open` — the two toggles remain independent so admins can open features without dropping the verification wall, or vice versa.
