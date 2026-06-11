# Fix: typed fields disappear on /account/company

## Root cause

`CompanyPage.tsx` loads the company row inside a `useEffect` whose dependency array is `[user]`. The `user` value comes from `AuthContext`, where `setUser(sess?.user ?? null)` runs on every Supabase auth state event (TOKEN_REFRESHED, USER_UPDATED, focus-driven re-checks). Each event creates a brand-new `user` object reference, so React re-runs the effect, re-fetches the company row, and calls `setForm(...)` — overwriting whatever the user has typed.

The Google Maps autocomplete is not the culprit; any field on the page is affected.

## Fix

In `src/pages/account/CompanyPage.tsx`:

1. Change the effect dependency from `[user]` to `[user?.id]` so reloads only happen when the actual signed-in user changes.
2. Add a `loadedRef` (or simple boolean state) guard so the company row is fetched only once per user id, even if the effect re-runs for any other reason. After the first successful load, skip subsequent loads for the same id.
3. Keep the existing post-save behavior (`await refresh()` + `navigate(0)` on first create) untouched — saving still re-syncs from the server.

No other files change. No backend, schema, or autocomplete changes.

## Out of scope

- AuthContext behavior (it's reasonable for `user` to update on auth events; the page just shouldn't treat every update as a reason to reset the form).
- The Google Places component.
