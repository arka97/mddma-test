import { useQuery } from "@tanstack/react-query";
import { listCirculars } from "@/repositories/circulars";
import { listAdsByPlacement } from "@/repositories/advertisements";
import { listPosts } from "@/repositories/posts";
import { qk } from "@/lib/queryKeys";

export function useCirculars(publishedOnly = true) {
  return useQuery({
    queryKey: qk.circulars.list(publishedOnly),
    queryFn: () => listCirculars({ publishedOnly }),
  });
}

export function useAds(placement: string) {
  return useQuery({
    queryKey: qk.ads.byPlacement(placement),
    queryFn: () => listAdsByPlacement(placement),
    enabled: Boolean(placement),
  });
}

export function usePosts(category?: string) {
  return useQuery({
    queryKey: qk.posts.list(category),
    queryFn: () => listPosts(category),
  });
}
