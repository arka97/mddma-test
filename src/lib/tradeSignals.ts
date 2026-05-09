// Phase C: client-side helpers for the seller scoreboard. Reads the
// denormalized `seller_trade_signals` row that the SQL trigger keeps fresh.
// Tables aren't yet in generated types.ts, so we launder through `unknown`
// in a tightly-scoped wrapper (mirrors the kyc.ts / membership.ts pattern).

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { qk } from "@/lib/queryKeys";
import type { KycDocStatus, KycDocType } from "@/lib/kyc";

export interface TradeSignals {
  company_id: string;
  rfqs_received: number;
  trades_completed: number;
  trades_in_pipeline: number;
  response_pct: number;
  rejection_pct: number;
  avg_response_minutes: number;
  repeat_buyer_count: number;
  last_response_at: string | null;
  last_active_at: string;
  updated_at: string;
}

export type KycChecklist = Record<KycDocType, KycDocStatus | "missing">;

// Minimum trade history before we show real numbers vs. "Establishing trade history".
export const TRADE_HISTORY_THRESHOLD = 5;

export function isEstablishingHistory(s: TradeSignals | null | undefined): boolean {
  if (!s) return true;
  return (s.trades_completed ?? 0) < TRADE_HISTORY_THRESHOLD;
}

export function approvedKycCount(checklist: KycChecklist): number {
  return (Object.values(checklist) as Array<KycDocStatus | "missing">)
    .filter((v) => v === "approved").length;
}

export function formatResponseTime(minutes: number): string {
  if (!minutes || minutes <= 0) return "—";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h`;
  const days = Math.round(hours / 24);
  return `${days}d`;
}

// ---------- Supabase wrappers (typed via unknown laundering) ----------

interface SignalsDb {
  from: (table: "seller_trade_signals") => {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        maybeSingle: () => Promise<{ data: TradeSignals | null; error: Error | null }>;
      };
      in: (col: string, vals: string[]) => Promise<{ data: TradeSignals[] | null; error: Error | null }>;
    } & Promise<{ data: TradeSignals[] | null; error: Error | null }>;
  };
}
const signalsDb = supabase as unknown as SignalsDb;

export async function getSellerTradeSignals(companyId: string): Promise<TradeSignals | null> {
  const { data, error } = await signalsDb
    .from("seller_trade_signals")
    .select("*")
    .eq("company_id", companyId)
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function getSellerTradeSignalsBatch(companyIds: string[]): Promise<Map<string, TradeSignals>> {
  if (companyIds.length === 0) return new Map();
  const { data, error } = await signalsDb
    .from("seller_trade_signals")
    .select("*")
    .in("company_id", companyIds);
  if (error || !data) return new Map();
  return new Map(data.map((r) => [r.company_id, r]));
}

// ---------- React hooks ----------

const EMPTY_MAP: ReadonlyMap<string, TradeSignals> = new Map();

export function useSellerTradeSignals(companyId: string | null | undefined) {
  const { data, isLoading } = useQuery({
    queryKey: qk.tradeSignals.byCompany(companyId ?? ""),
    queryFn: () => getSellerTradeSignals(companyId as string),
    enabled: Boolean(companyId),
  });
  return { signals: data ?? null, loading: isLoading };
}

export function useSellerTradeSignalsBatch(companyIds: string[]) {
  const { data, isLoading } = useQuery({
    queryKey: qk.tradeSignals.batch(companyIds),
    queryFn: () => getSellerTradeSignalsBatch(companyIds),
    enabled: companyIds.length > 0,
  });
  return { map: data ?? EMPTY_MAP, loading: isLoading };
}
