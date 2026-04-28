import { supabase } from "@/integrations/supabase/client";
import { extractError } from "@/lib/errors";

export interface AdRow {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  placement: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  impressions: number;
  clicks: number;
  created_at: string;
  updated_at: string;
}

export async function listAdsByPlacement(placement: string) {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("advertisements")
    .select("*")
    .eq("placement", placement)
    .eq("is_active", true)
    .lte("start_date", today)
    .or(`end_date.is.null,end_date.gte.${today}`);
  if (error) throw new Error(extractError(error));
  return (data ?? []) as AdRow[];
}
