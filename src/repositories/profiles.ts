import { supabase } from "@/integrations/supabase/client";

export interface PublicProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  company_name: string | null;
  verification_tier?: string | null;
}

/**
 * Display-only profile lookup.
 *
 * The `profiles` table is readable by the owner (and admins) only, so the feed
 * must go through the `get_public_profiles` security-definer RPC, which exposes
 * name / avatar / business name and nothing private (no phone, no GSTIN).
 */
export async function fetchPublicProfiles(ids: string[]): Promise<PublicProfile[]> {
  const unique = Array.from(new Set(ids.filter(Boolean)));
  if (unique.length === 0) return [];
  const { data, error } = await supabase.rpc("get_public_profiles", { _ids: unique });
  if (error) return [];
  return (data ?? []) as PublicProfile[];
}

export async function fetchPublicProfileMap(ids: string[]): Promise<Record<string, PublicProfile>> {
  const rows = await fetchPublicProfiles(ids);
  const map: Record<string, PublicProfile> = {};
  rows.forEach((p) => {
    map[p.id] = p;
  });
  return map;
}
