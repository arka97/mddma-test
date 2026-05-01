import { supabase } from "@/integrations/supabase/client";

// v3.1: single Paid plan. Legacy values (broker/trader/importer) may still
// exist in older DB rows — read paths fall back to the Paid label/price.
export type MembershipTier = "paid";
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
  payment_link_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const TIER_LABEL: Record<MembershipTier, string> = {
  paid: "Paid Membership",
};

export const TIER_PRICE_INR: Record<MembershipTier, number> = {
  paid: 10000,
};

// Safe accessors that gracefully handle legacy DB values
// (broker/trader/importer) by collapsing them to the single Paid plan.
export function tierLabel(tier: string | null | undefined): string {
  return TIER_LABEL[tier as MembershipTier] ?? "Paid Membership";
}

export function tierPriceInr(tier: string | null | undefined): number {
  return TIER_PRICE_INR[tier as MembershipTier] ?? 10000;
}

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

// Founder admins (e.g. admin@mddma.org) bypass paid membership + verification.
// Treat them as if they hold an active paid membership and full GST verification.
export function isFounderAdmin(roles: string[] | null | undefined): boolean {
  return Array.isArray(roles) && roles.includes("admin");
}

export function daysUntilExpiry(expiresAt: string | null): number | null {
  if (!expiresAt) return null;
  const ms = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

// New tables aren't yet in generated types.ts; cast at the boundary so the
// rest of the app stays typed. Regenerating Supabase types removes the cast.
// Loose AnySupabase chain — calls are validated server-side by RLS regardless.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any;

const db = supabase as unknown as AnySupabase;

export interface MembershipWithProfile extends Membership {
  profile?: { full_name: string | null; phone: string | null } | null;
  email?: string | null;
}

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
      // price_paid_inr stays NULL until the webhook captures the actual amount.
    })
    .select()
    .single();
  return { data: result.data, error: result.error };
}

// ============================================================
// Admin queue helpers (Phase D)
// ============================================================

export async function listMembershipsByStatus(
  status: MembershipStatus | "all" = "all",
): Promise<MembershipWithProfile[]> {
  let q = db
    .from("memberships")
    .select("*, profile:profiles!memberships_profile_id_fkey(full_name, phone)")
    .order("created_at", { ascending: false });
  if (status !== "all") q = q.eq("status", status);
  const { data, error } = await q;
  if (error) {
    console.error("listMembershipsByStatus", error);
    return [];
  }
  return (data ?? []) as MembershipWithProfile[];
}

// Calls the razorpay-create-payment-link edge function. Returns the short
// URL the admin can paste into WhatsApp / email. Requires admin auth.
export async function createPaymentLinkForMembership(
  membershipId: string,
): Promise<{ payment_url: string | null; razorpay_order_id: string | null; error: string | null }> {
  const { data, error } = await supabase.functions.invoke("razorpay-create-payment-link", {
    body: { membership_id: membershipId },
  });
  if (error) {
    return { payment_url: null, razorpay_order_id: null, error: error.message };
  }
  const r = (data ?? {}) as { payment_url?: string; razorpay_order_id?: string; error?: string };
  if (r.error) return { payment_url: null, razorpay_order_id: null, error: r.error };
  return {
    payment_url: r.payment_url ?? null,
    razorpay_order_id: r.razorpay_order_id ?? null,
    error: null,
  };
}

// Manual override path: admin marks a membership active without a Razorpay
// callback (e.g. they collected payment offline). Server-side activate_membership()
// applies the founding-lock window + grants paid_member role.
export async function manuallyActivateMembership(
  membershipId: string,
  amountPaidInr: number,
  notes?: string,
): Promise<{ error: Error | null }> {
  const { error } = await db.rpc("activate_membership", {
    _membership_id: membershipId,
    _payload: {
      amount_paid_inr: String(amountPaidInr),
      razorpay_payment_id: null,
      razorpay_order_id: null,
      manual_note: notes ?? null,
    },
  });
  return { error };
}

export async function cancelMembership(
  membershipId: string,
): Promise<{ error: Error | null }> {
  const { error } = await db
    .from("memberships")
    .update({ status: "cancelled" })
    .eq("id", membershipId);
  return { error };
}
