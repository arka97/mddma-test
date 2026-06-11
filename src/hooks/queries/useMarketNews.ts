import { useQuery } from "@tanstack/react-query";
import { listMarketNews } from "@/repositories/marketNews";
import { qk } from "@/lib/queryKeys";

export function useMarketNews(publishedOnly = true) {
  return useQuery({
    queryKey: qk.marketNews.list(publishedOnly),
    queryFn: () => listMarketNews({ publishedOnly }),
  });
}
