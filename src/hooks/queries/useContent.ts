import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { listCirculars } from "@/repositories/circulars";
import { listAdsByPlacement } from "@/repositories/advertisements";
import { listPosts } from "@/repositories/posts";

export function useCirculars(publishedOnly = true) {
  return useQuery({
    queryKey: qk.circulars.list(publishedOnly),
    queryFn: () => listCirculars({ publishedOnly }),
    staleTime: 60_000,
  });
}

export function useAds(placement: string) {
  return useQuery({
    queryKey: qk.ads.byPlacement(placement),
    queryFn: () => listAdsByPlacement(placement),
    staleTime: 5 * 60_000,
  });
}

export function usePosts(category?: string) {
  return useQuery({
    queryKey: qk.posts.list(category),
    queryFn: () => listPosts(category),
    staleTime: 30_000,
  });
}
