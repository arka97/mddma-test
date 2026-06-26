import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

export type RfqType = "buy" | "sell";
export type QtyUnit = "kg" | "MT" | "box";
export type PriceUnit = "per kg" | "per MT";

export interface RfqListingRow {
  id: string;
  company_id: string | null;
  posted_by: string;
  listing_type: RfqType;
  commodity: string;
  quantity_min: number;
  quantity_max: number;
  quantity_unit: QtyUnit;
  price_min: number;
  price_max: number;
  price_unit: PriceUnit;
  valid_until: string;
  grade_variety: string | null;
  origin_country: string | null;
  delivery_location: string | null;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}

export async function listActiveRfqs(type: RfqType) {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("rfq_listings")
    .select("*")
    .eq("listing_type", type)
    .eq("is_hidden", false)
    .gte("valid_until", today)
    .order("created_at", { ascending: false });
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []) as RfqListingRow[];
}

export async function listAllRfqsAdmin() {
  const { data, error } = await supabase
    .from("rfq_listings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []) as RfqListingRow[];
}

export interface CreateRfqInput {
  posted_by: string;
  company_id: string | null;
  listing_type: RfqType;
  commodity: string;
  quantity_min: number;
  quantity_max: number;
  quantity_unit: QtyUnit;
  price_min: number;
  price_max: number;
  price_unit: PriceUnit;
  valid_until: string;
  grade_variety?: string | null;
  origin_country?: string | null;
  delivery_location?: string | null;
}

export async function createRfq(input: CreateRfqInput) {
  const { data, error } = await supabase
    .from("rfq_listings")
    .insert(input)
    .select("*")
    .single();
  if (error) throw new Error(friendlyErrorMessage(error));
  return data as RfqListingRow;
}

export async function setRfqHidden(id: string, hidden: boolean) {
  const { error } = await supabase.from("rfq_listings").update({ is_hidden: hidden }).eq("id", id);
  if (error) throw new Error(friendlyErrorMessage(error));
}

export async function forceExpireRfq(id: string) {
  const today = new Date().toISOString().slice(0, 10);
  const { error } = await supabase.from("rfq_listings").update({ valid_until: today }).eq("id", id);
  if (error) throw new Error(friendlyErrorMessage(error));
}

export async function revealContact(rfqId: string, userId: string) {
  await supabase.from("rfq_contact_reveals").insert({ rfq_id: rfqId, user_id: userId });
  // Best-effort log; unique constraint not required.
}
