import { friendlyErrorMessage } from "@/lib/errors";
import { callCommunityRpc } from "@/repositories/communityRpc";

export async function setBusinessPostLike(postId: string, liked: boolean) {
  const { data, error } = await callCommunityRpc<boolean>("set_business_post_like", {
    _post_id: postId,
    _liked: liked,
  });
  if (error) throw new Error(friendlyErrorMessage(error));
  return Boolean(data);
}

// Compatibility wrappers for any older callers. The authenticated user is always
// derived by the database RPC; caller-provided user IDs are intentionally ignored.
export async function likePost(postId: string, _userId?: string) {
  return setBusinessPostLike(postId, true);
}

export async function unlikePost(postId: string, _userId?: string) {
  return setBusinessPostLike(postId, false);
}
