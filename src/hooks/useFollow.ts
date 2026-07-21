import { useCallback, useSyncExternalStore } from "react";
import { isFollowing, subscribe, toggleFollow, getFollowingCount } from "@/lib/follow";

/**
 * Subscribe a component to the follow state of a single entity.
 * Any FollowButton for the same id updates in lockstep.
 */
export function useFollow(id: string | null | undefined) {
  const following = useSyncExternalStore(
    subscribe,
    () => (id ? isFollowing(id) : false),
    () => false,
  );
  const toggle = useCallback(() => {
    if (id) toggleFollow(id);
  }, [id]);
  return { following, toggle };
}

/** Live count of everyone the current device follows. */
export function useFollowingCount() {
  return useSyncExternalStore(subscribe, getFollowingCount, () => 0);
}
