// Read-time feed event union: derives system cards from existing tables
// without triggers. Cheap, cacheable, and easy to iterate on.

import { supabase } from "@/integrations/supabase/client";

export type FeedEvent =
  | {
      kind: "circular_published";
      id: string;
      created_at: string;
      title: string;
      category: string | null;
    }
  | {
      kind: "member_verified";
      id: string;
      created_at: string;
      company_id: string;
      name: string;
      slug: string;
      logo_url: string | null;
      city: string | null;
    };

export async function listFeedEvents(limit = 8): Promise<FeedEvent[]> {
  const since = new Date(Date.now() - 30 * 86400000).toISOString();

  const [circulars, verified] = await Promise.all([
    supabase
      .from("circulars")
      .select("id,title,category,published_at,created_at")
      .eq("is_published", true)
      .gte("published_at", since)
      .order("published_at", { ascending: false })
      .limit(limit),
    supabase
      .from("companies_public")
      .select("id,name,slug,logo_url,city,is_verified,updated_at")
      .eq("is_verified", true)
      .gte("updated_at", since)
      .order("updated_at", { ascending: false })
      .limit(limit),
  ]);

  const events: FeedEvent[] = [];
  (circulars.data ?? []).forEach((c) => {
    events.push({
      kind: "circular_published",
      id: `circular:${c.id}`,
      created_at: c.published_at ?? c.created_at,
      title: c.title,
      category: c.category ?? null,
    });
  });
  (verified.data ?? []).forEach((co) => {
    if (!co.id || !co.slug || !co.name) return;
    events.push({
      kind: "member_verified",
      id: `member:${co.id}`,
      created_at: co.updated_at ?? new Date().toISOString(),
      company_id: co.id,
      name: co.name,
      slug: co.slug,
      logo_url: co.logo_url ?? null,
      city: co.city ?? null,
    });
  });

  return events.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}
