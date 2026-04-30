import { describe, it, expect } from "vitest";
import {
  TRADE_HISTORY_THRESHOLD,
  approvedKycCount,
  formatResponseTime,
  isEstablishingHistory,
  type KycChecklist,
  type TradeSignals,
} from "@/lib/tradeSignals";

const baseSignals: TradeSignals = {
  company_id: "c1",
  rfqs_received: 0,
  trades_completed: 0,
  trades_in_pipeline: 0,
  response_pct: 0,
  rejection_pct: 0,
  avg_response_minutes: 0,
  repeat_buyer_count: 0,
  last_response_at: null,
  last_active_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const emptyKyc: KycChecklist = { gst: "missing", pan: "missing", fssai: "missing" };

describe("trade-signals helpers", () => {
  it("isEstablishingHistory: null/undefined are still establishing", () => {
    expect(isEstablishingHistory(null)).toBe(true);
    expect(isEstablishingHistory(undefined)).toBe(true);
  });

  it("isEstablishingHistory: trades below threshold are establishing", () => {
    expect(isEstablishingHistory({ ...baseSignals, trades_completed: 0 })).toBe(true);
    expect(isEstablishingHistory({ ...baseSignals, trades_completed: TRADE_HISTORY_THRESHOLD - 1 })).toBe(true);
  });

  it("isEstablishingHistory: at or above threshold is established", () => {
    expect(isEstablishingHistory({ ...baseSignals, trades_completed: TRADE_HISTORY_THRESHOLD })).toBe(false);
    expect(isEstablishingHistory({ ...baseSignals, trades_completed: 99 })).toBe(false);
  });

  it("formatResponseTime: zero/negative returns em-dash", () => {
    expect(formatResponseTime(0)).toBe("—");
    expect(formatResponseTime(-1)).toBe("—");
  });

  it("formatResponseTime: minutes for <60", () => {
    expect(formatResponseTime(1)).toBe("1m");
    expect(formatResponseTime(45)).toBe("45m");
    expect(formatResponseTime(59)).toBe("59m");
  });

  it("formatResponseTime: hours for 60..2880 (under 48h)", () => {
    expect(formatResponseTime(60)).toBe("1h");
    expect(formatResponseTime(120)).toBe("2h");
    expect(formatResponseTime(47 * 60)).toBe("47h");
  });

  it("formatResponseTime: days for >=48h", () => {
    expect(formatResponseTime(48 * 60)).toBe("2d");
    expect(formatResponseTime(7 * 24 * 60)).toBe("7d");
  });

  it("approvedKycCount: counts only approved entries", () => {
    expect(approvedKycCount(emptyKyc)).toBe(0);
    expect(
      approvedKycCount({ gst: "approved", pan: "pending", fssai: "missing" }),
    ).toBe(1);
    expect(
      approvedKycCount({ gst: "approved", pan: "approved", fssai: "approved" }),
    ).toBe(3);
  });

  it("approvedKycCount: rejected does not count as approved", () => {
    expect(
      approvedKycCount({ gst: "rejected", pan: "rejected", fssai: "approved" }),
    ).toBe(1);
  });
});
