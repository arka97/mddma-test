import { supabase } from "@/integrations/supabase/client";

export interface AnalystReport {
  id: string;
  kind: "supply" | "demand" | "price" | "policy";
  title: string;
  body: string | null;
  requires_paid: boolean;
  published_at: string;
  is_active: boolean;
}

export async function listAnalystReports(): Promise<AnalystReport[]> {
  const { data, error } = await (supabase as any)
    .from("analyst_reports")
    .select("*")
    .eq("is_active", true)
    .order("published_at", { ascending: false })
    .limit(8);
  if (error) throw error;
  return (data ?? []) as AnalystReport[];
}
