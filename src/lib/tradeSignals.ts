// Phase C: client-side helpers for the seller scoreboard. Reads the
// denormalized `seller_trade_signals` row that the SQL trigger keeps fresh.
// Tables aren't yet in generated types.ts, so we launder through `unknown`
// in a tightly-scoped wrapper (mirrors the kyc.ts / membership.ts pattern).

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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

const EMPTY_KYC: KycChecklist = {
  gst: "missing",
  pan: "missing",
  fssai: "missing",
};

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

interface KycRow { doc_type: KycDocType; status: KycDocStatus; reviewed_at: string | null }
interface KycDb {
  from: (table: "verification_submissions") => {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        order: (col: string, opts?: { ascending?: boolean }) => Promise<{
          data: KycRow[] | null;
          error: Error | null;
        }>;
      };
    };
  };
}
const kycDb = supabase as unknown as KycDb;

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

export async function getSellerKycChecklist(profileId: string): Promise<KycChecklist> {
  const { data, error } = await kycDb
    .from("verification_submissions")
    .select("doc_type,status,reviewed_at")
    .eq("profile_id", profileId)
    .order("submitted_at", { ascending: false });
  if (error || !data) return { ...EMPTY_KYC };
  // Latest row per doc_type wins (data is sorted desc by submission).
  const acc: KycChecklist = { ...EMPTY_KYC };
  for (const row of data) {
    if (acc[row.doc_type] === "missing") {
      acc[row.doc_type] = row.status;
    }
  }
  return acc;
}

// ---------- React hooks ----------

export function useSellerTradeSignals(companyId: string | null | undefined) {
  const [signals, setSignals] = useState<TradeSignals | null>(null);
  const [loading, setLoading] = useState<boolean>(!!companyId);

  useEffect(() => {
    if (!companyId) {
      setSignals(null);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    getSellerTradeSignals(companyId).then((s) => {
      if (alive) {
        setSignals(s);
        setLoading(false);
      }
    });
    return () => { alive = false; };
  }, [companyId]);

  return { signals, loading };
}

export function useSellerTradeSignalsBatch(companyIds: string[]) {
  const [map, setMap] = useState<Map<string, TradeSignals>>(new Map());
  const [loading, setLoading] = useState<boolean>(companyIds.length > 0);
  // Stable key for dependency comparison
  const key = companyIds.slice().sort().join(",");

  useEffect(() => {
    if (companyIds.length === 0) {
      setMap(new Map());
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    getSellerTradeSignalsBatch(companyIds).then((m) => {
      if (alive) {
        setMap(m);
        setLoading(false);
      }
    });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { map, loading };
}

export function useSellerKyc(profileId: string | null | undefined) {
  const [checklist, setChecklist] = useState<KycChecklist>({ ...EMPTY_KYC });
  const [loading, setLoading] = useState<boolean>(!!profileId);

  useEffect(() => {
    if (!profileId) {
      setChecklist({ ...EMPTY_KYC });
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    getSellerKycChecklist(profileId).then((c) => {
      if (alive) {
        setChecklist(c);
        setLoading(false);
      }
    });
    return () => { alive = false; };
  }, [profileId]);

  return { checklist, loading };
}
