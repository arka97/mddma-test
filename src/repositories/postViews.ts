import { supabase } from "@/integrations/supabase/client";

export async function recordView(postId: string, userId: string) {
  await supabase.from("post_views").insert({ post_id: postId, user_id: userId });
  // Ignore unique-constraint errors; one row per (post,user).
}

export async function viewCounts(postIds: string[]) {
  if (postIds.length === 0) return {} as Record<string, number>;
  const { data, error } = await (supabase.rpc as unknown as (
    fn: string,
    args: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: unknown }>)("get_post_view_summary", { _ids: postIds });
  if (error) return {};
  const counts: Record<string, number> = {};
  ((data ?? []) as Array<{ post_id: string; view_count: number }>).forEach((r) => {
    counts[r.post_id] = Number(r.view_count) || 0;
  });
  return counts;
}
