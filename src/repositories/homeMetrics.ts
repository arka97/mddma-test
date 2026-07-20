import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

export interface HomeMetrics {
  verifiedBusinesses: number;
  recentBulletins: number;
  activeRfqs: number;
}

/**
 * Lightweight homepage counters. Keep these reads outside presentation components
 * so Lovable-generated UI changes do not duplicate Supabase query logic.
 */
export async function getHomeMetrics(): Promise<HomeMetrics> {
  const quarterAgo = new Date(Date.now() - 90 * 86400_000).toISOString();

  const [businessesResult, bulletinsResult, rfqsResult] = await Promise.all([
    supabase
      .from("companies_public" as never)
      .select("id", { count: "exact", head: true })
      .eq("is_hidden", false)
      .eq("review_status", "approved"),
    supabase
      .from("circulars")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true)
      .gte("published_at", quarterAgo),
    supabase
      .from("rfq_listings" as never)
      .select("id", { count: "exact", head: true })
      .eq("is_hidden", false)
      .eq("status", "open")
      .gte("valid_until", new Date().toISOString().slice(0, 10)),
  ]);

  const error = businessesResult.error ?? bulletinsResult.error ?? rfqsResult.error;
  if (error) throw new Error(friendlyErrorMessage(error as never));

  return {
    verifiedBusinesses: businessesResult.count ?? 0,
    recentBulletins: bulletinsResult.count ?? 0,
    activeRfqs: rfqsResult.count ?? 0,
  };
}
