import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useFollowerCount(companyId: string | undefined) {
  return useQuery({
    queryKey: ["company_follower_count", companyId],
    enabled: Boolean(companyId),
    staleTime: 60_000,
    queryFn: async (): Promise<number> => {
      const { data, error } = await supabase.rpc("get_company_follower_count", {
        _company_id: companyId!,
      });
      if (error) throw error;
      return typeof data === "number" ? data : 0;
    },
  });
}
