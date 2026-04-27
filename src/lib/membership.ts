import { supabase } from "@/integrations/supabase/client";

export type MembershipTier = "broker" | "trader" | "importer";
export type MembershipStatus = "pending" | "active" | "expired" | "cancelled";

export interface Membership {
  id: string;
  profile_id: string;
  tier: MembershipTier;
  status: MembershipStatus;
  starts_at: string | null;
  expires_at: string | null;
  founding_lock_until: string | null;
  price_paid_inr: number | null;
  razorpay_payment_id: string | null;
  razorpay_order_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const TIER_LABEL: Record<MembershipTier, string> = {
  broker: "Broker",
  trader: "Trader / Wholesaler",
  importer: "Importer · Processor · Brand",
};

export const TIER_PRICE_INR: Record<MembershipTier, number> = {
  broker: 9999,
  trader: 14999,
  importer: 29999,
};

export const STATUS_LABEL: Record<MembershipStatus, string> = {
  pending: "Pending review",
  active: "Active",
  expired: "Expired",
  cancelled: "Cancelled",
};

export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function isMembershipActive(m: Pick<Membership, "status" | "expires_at"> | null): boolean {
  if (!m) return false;
  if (m.status !== "active") return false;
  if (!m.expires_at) return true;
  return new Date(m.expires_at).getTime() > Date.now();
}

export function daysUntilExpiry(expiresAt: string | null): number | null {
  if (!expiresAt) return null;
  const ms = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

// New tables aren't yet in generated types.ts; cast at the boundary so the
// rest of the app stays typed. Regenerating Supabase types removes the cast.
type AnySupabase = {
  from: (table: string) => {
    select: (cols?: string) => {
      eq: (col: string, val: unknown) => {
        order: (
          col: string,
          opts?: { ascending?: boolean; nullsFirst?: boolean },
        ) => {
          maybeSingle: () => Promise<{ data: Membership | null; error: Error | null }>;
        };
        maybeSingle: () => Promise<{ data: Membership | null; error: Error | null }>;
      };
    };
    insert: (row: Partial<Membership>) => {
      select: () => {
        single: () => Promise<{ data: Membership | null; error: Error | null }>;
      };
    };
  };
};

const db = supabase as unknown as AnySupabase;

export async function getLatestMembershipForUser(userId: string): Promise<Membership | null> {
  const { data, error } = await db
    .from("memberships")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false })
    .maybeSingle();
  if (error) {
    console.error("getLatestMembershipForUser", error);
    return null;
  }
  return data;
}

export async function createPendingMembership(
  userId: string,
  tier: MembershipTier,
): Promise<{ data: Membership | null; error: Error | null }> {
  const result = await db
    .from("memberships")
    .insert({
      profile_id: userId,
      tier,
      status: "pending",
      price_paid_inr: TIER_PRICE_INR[tier],
    })
    .select()
    .single();
  return { data: result.data, error: result.error };
}
