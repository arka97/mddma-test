import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

export async function listLikes(postIds: string[]) {
  if (postIds.length === 0) return { counts: {}, mine: new Set<string>() };
  const { data, error } = await (supabase.rpc as unknown as (
    fn: string,
    args: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: unknown }>)("get_post_like_summary", { _ids: postIds });
  if (error) throw new Error(friendlyErrorMessage(error as never));
  const counts: Record<string, number> = {};
  const mine = new Set<string>();
  ((data ?? []) as Array<{ post_id: string; like_count: number; liked: boolean }>).forEach((r) => {
    counts[r.post_id] = Number(r.like_count) || 0;
    if (r.liked) mine.add(r.post_id);
  });
  return { counts, mine };
}

export async function likePost(postId: string, userId: string) {
  const { error } = await supabase.from("post_likes").insert({ post_id: postId, user_id: userId });
  if (error && !/duplicate/i.test(error.message)) throw new Error(friendlyErrorMessage(error));
}

export async function unlikePost(postId: string, userId: string) {
  const { error } = await supabase
    .from("post_likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId);
  if (error) throw new Error(friendlyErrorMessage(error));
}
