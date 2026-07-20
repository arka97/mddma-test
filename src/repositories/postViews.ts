import { callCommunityRpc } from "@/repositories/communityRpc";

export async function recordView(postId: string, _userId?: string) {
  await callCommunityRpc<null>("record_business_post_view", { _post_id: postId });
}
