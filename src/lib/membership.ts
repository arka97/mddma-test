// v3.1: single Paid plan (₹10,000/yr). The full membership-table flow
// (Razorpay payment links, admin activation queue, KYC docs) was trimmed
// when the underlying tables were removed. What's left here is the static
// pricing/labelling helpers used by Apply, MembershipPlans, and the
// founder-admin bypass check used across account UI.

export type MembershipTier = "paid";
export type MembershipStatus = "pending" | "active" | "expired" | "cancelled";

export interface Membership {
  id: string;
  profile_id: string;
  tier: MembershipTier;
  status: MembershipStatus;
  starts_at: string | null;
  expires_at: string | null;
  price_paid_inr: number | null;
}

export const TIER_LABEL: Record<MembershipTier, string> = {
  paid: "Paid Membership",
};

export const TIER_PRICE_INR: Record<MembershipTier, number> = {
  paid: 10000,
};

// Safe accessors that gracefully handle legacy DB values (broker/trader/importer)
// by collapsing them to the single Paid plan.
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

// Founder admins (e.g. admin@mddma.org) bypass paid membership requirements.
export function isFounderAdmin(roles: string[] | null | undefined): boolean {
  return Array.isArray(roles) && roles.includes("admin");
}

export function daysUntilExpiry(expiresAt: string | null): number | null {
  if (!expiresAt) return null;
  const ms = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}
