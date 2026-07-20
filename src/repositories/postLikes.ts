import { friendlyErrorMessage } from "@/lib/errors";
import { callCommunityRpc } from "@/repositories/communityRpc";
import { getBusinessPostEngagement } from "@/repositories/communityPosts";

export async function listLikes(postIds: string[]) {
  const engagement = await getBusinessPostEngagement(postIds);
  const counts: Record<string, number> = {};
  const mine = new Set<string>();
  Object.entries(engagement).forEach(([postId, metrics]) => {
    counts[postId] = metrics.likeCount;
    if (metrics.liked) mine.add(postId);
  });
  return { counts, mine };
}

export async function setBusinessPostLike(postId: string, liked: boolean) {
  const { data, error } = await callCommunityRpc<boolean>("set_business_post_like", {
    _post_id: postId,
    _liked: liked,
  });
  if (error) throw new Error(friendlyErrorMessage(error));
  return Boolean(data);
}

// Compatibility wrappers for older callers. The authenticated user is always
// derived by the database RPC; caller-provided user IDs are intentionally ignored.
export async function likePost(postId: string, _userId?: string) {
  return setBusinessPostLike(postId, true);
}

export async function unlikePost(postId: string, _userId?: string) {
  return setBusinessPostLike(postId, false);
}
