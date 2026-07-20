import { useQuery } from "@tanstack/react-query";
import { getHomeMetrics } from "@/repositories/homeMetrics";

const HOME_METRICS_QUERY_KEY = ["home", "metrics"] as const;

export function useHomeMetrics() {
  return useQuery({
    queryKey: HOME_METRICS_QUERY_KEY,
    queryFn: getHomeMetrics,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
