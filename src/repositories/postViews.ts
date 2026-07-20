import { supabase } from "@/integrations/supabase/client";
import { getBusinessPostEngagement } from "@/repositories/communityPosts";

export async function recordView(postId: string, _userId?: string) {
  await supabase.rpc("record_business_post_view", { _post_id: postId });
}

export async function viewCounts(postIds: string[]) {
  const engagement = await getBusinessPostEngagement(postIds);
  return Object.entries(engagement).reduce<Record<string, number>>((map, [postId, metrics]) => {
    map[postId] = metrics.viewCount;
    return map;
  }, {});
}
