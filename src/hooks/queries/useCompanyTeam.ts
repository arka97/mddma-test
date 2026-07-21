import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type CompanyTeamMember = {
  user_id: string;
  role: Database["public"]["Enums"]["company_member_role"];
  full_name: string;
  avatar_url: string | null;
  joined_at: string;
};

export function useCompanyTeam(companyId: string | undefined) {
  return useQuery({
    queryKey: ["company_team", companyId],
    enabled: Boolean(companyId),
    staleTime: 60_000,
    queryFn: async (): Promise<CompanyTeamMember[]> => {
      const { data, error } = await supabase.rpc("get_company_team_public", {
        _company_id: companyId!,
      });
      if (error) throw error;
      return (data ?? []) as CompanyTeamMember[];
    },
  });
}
