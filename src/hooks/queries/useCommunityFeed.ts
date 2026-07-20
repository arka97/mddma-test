import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import {
  getBusinessPostEngagement,
  listCommunityBusinesses,
  listFeedPosts,
  type TopicTag,
} from "@/repositories/communityPosts";

export function useCommunityFeed(topic: TopicTag | "all") {
  return useQuery({
    queryKey: qk.community.feed(topic),
    queryFn: async () => {
      const posts = await listFeedPosts(topic === "all" ? undefined : topic);
      const [businesses, engagement] = await Promise.all([
        listCommunityBusinesses(posts.map((post) => post.author_id)),
        getBusinessPostEngagement(posts.map((post) => post.id)),
      ]);
      return { posts, businesses, engagement };
    },
    staleTime: 20_000,
    retry: 1,
  });
}
