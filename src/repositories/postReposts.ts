import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

type RpcFn = (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;

/** Repost counts + whether the current user reposted, for a batch of posts. */
export async function listReposts(postIds: string[]) {
  if (postIds.length === 0) return { counts: {} as Record<string, number>, mine: new Set<string>() };
  const { data, error } = await (supabase.rpc as unknown as RpcFn)("get_post_repost_summary", { _ids: postIds });
  if (error) return { counts: {} as Record<string, number>, mine: new Set<string>() };
  const counts: Record<string, number> = {};
  const mine = new Set<string>();
  ((data ?? []) as Array<{ post_id: string; repost_count: number; reposted: boolean }>).forEach((r) => {
    counts[r.post_id] = Number(r.repost_count) || 0;
    if (r.reposted) mine.add(r.post_id);
  });
  return { counts, mine };
}

export async function setRepost(postId: string, reposted: boolean) {
  const { error } = await (supabase.rpc as unknown as RpcFn)("set_business_post_repost", {
    _post_id: postId,
    _reposted: reposted,
  });
  if (error) throw new Error(friendlyErrorMessage(error as never));
}
