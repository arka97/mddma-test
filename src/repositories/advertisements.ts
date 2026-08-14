import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

export interface AdRow {
  id: string;
  title: string;
  image_url: string;
  mobile_image_url: string | null;
  link_url: string | null;
  placement: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  priority: number;
  impressions: number;
  clicks: number;
  image_aspect: number | null;
  focal_y: number | null;
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
    .or(`end_date.is.null,end_date.gte.${today}`)
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []) as AdRow[];
}
