import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useFollows() {
  const { user } = useAuth();
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) { setFollowedIds(new Set()); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase.from("follows").select("followed_company_id");
    setFollowedIds(new Set((data ?? []).map((r) => (r as { followed_company_id: string }).followed_company_id)));
    setLoading(false);
  }, [user]);

  useEffect(() => { void refresh(); }, [refresh]);

  const follow = useCallback(async (companyId: string) => {
    if (!user) return;
    await supabase.from("follows").insert({ follower_user_id: user.id, followed_company_id: companyId });
    setFollowedIds((s) => new Set(s).add(companyId));
  }, [user]);

  const unfollow = useCallback(async (companyId: string) => {
    if (!user) return;
    await supabase.from("follows").delete().eq("follower_user_id", user.id).eq("followed_company_id", companyId);
    setFollowedIds((s) => { const n = new Set(s); n.delete(companyId); return n; });
  }, [user]);

  return { followedIds, loading, follow, unfollow, refresh, isFollowing: (id: string) => followedIds.has(id) };
}
