import { describe, it, expect } from "vitest";
import {
  TIER_LABEL,
  TIER_PRICE_INR,
  STATUS_LABEL,
  daysUntilExpiry,
  formatINR,
  isMembershipActive,
} from "@/lib/membership";

describe("membership helpers", () => {
  it("locks the founding-member pricing for the three tiers", () => {
    expect(TIER_PRICE_INR.broker).toBe(9999);
    expect(TIER_PRICE_INR.trader).toBe(14999);
    expect(TIER_PRICE_INR.importer).toBe(29999);
  });

  it("labels every tier and status (no missing entries)", () => {
    for (const t of ["broker", "trader", "importer"] as const) {
      expect(TIER_LABEL[t]).toBeTruthy();
    }
    for (const s of ["pending", "active", "expired", "cancelled"] as const) {
      expect(STATUS_LABEL[s]).toBeTruthy();
    }
  });

  it("formats INR with the en-IN currency style", () => {
    const out = formatINR(14999);
    // Different ICU builds render the symbol slightly differently; just check key parts.
    expect(out).toMatch(/14,999/);
    expect(out).toMatch(/₹|INR/);
  });

  it("isMembershipActive: null and non-active statuses are inactive", () => {
    expect(isMembershipActive(null)).toBe(false);
    expect(isMembershipActive({ status: "pending", expires_at: null })).toBe(false);
    expect(isMembershipActive({ status: "expired", expires_at: null })).toBe(false);
    expect(isMembershipActive({ status: "cancelled", expires_at: null })).toBe(false);
  });

  it("isMembershipActive: active without expiry is active forever", () => {
    expect(isMembershipActive({ status: "active", expires_at: null })).toBe(true);
  });

  it("isMembershipActive: active but past expiry is inactive", () => {
    const past = new Date(Date.now() - 86_400_000).toISOString();
    expect(isMembershipActive({ status: "active", expires_at: past })).toBe(false);
  });

  it("isMembershipActive: active with future expiry is active", () => {
    const future = new Date(Date.now() + 86_400_000).toISOString();
    expect(isMembershipActive({ status: "active", expires_at: future })).toBe(true);
  });

  it("daysUntilExpiry: returns null for null input", () => {
    expect(daysUntilExpiry(null)).toBeNull();
  });

  it("daysUntilExpiry: clamps past dates to 0", () => {
    const past = new Date(Date.now() - 5 * 86_400_000).toISOString();
    expect(daysUntilExpiry(past)).toBe(0);
  });

  it("daysUntilExpiry: rounds future days up", () => {
    const future = new Date(Date.now() + 30 * 86_400_000 + 60_000).toISOString();
    expect(daysUntilExpiry(future)).toBeGreaterThanOrEqual(30);
    expect(daysUntilExpiry(future)).toBeLessThanOrEqual(31);
  });
});
