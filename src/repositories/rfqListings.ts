import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

export type RfqType = "buy" | "sell";
export type QtyUnit = "kg" | "MT" | "box" | "container" | "pallet";
export type PriceUnit = "per kg" | "per MT" | "per box" | "per unit";
export type RfqStatus = "open" | "closed" | "withdrawn" | "expired";

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
  currency: string;
  valid_until: string;
  grade_variety: string | null;
  origin_country: string | null;
  delivery_location: string | null;
  packaging: string | null;
  notes: string | null;
  status: RfqStatus;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}

export interface RfqCompanySummary {
  id: string;
  name: string;
  slug: string;
  is_verified: boolean;
  country: string | null;
}

export interface RfqBoardData {
  rows: RfqListingRow[];
  companies: Record<string, RfqCompanySummary>;
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

  return ((data ?? []) as unknown as RfqListingRow[]).filter(
    (row) => (row.status ?? "open") === "open",
  );
}

export async function listRfqCompanies(companyIds: string[]) {
  if (!companyIds.length) return {} as Record<string, RfqCompanySummary>;

  const { data, error } = await supabase
    .from("companies_public" as never)
    .select("id,name,slug,is_verified,country")
    .in("id" as never, companyIds);
  if (error) throw new Error(friendlyErrorMessage(error));

  return ((data ?? []) as unknown as Array<{
    id: string | null;
    name: string | null;
    slug: string | null;
    is_verified: boolean | null;
    country: string | null;
  }>).reduce<Record<string, RfqCompanySummary>>((map, row) => {
    if (!row.id || !row.name || !row.slug) return map;
    map[row.id] = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      is_verified: Boolean(row.is_verified),
      country: row.country,
    };
    return map;
  }, {});
}

export async function getRfqBoard(type: RfqType): Promise<RfqBoardData> {
  const rows = await listActiveRfqs(type);
  const ids = Array.from(new Set(rows.map((row) => row.company_id).filter(Boolean))) as string[];
  const companies = await listRfqCompanies(ids);
  return { rows, companies };
}

export async function listAllRfqsAdmin() {
  const { data, error } = await supabase
    .from("rfq_listings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []) as unknown as RfqListingRow[];
}

export interface CreateRfqInput {
  posted_by: string;
  company_id: string;
  listing_type: RfqType;
  commodity: string;
  quantity_min: number;
  quantity_max: number;
  quantity_unit: QtyUnit;
  price_min: number;
  price_max: number;
  price_unit: PriceUnit;
  currency: string;
  valid_until: string;
  grade_variety?: string | null;
  origin_country?: string | null;
  delivery_location?: string | null;
  packaging?: string | null;
  notes?: string | null;
  status?: RfqStatus;
}

export async function createRfq(input: CreateRfqInput) {
  const { data, error } = await supabase
    .from("rfq_listings")
    .insert(input as never)
    .select("*")
    .single();
  if (error) throw new Error(friendlyErrorMessage(error));
  return data as unknown as RfqListingRow;
}

export async function setRfqHidden(id: string, hidden: boolean) {
  const { error } = await supabase.from("rfq_listings").update({ is_hidden: hidden }).eq("id", id);
  if (error) throw new Error(friendlyErrorMessage(error));
}

export async function closeRfq(id: string) {
  const { error } = await supabase
    .from("rfq_listings")
    .update({ status: "closed" } as never)
    .eq("id", id);
  if (error) throw new Error(friendlyErrorMessage(error));
}

export async function forceExpireRfq(id: string) {
  const today = new Date().toISOString().slice(0, 10);
  const { error } = await supabase
    .from("rfq_listings")
    .update({ valid_until: today, status: "expired" } as never)
    .eq("id", id);
  if (error) throw new Error(friendlyErrorMessage(error));
}

export async function revealContact(rfqId: string, userId: string) {
  await supabase.from("rfq_contact_reveals").insert({ rfq_id: rfqId, user_id: userId });
}
