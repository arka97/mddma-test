import { describe, it, expect } from "vitest";
import {
  DOC_LABEL,
  GSTIN_RE,
  IFSC_RE,
  PAN_RE,
  FSSAI_RE,
  latestByDocType,
  statusTone,
  validateDocNumber,
  type KycSubmission,
} from "@/lib/kyc";

const row = (overrides: Partial<KycSubmission>): KycSubmission => ({
  id: crypto.randomUUID?.() ?? Math.random().toString(36),
  profile_id: "u1",
  doc_type: "gst",
  status: "pending",
  doc_number: null,
  bank_account_last4: null,
  bank_ifsc: null,
  bank_holder_name: null,
  file_path: "u1/gst/abc.pdf",
  rejection_reason: null,
  reviewed_by: null,
  reviewed_at: null,
  submitted_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

describe("kyc helpers", () => {
  it("labels each KYC doc type", () => {
    for (const k of ["gst", "pan", "fssai"] as const) {
      expect(DOC_LABEL[k]).toBeTruthy();
    }
  });

  it("regexes accept valid inputs", () => {
    expect(GSTIN_RE.test("27AAAPL1234C1Z5")).toBe(true);
    expect(PAN_RE.test("AAAPL1234C")).toBe(true);
    expect(FSSAI_RE.test("10012345678901")).toBe(true);
    expect(IFSC_RE.test("HDFC0001234")).toBe(true);
  });

  it("regexes reject invalid inputs", () => {
    expect(GSTIN_RE.test("INVALID")).toBe(false);
    expect(PAN_RE.test("AAAPL")).toBe(false);
    expect(FSSAI_RE.test("123")).toBe(false);
    expect(IFSC_RE.test("HDFC1001234")).toBe(false); // 5th char must be 0
  });

  it("validateDocNumber returns null for valid, message for invalid", () => {
    expect(validateDocNumber("gst", "27AAAPL1234C1Z5")).toBeNull();
    expect(validateDocNumber("gst", "BAD")).toMatch(/GSTIN/);
    expect(validateDocNumber("pan", "AAAPL1234C")).toBeNull();
    expect(validateDocNumber("pan", "BAD")).toMatch(/PAN/);
    expect(validateDocNumber("fssai", "10012345678901")).toBeNull();
    expect(validateDocNumber("fssai", "BAD")).toMatch(/FSSAI/);
    expect(validateDocNumber("gst", "")).toBe("Required");
  });

  it("latestByDocType: keeps the first row per doc_type from a desc-sorted list", () => {
    const newer = row({ doc_type: "gst", id: "g2", submitted_at: "2026-04-10" });
    const older = row({ doc_type: "gst", id: "g1", submitted_at: "2026-04-01" });
    const pan = row({ doc_type: "pan", id: "p1" });
    const result = latestByDocType([newer, older, pan]);
    expect(result.gst?.id).toBe("g2");
    expect(result.pan?.id).toBe("p1");
    expect(result.fssai).toBeNull();
  });

  it("statusTone returns sane defaults for all states", () => {
    expect(statusTone("approved").label).toBe("Approved");
    expect(statusTone("rejected").label).toBe("Rejected");
    expect(statusTone("pending").label).toBe("Pending review");
    expect(statusTone(null).label).toBe("Not submitted");
    expect(statusTone(undefined).label).toBe("Not submitted");
  });
});
