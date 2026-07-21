/**
 * Follow store — thin re-export of the react-query backed hooks.
 *
 * The old localStorage shim (kept during the X reskin while there was no
 * `follows` table) has been retired. Follow state is now persisted in
 * `public.follows` and every FollowButton for the same company id stays in
 * sync via the shared query cache.
 *
 * Kept as a module so any lingering `@/lib/follow` import surface fails at
 * type-check time instead of silently reading stale localStorage.
 */
export { useFollow, useFollowingCount, useFollowingSet } from "@/hooks/useFollow";
