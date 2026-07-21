import { useEffect, useState } from "react";
import { listFeedPosts, type CommunityPostRow } from "@/repositories/communityPosts";
import { listProducts, type ProductRow } from "@/repositories/products";
import { listCirculars, type CircularRow } from "@/repositories/circulars";
import { listAdsByPlacement, type AdRow } from "@/repositories/advertisements";
import { listActiveRfqs, type RfqListingRow } from "@/repositories/rfqListings";
import { supabase } from "@/integrations/supabase/client";

export type FeedTab = "for_you" | "following" | "market" | "rfq" | "bulletin";

export type FeedItem =
  | { kind: "post"; ts: number; data: CommunityPostRow }
  | { kind: "product"; ts: number; data: ProductRow }
  | { kind: "member"; ts: number; data: MemberRow }
  | { kind: "rfq"; ts: number; data: RfqListingRow }
  | { kind: "circular"; ts: number; data: CircularRow }
  | { kind: "ad"; ts: number; data: AdRow };

export interface MemberRow {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  state: string | null;
  categories: string[] | null;
  is_verified: boolean | null;
  created_at: string;
}

const t = (v?: string | null) => (v ? new Date(v).getTime() : 0);

async function fetchMembers(): Promise<MemberRow[]> {
  const { data } = await supabase
    .from("companies")
    .select("id,name,slug,city,state,categories,is_verified,created_at")
    .eq("review_status", "approved")
    .order("created_at", { ascending: false })
    .limit(20);
  return ((data ?? []) as unknown) as MemberRow[];
}

async function fetchFollowing(): Promise<Set<string>> {
  const { data } = await supabase.from("follows").select("followed_company_id");
  return new Set(((data ?? []) as Array<{ followed_company_id: string }>).map((r) => r.followed_company_id));
}

export function useUnifiedFeed(tab: FeedTab) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((x) => x + 1);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      const [posts, products, members, rfqBuys, rfqSells, circulars, ads] = await Promise.all([
        listFeedPosts().catch(() => []),
        listProducts().catch(() => []),
        fetchMembers().catch(() => []),
        listActiveRfqs("buy").catch(() => []),
        listActiveRfqs("sell").catch(() => []),
        listCirculars({ publishedOnly: true }).catch(() => []),
        listAdsByPlacement("homepage-banner").catch(() => []),
      ]);

      const following = tab === "following" ? await fetchFollowing().catch(() => new Set<string>()) : null;

      const merged: FeedItem[] = [];
      const inFollowing = (companyId: string | null | undefined) =>
        !following || (companyId && following.has(companyId));

      if (tab === "for_you" || tab === "following") {
        posts.forEach((p) => merged.push({ kind: "post", ts: t(p.created_at), data: p }));
        products.slice(0, 15).forEach((p) => {
          if (inFollowing(p.company_id)) merged.push({ kind: "product", ts: t(p.created_at), data: p });
        });
        members.forEach((m) => {
          if (inFollowing(m.id)) merged.push({ kind: "member", ts: t(m.created_at), data: m });
        });
        [...rfqBuys, ...rfqSells].forEach((r) => {
          if (inFollowing(r.company_id)) merged.push({ kind: "rfq", ts: t(r.created_at), data: r });
        });
        circulars.slice(0, 5).forEach((c) => merged.push({ kind: "circular", ts: t(c.published_at ?? c.created_at), data: c }));
      } else if (tab === "market") {
        posts
          .filter((p) => ["price_signal", "market_alert", "admin_rate_update", "general", "member_news", "sourcing_ask", "poll"].includes(p.post_type))
          .forEach((p) => merged.push({ kind: "post", ts: t(p.created_at), data: p }));
      } else if (tab === "rfq") {
        [...rfqBuys, ...rfqSells].forEach((r) => merged.push({ kind: "rfq", ts: t(r.created_at), data: r }));
      } else if (tab === "bulletin") {
        circulars.forEach((c) => merged.push({ kind: "circular", ts: t(c.published_at ?? c.created_at), data: c }));
      }

      merged.sort((a, b) => b.ts - a.ts);

      // Inject an ad every ~7 items
      if (ads.length && merged.length > 3) {
        const out: FeedItem[] = [];
        let adIx = 0;
        merged.forEach((it, i) => {
          out.push(it);
          if ((i + 1) % 7 === 0 && ads[adIx % ads.length]) {
            const ad = ads[adIx % ads.length];
            out.push({ kind: "ad", ts: it.ts, data: ad });
            adIx++;
          }
        });
        if (alive) setItems(out);
      } else if (alive) {
        setItems(merged);
      }
      if (alive) setLoading(false);
    })();
    return () => { alive = false; };
  }, [tab, tick]);

  return { items, loading, refresh };
}
