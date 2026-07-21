// company_members repository — N:M identity join
// Access is gated by RLS; the app just calls these helpers.

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { friendlyErrorMessage } from "@/lib/errors";

export type CompanyMemberRole = Database["public"]["Enums"]["company_member_role"];
export type CompanyMemberRow = Database["public"]["Tables"]["company_members"]["Row"];

export async function listMyCompanyMemberships(): Promise<CompanyMemberRow[]> {
  const { data: userRes } = await supabase.auth.getUser();
  const uid = userRes.user?.id;
  if (!uid) return [];
  const { data, error } = await supabase
    .from("company_members")
    .select("*")
    .eq("user_id", uid);
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []) as CompanyMemberRow[];
}

export async function listCompanyMembers(companyId: string): Promise<CompanyMemberRow[]> {
  const { data, error } = await supabase
    .from("company_members")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []) as CompanyMemberRow[];
}

export async function addCompanyMember(
  companyId: string,
  userId: string,
  role: Exclude<CompanyMemberRole, "owner"> = "viewer"
): Promise<CompanyMemberRow> {
  const { data, error } = await supabase
    .from("company_members")
    .insert({ company_id: companyId, user_id: userId, role })
    .select()
    .single();
  if (error) throw new Error(friendlyErrorMessage(error));
  return data as CompanyMemberRow;
}

export async function updateCompanyMemberRole(
  id: string,
  role: Exclude<CompanyMemberRole, "owner">
): Promise<void> {
  const { error } = await supabase
    .from("company_members")
    .update({ role })
    .eq("id", id);
  if (error) throw new Error(friendlyErrorMessage(error));
}

export async function removeCompanyMember(id: string): Promise<void> {
  const { error } = await supabase.from("company_members").delete().eq("id", id);
  if (error) throw new Error(friendlyErrorMessage(error));
}

export async function hasCompanyRole(
  companyId: string,
  roles: CompanyMemberRole[]
): Promise<boolean> {
  const { data, error } = await supabase.rpc("has_company_role", {
    _company_id: companyId,
    _roles: roles,
  });
  if (error) throw new Error(friendlyErrorMessage(error));
  return Boolean(data);
}
