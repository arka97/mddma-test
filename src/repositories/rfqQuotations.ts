import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";
import type { Database } from "@/integrations/supabase/types";
import type { PriceUnit, QtyUnit } from "@/repositories/rfqListings";

type RfqQuotationDbRow = Database["public"]["Tables"]["rfq_quotations"]["Row"];
type RfqQuotationDbInsert = Database["public"]["Tables"]["rfq_quotations"]["Insert"];


export type QuotationKind = "indicative" | "formal";
export type QuotationStatus = "sent" | "revised" | "withdrawn" | "rejected" | "expired";

export interface RfqQuotationRow {
  id: string;
  rfq_id: string;
  sender_company_id: string;
  sender_user_id: string;
  recipient_company_id: string;
  quote_kind: QuotationKind;
  currency: string;
  quantity_min: number;
  quantity_max: number;
  quantity_unit: QtyUnit;
  price_min: number;
  price_max: number;
  price_unit: PriceUnit;
  delivery_terms: string | null;
  payment_terms: string | null;
  notes: string | null;
  valid_until: string;
  status: QuotationStatus;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface CreateQuotationInput {
  rfq_id: string;
  sender_company_id: string;
  sender_user_id: string;
  recipient_company_id: string;
  quote_kind: QuotationKind;
  currency: string;
  quantity_min: number;
  quantity_max: number;
  quantity_unit: QtyUnit;
  price_min: number;
  price_max: number;
  price_unit: PriceUnit;
  delivery_terms?: string | null;
  payment_terms?: string | null;
  notes?: string | null;
  valid_until: string;
}

export interface QuotationRfqSummary {
  id: string;
  commodity: string;
  listing_type: "buy" | "sell";
  company_id: string | null;
}

export interface QuotationCompanySummary {
  id: string;
  name: string;
  slug: string;
  is_verified: boolean;
  country: string | null;
}

export interface QuotationBoardData {
  rows: RfqQuotationRow[];
  rfqs: Record<string, QuotationRfqSummary>;
  companies: Record<string, QuotationCompanySummary>;
}

function mapQuotationRow(row: RfqQuotationDbRow): RfqQuotationRow {
  return {
    ...row,
    quote_kind: row.quote_kind as QuotationKind,
    status: row.status as QuotationStatus,
    quantity_unit: row.quantity_unit as QtyUnit,
    price_unit: row.price_unit as PriceUnit,
  };
}

export async function createQuotation(input: CreateQuotationInput) {
  const { data, error } = await supabase
    .from("rfq_quotations")
    .insert(input satisfies RfqQuotationDbInsert)
    .select("*")
    .single();
  if (error) throw new Error(friendlyErrorMessage(error));
  return mapQuotationRow(data);
}

export async function listSentQuotations(userId: string) {
  const { data, error } = await supabase
    .from("rfq_quotations")
    .select("*")
    .eq("sender_user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []).map(mapQuotationRow);
}

export async function listReceivedQuotations(companyId: string) {
  const { data, error } = await supabase
    .from("rfq_quotations")
    .select("*")
    .eq("recipient_company_id", companyId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []).map(mapQuotationRow);
}


async function loadQuotationContext(rows: RfqQuotationRow[]) {
  const rfqIds = Array.from(new Set(rows.map((row) => row.rfq_id)));
  const companyIds = Array.from(
    new Set(rows.flatMap((row) => [row.sender_company_id, row.recipient_company_id])),
  );

  const [{ data: rfqData, error: rfqError }, { data: companyData, error: companyError }] =
    await Promise.all([
      rfqIds.length
        ? supabase
            .from("rfq_listings")
            .select("id,commodity,listing_type,company_id")
            .in("id", rfqIds)
        : Promise.resolve({ data: [], error: null }),
      companyIds.length
        ? supabase
            .from("companies_public" as never)
            .select("id,name,slug,is_verified,country")
            .in("id" as never, companyIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

  if (rfqError) throw new Error(friendlyErrorMessage(rfqError));
  if (companyError) throw new Error(friendlyErrorMessage(companyError));

  const rfqs = ((rfqData ?? []) as unknown as Array<{
    id: string;
    commodity: string;
    listing_type: string;
    company_id: string | null;
  }>).reduce<Record<string, QuotationRfqSummary>>((map, row) => {
    map[row.id] = {
      id: row.id,
      commodity: row.commodity,
      listing_type: row.listing_type === "sell" ? "sell" : "buy",
      company_id: row.company_id,
    };
    return map;
  }, {});

  const companies = ((companyData ?? []) as unknown as Array<{
    id: string | null;
    name: string | null;
    slug: string | null;
    is_verified: boolean | null;
    country: string | null;
  }>).reduce<Record<string, QuotationCompanySummary>>((map, row) => {
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

  return { rfqs, companies };
}

export async function getSentQuotationBoard(userId: string): Promise<QuotationBoardData> {
  const rows = await listSentQuotations(userId);
  const context = await loadQuotationContext(rows);
  return { rows, ...context };
}

export async function getReceivedQuotationBoard(companyId: string): Promise<QuotationBoardData> {
  const rows = await listReceivedQuotations(companyId);
  const context = await loadQuotationContext(rows);
  return { rows, ...context };
}

export async function withdrawQuotation(id: string) {
  const { data, error } = await (
    supabase.rpc as unknown as (
      fn: string,
      args: { _quotation_id: string },
    ) => Promise<{ data: boolean | null; error: unknown }>
  )("withdraw_my_rfq_quotation", { _quotation_id: id });

  if (error) throw new Error(friendlyErrorMessage(error as never));
  if (!data) throw new Error("This quotation can no longer be withdrawn.");
}
