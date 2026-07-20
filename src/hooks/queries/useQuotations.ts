import { useQuery } from "@tanstack/react-query";
import {
  getReceivedQuotationBoard,
  getSentQuotationBoard,
} from "@/repositories/rfqQuotations";
import { qk } from "@/lib/queryKeys";

export function useSentQuotations(userId: string | undefined) {
  return useQuery({
    queryKey: qk.quotations.sent(userId ?? ""),
    queryFn: () => getSentQuotationBoard(userId as string),
    enabled: Boolean(userId),
  });
}

export function useReceivedQuotations(companyId: string | undefined) {
  return useQuery({
    queryKey: qk.quotations.received(companyId ?? ""),
    queryFn: () => getReceivedQuotationBoard(companyId as string),
    enabled: Boolean(companyId),
  });
}
