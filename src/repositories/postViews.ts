import { supabase } from "@/integrations/supabase/client";

type RpcFn = (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;

/** View tracking goes through the security-definer RPC (direct inserts are blocked). */
export async function recordView(postId: string, _userId?: string) {
  await (supabase.rpc as unknown as RpcFn)("record_business_post_view", { _post_id: postId });
}

export async function viewCounts(postIds: string[]) {
  if (postIds.length === 0) return {} as Record<string, number>;
  const { data, error } = await (supabase.rpc as unknown as RpcFn)("get_post_view_summary", { _ids: postIds });
  if (error) return {};
  const counts: Record<string, number> = {};
  ((data ?? []) as Array<{ post_id: string; view_count: number }>).forEach((r) => {
    counts[r.post_id] = Number(r.view_count) || 0;
  });
  return counts;
}
