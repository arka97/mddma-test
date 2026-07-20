import { useQuery } from "@tanstack/react-query";
import { getRfqBoard, type RfqType } from "@/repositories/rfqListings";
import { qk } from "@/lib/queryKeys";

export function useRfqBoard(type: RfqType, enabled = true) {
  return useQuery({
    queryKey: qk.rfqs.active(type),
    queryFn: () => getRfqBoard(type),
    enabled,
  });
}
