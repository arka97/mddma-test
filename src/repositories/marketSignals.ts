import { supabase } from "@/integrations/supabase/client";

export interface MarketSignal {
  id: string;
  commodity_name: string;
  origin: string | null;
  category: string | null;
  price_min: number | null;
  price_max: number | null;
  unit: string;
  trend: "up" | "down" | "flat";
  demand: "high" | "medium" | "low";
  supply: "tight" | "tightening" | "stable" | "increasing";
  inquiries_week: number;
  analyst_note: string | null;
  requires_paid: boolean;
  is_active: boolean;
  sort_order: number;
  updated_at: string;
}

export async function listMarketSignals(): Promise<MarketSignal[]> {
  const { data, error } = await (supabase as any)
    .from("market_signals")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as MarketSignal[];
}
