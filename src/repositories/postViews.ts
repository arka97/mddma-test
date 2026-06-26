import { supabase } from "@/integrations/supabase/client";

export async function recordView(postId: string, userId: string) {
  await supabase.from("post_views").insert({ post_id: postId, user_id: userId });
  // Ignore unique-constraint errors; one row per (post,user).
}

export async function viewCounts(postIds: string[]) {
  if (postIds.length === 0) return {} as Record<string, number>;
  const { data } = await supabase.from("post_views").select("post_id").in("post_id", postIds);
  const counts: Record<string, number> = {};
  (data ?? []).forEach((r: { post_id: string }) => {
    counts[r.post_id] = (counts[r.post_id] ?? 0) + 1;
  });
  return counts;
}
