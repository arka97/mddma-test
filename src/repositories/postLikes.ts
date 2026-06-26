import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

export async function listLikes(postIds: string[]) {
  if (postIds.length === 0) return { counts: {}, mine: new Set<string>() };
  const { data, error } = await supabase
    .from("post_likes")
    .select("post_id, user_id")
    .in("post_id", postIds);
  if (error) throw new Error(friendlyErrorMessage(error));
  const counts: Record<string, number> = {};
  const { data: userData } = await supabase.auth.getUser();
  const me = userData.user?.id;
  const mine = new Set<string>();
  (data ?? []).forEach((r: { post_id: string; user_id: string }) => {
    counts[r.post_id] = (counts[r.post_id] ?? 0) + 1;
    if (r.user_id === me) mine.add(r.post_id);
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
