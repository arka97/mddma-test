import { supabase } from "@/integrations/supabase/client";

export type KycDocType = "gst" | "pan" | "fssai";
export type KycDocStatus = "pending" | "approved" | "rejected";

export interface KycSubmission {
  id: string;
  profile_id: string;
  doc_type: KycDocType;
  status: KycDocStatus;
  doc_number: string | null;
  bank_account_last4: string | null;
  bank_ifsc: string | null;
  bank_holder_name: string | null;
  file_path: string;
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  submitted_at: string;
  updated_at: string;
}

export const DOC_LABEL: Record<KycDocType, string> = {
  gst: "GST Certificate",
  pan: "PAN Card",
  fssai: "FSSAI License",
};

export const DOC_HELP: Record<KycDocType, string> = {
  gst: "Upload your GST registration certificate. Enter your 15-character GSTIN.",
  pan: "Upload firm PAN (or proprietor PAN). Enter the 10-character PAN number.",
  fssai: "Upload your FSSAI / FoSCoS license. Enter the 14-digit license number.",
};

export const ALLOWED_MIME = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

const BUCKET = "verification-docs";

// Format guards (loose; admins do final review).
export const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
export const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const FSSAI_RE = /^[0-9]{14}$/;
export const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export function validateDocNumber(doc: KycDocType, value: string): string | null {
  const v = value.trim().toUpperCase();
  if (!v) return "Required";
  if (doc === "gst" && !GSTIN_RE.test(v)) return "Expected 15-char GSTIN, e.g. 27AAAPL1234C1Z5";
  if (doc === "pan" && !PAN_RE.test(v)) return "Expected 10-char PAN, e.g. AAAPL1234C";
  if (doc === "fssai" && !FSSAI_RE.test(v)) return "Expected 14-digit FSSAI license number";
  return null;
}

// Tables aren't in generated types.ts yet; isolate the cast here.
// Loose chain — the actual contract is enforced server-side by RLS.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KycDb = any;
const db = supabase as unknown as KycDb;

function safeExt(name: string): string {
  const ext = (name.split(".").pop() ?? "").toLowerCase();
  return /^[a-z0-9]{1,5}$/.test(ext) ? ext : "bin";
}

export async function uploadKycFile(
  userId: string,
  doc: KycDocType,
  file: File,
): Promise<{ path: string | null; error: string | null }> {
  if (file.size > MAX_BYTES) return { path: null, error: "File exceeds 8 MB limit" };
  if (!ALLOWED_MIME.includes(file.type)) return { path: null, error: "Use PDF, JPG, PNG or WEBP" };
  const path = `${userId}/${doc}/${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt(file.name)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) return { path: null, error: error.message };
  return { path, error: null };
}

export async function getSignedKycUrl(path: string, expiresIn = 60 * 10): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresIn);
  if (error || !data) return null;
  return data.signedUrl;
}

export async function listKycSubmissions(userId: string): Promise<KycSubmission[]> {
  const { data, error } = await db
    .from("verification_submissions")
    .select("*")
    .eq("profile_id", userId)
    .order("submitted_at", { ascending: false });
  if (error) {
    console.error("listKycSubmissions", error);
    return [];
  }
  return data ?? [];
}

export interface SubmitKycInput {
  userId: string;
  docType: KycDocType;
  docNumber?: string | null;
  bankAccountLast4?: string | null;
  bankIfsc?: string | null;
  bankHolderName?: string | null;
  filePath: string;
}

export async function insertKycSubmission(
  input: SubmitKycInput,
): Promise<{ data: KycSubmission | null; error: Error | null }> {
  const result = await db
    .from("verification_submissions")
    .insert({
      profile_id: input.userId,
      doc_type: input.docType,
      status: "pending",
      doc_number: input.docNumber ?? null,
      bank_account_last4: input.bankAccountLast4 ?? null,
      bank_ifsc: input.bankIfsc ?? null,
      bank_holder_name: input.bankHolderName ?? null,
      file_path: input.filePath,
    })
    .select()
    .single();
  return { data: result.data, error: result.error };
}

export function latestByDocType(rows: KycSubmission[]): Record<KycDocType, KycSubmission | null> {
  const out: Record<KycDocType, KycSubmission | null> = {
    gst: null,
    pan: null,
    fssai: null,
  };
  for (const r of rows) {
    if (!out[r.doc_type]) out[r.doc_type] = r;
  }
  return out;
}

export function statusTone(status: KycDocStatus | null | undefined): {
  label: string;
  className: string;
} {
  switch (status) {
    case "approved":
      return { label: "Approved", className: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    case "rejected":
      return { label: "Rejected", className: "bg-red-100 text-red-800 border-red-200" };
    case "pending":
      return { label: "Pending review", className: "bg-amber-100 text-amber-800 border-amber-200" };
    default:
      return { label: "Not submitted", className: "bg-muted text-muted-foreground border-border" };
  }
}

// ============================================================
// Admin queue helpers (Phase D)
// ============================================================

export interface KycSubmissionWithProfile extends KycSubmission {
  profile?: { full_name: string | null; phone: string | null } | null;
}

export async function listAllKycSubmissions(
  status?: KycDocStatus | "all",
): Promise<KycSubmissionWithProfile[]> {
  let q = db
    .from("verification_submissions")
    .select("*, profile:profiles!verification_submissions_profile_id_fkey(full_name, phone)")
    .order("submitted_at", { ascending: false });
  if (status && status !== "all") q = q.eq("status", status);
  const { data, error } = await q;
  if (error) {
    console.error("listAllKycSubmissions", error);
    return [];
  }
  return (data ?? []) as KycSubmissionWithProfile[];
}

export async function approveKycSubmission(
  submissionId: string,
  reviewerUid: string,
): Promise<{ error: Error | null }> {
  const { error } = await db
    .from("verification_submissions")
    .update({
      status: "approved",
      reviewed_by: reviewerUid,
      reviewed_at: new Date().toISOString(),
      rejection_reason: null,
    })
    .eq("id", submissionId);
  return { error };
}

export async function rejectKycSubmission(
  submissionId: string,
  reviewerUid: string,
  reason: string,
): Promise<{ error: Error | null }> {
  const { error } = await db
    .from("verification_submissions")
    .update({
      status: "rejected",
      reviewed_by: reviewerUid,
      reviewed_at: new Date().toISOString(),
      rejection_reason: reason.trim().slice(0, 500),
    })
    .eq("id", submissionId);
  return { error };
}
