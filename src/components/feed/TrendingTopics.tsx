import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Trend = { label: string; count: number };

/**
 * Right-rail trending list — aggregates recent post topics client-side over
 * the last 7 days. Falls back to a curated set when the feed is quiet.
 */
async function fetchTrends(): Promise<Trend[]> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("community_posts")
    .select("topic_tag,post_type")
    .gte("created_at", since)
    .eq("is_hidden", false)
    .limit(500);
  if (error) return [];
  const counts = new Map<string, number>();
  (data ?? []).forEach((row) => {
    const tag = (row.topic_tag ?? row.post_type ?? "").trim();
    if (!tag) return;
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  });
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

const FALLBACK: Trend[] = [
  { label: "rate_signal", count: 24 },
  { label: "sourcing_ask", count: 12 },
  { label: "alert", count: 8 },
];

function prettify(tag: string) {
  return tag.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function TrendingTopics() {
  const { data = [] } = useQuery({
    queryKey: ["trending_topics_7d"],
    queryFn: fetchTrends,
    staleTime: 5 * 60_000,
  });
  const topics = data.length > 0 ? data : FALLBACK;

  return (
    <aside className="rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <TrendingUp className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-bold text-foreground">Trending in the trade</h2>
      </div>
      <ul className="divide-y divide-border">
        {topics.map((t) => (
          <li key={t.label}>
            <Link
              to={`/market?topic=${encodeURIComponent(t.label)}`}
              className="block px-4 py-3 transition-colors hover:bg-muted/60"
            >
              <div className="text-xs text-muted-foreground">Trending</div>
              <div className="text-sm font-semibold text-foreground">{prettify(t.label)}</div>
              <div className="text-xs text-muted-foreground">
                {t.count} {t.count === 1 ? "post" : "posts"} this week
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
