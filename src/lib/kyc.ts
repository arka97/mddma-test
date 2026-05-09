// Stubs retained after KYC tables were removed in v3.1 cleanup.
// AdminModeration still mounts a KYC tab; it will simply render empty.

export type KycStatus = "pending" | "approved" | "rejected";

export interface KycSubmissionWithProfile {
  id: string;
  profile_id: string;
  doc_type: string;
  file_path: string;
  status: KycStatus;
  created_at: string;
  reviewed_at: string | null;
  reviewer_note: string | null;
  profile?: { full_name: string | null; avatar_url: string | null } | null;
}

export const DOC_LABEL: Record<string, string> = {};

export function statusTone(_s: KycStatus): string {
  return "bg-muted text-muted-foreground";
}

export async function listAllKycSubmissions(_status: "all" | KycStatus): Promise<KycSubmissionWithProfile[]> {
  return [];
}

export async function getSignedKycUrl(_path: string): Promise<string | null> {
  return null;
}

export async function approveKycSubmission(_id: string, _reviewerId: string): Promise<{ error: string | null }> {
  return { error: "KYC table removed." };
}

export async function rejectKycSubmission(_id: string, _reviewerId: string, _reason: string): Promise<{ error: string | null }> {
  return { error: "KYC table removed." };
}
