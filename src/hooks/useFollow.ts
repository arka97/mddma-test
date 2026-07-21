import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Live follow state for a single company, backed by `public.follows`.
 *
 * - The set of companies the current user follows is fetched once and cached;
 *   individual FollowButtons read the boolean off the set so they all stay in
 *   sync without one query per row.
 * - `toggle()` is optimistic — flips the cached set, writes to Supabase, and
 *   rolls back on error.
 * - Signed-out users get a stable `following=false` and a no-op toggle (the
 *   caller decides whether to show the button at all).
 */

const followingSetKey = (userId: string | null) => ["follows", "set", userId] as const;

async function fetchFollowingSet(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("follows")
    .select("followed_company_id")
    .eq("follower_user_id", userId);
  if (error) throw error;
  return new Set((data ?? []).map((row) => row.followed_company_id));
}

export function useFollow(companyId: string | null | undefined) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const qc = useQueryClient();

  const { data: followingSet } = useQuery({
    queryKey: followingSetKey(userId),
    queryFn: () => fetchFollowingSet(userId as string),
    enabled: !!userId,
    staleTime: 60_000,
  });

  const following = !!(companyId && followingSet?.has(companyId));

  const mutation = useMutation({
    mutationFn: async (nextFollowing: boolean) => {
      if (!userId || !companyId) throw new Error("Sign in to follow businesses");
      if (nextFollowing) {
        const { error } = await supabase
          .from("follows")
          .insert({ follower_user_id: userId, followed_company_id: companyId });
        // Ignore unique-violation races — the row we wanted already exists.
        if (error && error.code !== "23505") throw error;
      } else {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_user_id", userId)
          .eq("followed_company_id", companyId);
        if (error) throw error;
      }
    },
    onMutate: async (nextFollowing: boolean) => {
      if (!userId || !companyId) return;
      await qc.cancelQueries({ queryKey: followingSetKey(userId) });
      const prev = qc.getQueryData<Set<string>>(followingSetKey(userId));
      const next = new Set(prev ?? []);
      if (nextFollowing) next.add(companyId);
      else next.delete(companyId);
      qc.setQueryData(followingSetKey(userId), next);
      return { prev };
    },
    onError: (_err, _next, ctx) => {
      if (!userId) return;
      if (ctx?.prev) qc.setQueryData(followingSetKey(userId), ctx.prev);
    },
    onSettled: () => {
      if (!userId) return;
      qc.invalidateQueries({ queryKey: followingSetKey(userId) });
    },
  });

  const toggle = useCallback(() => {
    if (!companyId) return;
    if (!userId) return; // caller should gate the button; noop here is safe
    mutation.mutate(!following);
  }, [companyId, userId, following, mutation]);

  return { following, toggle, isPending: mutation.isPending };
}

/** Live count of companies the current user follows. Zero when signed out. */
export function useFollowingCount(): number {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const { data } = useQuery({
    queryKey: followingSetKey(userId),
    queryFn: () => fetchFollowingSet(userId as string),
    enabled: !!userId,
    staleTime: 60_000,
  });
  return data?.size ?? 0;
}
