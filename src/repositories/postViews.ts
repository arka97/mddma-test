import { callCommunityRpc } from "@/repositories/communityRpc";
import { getBusinessPostEngagement } from "@/repositories/communityPosts";

export async function recordView(postId: string, _userId?: string) {
  await callCommunityRpc<null>("record_business_post_view", { _post_id: postId });
}

export async function viewCounts(postIds: string[]) {
  const engagement = await getBusinessPostEngagement(postIds);
  return Object.entries(engagement).reduce<Record<string, number>>((map, [postId, metrics]) => {
    map[postId] = metrics.viewCount;
    return map;
  }, {});
}
