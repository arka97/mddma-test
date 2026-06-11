import { useQuery } from "@tanstack/react-query";
import { listHumorPosts } from "@/repositories/humor";
import { qk } from "@/lib/queryKeys";

export function useHumor(publishedOnly = true) {
  return useQuery({
    queryKey: qk.humor.list(publishedOnly),
    queryFn: () => listHumorPosts({ publishedOnly }),
  });
}
