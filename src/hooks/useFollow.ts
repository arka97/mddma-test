import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { friendlyErrorMessage } from "@/lib/errors";

/**
 * Live follow state, backed by `public.follows`.
 *
 * A follow row points at EITHER a business (`followed_company_id`) or an
 * individual member (`followed_user_id`), so every non-anonymous author is
 * followable even when their business is still pending review.
 *
 * - The viewer's whole follow set is fetched once and cached; individual
 *   FollowButtons read a boolean off it so they all stay in sync.
 * - `toggle()` is optimistic and rolls back with a toast on error.
 */

export type FollowTarget = { type: "company" | "user"; id: string };

export interface FollowSet {
  companies: Set<string>;
  users: Set<string>;
}

const followSetKey = (userId: string | null) => ["follows", "set", userId] as const;
const followAuthorsKey = (userId: string | null) => ["follows", "authors", userId] as const;

const emptySet: FollowSet = { companies: new Set(), users: new Set() };

async function fetchFollowSet(userId: string): Promise<FollowSet> {
  const { data, error } = await supabase
    .from("follows")
    .select("followed_company_id, followed_user_id")
    .eq("follower_user_id", userId);
  if (error) throw error;
  const companies = new Set<string>();
  const users = new Set<string>();
  for (const row of data ?? []) {
    if (row.followed_company_id) companies.add(row.followed_company_id);
    if (row.followed_user_id) users.add(row.followed_user_id);
  }
  return { companies, users };
}

function has(set: FollowSet | undefined, target: FollowTarget | null | undefined) {
  if (!set || !target) return false;
  return target.type === "company" ? set.companies.has(target.id) : set.users.has(target.id);
}

function withTarget(set: FollowSet, target: FollowTarget, following: boolean): FollowSet {
  const next: FollowSet = { companies: new Set(set.companies), users: new Set(set.users) };
  const bucket = target.type === "company" ? next.companies : next.users;
  if (following) bucket.add(target.id);
  else bucket.delete(target.id);
  return next;
}

export function useFollowSet(): FollowSet {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const { data } = useQuery({
    queryKey: followSetKey(userId),
    queryFn: () => fetchFollowSet(userId as string),
    enabled: !!userId,
    staleTime: 60_000,
  });
  return data ?? emptySet;
}

export function useFollow(target: FollowTarget | null | undefined) {
  const { user } = useAuth();
  const { toast } = useToast();
  const userId = user?.id ?? null;
  const qc = useQueryClient();

  const { data: followSet } = useQuery({
    queryKey: followSetKey(userId),
    queryFn: () => fetchFollowSet(userId as string),
    enabled: !!userId,
    staleTime: 60_000,
  });

  const following = has(followSet, target);

  const mutation = useMutation({
    mutationFn: async (nextFollowing: boolean) => {
      if (!userId || !target) throw new Error("Sign in to follow");
      const column = target.type === "company" ? "followed_company_id" : "followed_user_id";
      if (nextFollowing) {
        const row =
          target.type === "company"
            ? { follower_user_id: userId, followed_company_id: target.id }
            : { follower_user_id: userId, followed_user_id: target.id };
        const { error } = await supabase.from("follows").insert(row);
        // Ignore unique-violation races — the row we wanted already exists.
        if (error && error.code !== "23505") throw error;
      } else {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_user_id", userId)
          .eq(column, target.id);
        if (error) throw error;
      }
    },
    onMutate: async (nextFollowing: boolean) => {
      if (!userId || !target) return;
      await qc.cancelQueries({ queryKey: followSetKey(userId) });
      const prev = qc.getQueryData<FollowSet>(followSetKey(userId)) ?? emptySet;
      qc.setQueryData(followSetKey(userId), withTarget(prev, target, nextFollowing));
      return { prev };
    },
    onError: (err, _next, ctx) => {
      if (userId && ctx?.prev) qc.setQueryData(followSetKey(userId), ctx.prev);
      toast({
        title: "Couldn't update follow",
        description: friendlyErrorMessage(err),
        variant: "destructive",
      });
    },
    onSettled: () => {
      if (!userId) return;
      qc.invalidateQueries({ queryKey: followSetKey(userId) });
      qc.invalidateQueries({ queryKey: followAuthorsKey(userId) });
      qc.invalidateQueries({ queryKey: ["follows", "suggested"] });
    },
  });

  const toggle = useCallback(() => {
    if (!target || !userId) return; // caller gates the button; noop is safe
    mutation.mutate(!following);
  }, [target, userId, following, mutation]);

  return { following, toggle, isPending: mutation.isPending };
}

/**
 * Author user ids behind everything the viewer follows — owners and team of
 * followed businesses (regardless of review status) plus followed people.
 */
export function useFollowedAuthorIds(): { authorIds: Set<string>; isLoading: boolean } {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const { data, isLoading } = useQuery({
    queryKey: followAuthorsKey(userId),
    queryFn: async () => {
      const { data: rows, error } = await supabase.rpc("get_followed_author_ids");
      if (error) throw error;
      return new Set<string>((rows ?? []) as string[]);
    },
    enabled: !!userId,
    staleTime: 30_000,
  });
  return { authorIds: data ?? new Set<string>(), isLoading: !!userId && isLoading };
}

/** Live set of company ids the current user follows. Empty when signed out. */
export function useFollowingSet(): Set<string> {
  return useFollowSet().companies;
}

/** Live count of everything the current user follows. Zero when signed out. */
export function useFollowingCount(): number {
  const set = useFollowSet();
  return set.companies.size + set.users.size;
}
