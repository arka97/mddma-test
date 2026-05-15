# Fix Broken `/account/verify` Navigation Links

## Problem
The "Verification" link in the account dropdown (and two other UI spots) points to `/account/verify`, which has no route defined in `src/routes.tsx`. This results in a 404.

## Files to Change

1. **`src/components/layout/Header.tsx`**
   - Remove the `Verification` dropdown menu item (line 100).

2. **`src/pages/account/ProfilePage.tsx`**
   - Remove the `Verify` link inside the profile page (line 70).

3. **`src/components/RFQModal.tsx`**
   - Remove the `Verify` link that appears in the RFQ modal when the user is near their daily limit (line 190).

## Outcome
- No remaining UI references to `/account/verify`.
- The `src/lib/kyc.ts` file can stay in place; it is not exposed to users.
- No other broken internal links were found in the codebase.