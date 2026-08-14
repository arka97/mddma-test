import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

type RpcFn = (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;

export async function listLikes(postIds: string[]) {
  if (postIds.length === 0) return { counts: {}, mine: new Set<string>() };
  const { data, error } = await (supabase.rpc as unknown as RpcFn)("get_post_like_summary", { _ids: postIds });
  if (error) throw new Error(friendlyErrorMessage(error as never));
  const counts: Record<string, number> = {};
  const mine = new Set<string>();
  ((data ?? []) as Array<{ post_id: string; like_count: number; liked: boolean }>).forEach((r) => {
    counts[r.post_id] = Number(r.like_count) || 0;
    if (r.liked) mine.add(r.post_id);
  });
  return { counts, mine };
}

/** Likes go through the security-definer RPC — direct table writes are blocked. */
async function setLike(postId: string, liked: boolean) {
  const { error } = await (supabase.rpc as unknown as RpcFn)("set_business_post_like", {
    _post_id: postId,
    _liked: liked,
  });
  if (error) throw new Error(friendlyErrorMessage(error as never));
}

export async function likePost(postId: string, _userId?: string) {
  await setLike(postId, true);
}

export async function unlikePost(postId: string, _userId?: string) {
  await setLike(postId, false);
}
