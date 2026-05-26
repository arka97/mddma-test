import { useQuery } from "@tanstack/react-query";
import { listMarketSignals } from "@/repositories/marketSignals";
import { listAnalystReports } from "@/repositories/analystReports";

export function useMarketSignals() {
  return useQuery({
    queryKey: ["market_signals"],
    queryFn: listMarketSignals,
    staleTime: 60_000,
  });
}

export function useAnalystReports() {
  return useQuery({
    queryKey: ["analyst_reports"],
    queryFn: listAnalystReports,
    staleTime: 60_000,
  });
}
