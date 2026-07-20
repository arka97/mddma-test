import { useQuery } from "@tanstack/react-query";
import { getDealRoom, listDealMessages, listDealRooms } from "@/repositories/dealRooms";
import { qk } from "@/lib/queryKeys";

export function useDealRooms(enabled = true) {
  return useQuery({
    queryKey: qk.dealRooms.list(),
    queryFn: listDealRooms,
    enabled,
  });
}

export function useDealRoom(id: string | undefined) {
  return useQuery({
    queryKey: qk.dealRooms.detail(id ?? ""),
    queryFn: () => getDealRoom(id as string),
    enabled: Boolean(id),
  });
}

export function useDealMessages(roomId: string | undefined) {
  return useQuery({
    queryKey: qk.dealRooms.messages(roomId ?? ""),
    queryFn: () => listDealMessages(roomId as string),
    enabled: Boolean(roomId),
    refetchInterval: 4000,
    refetchIntervalInBackground: false,
  });
}