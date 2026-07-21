import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

const TOPICS: Array<{ label: string; count: string; href: string }> = [
  { label: "Almonds", count: "24 signals today", href: "/market?topic=rate_signal" },
  { label: "Dates — Ajwa", count: "12 asks open", href: "/market?topic=sourcing_ask" },
  { label: "Cashew W320", count: "8 alerts", href: "/market?topic=alert" },
  { label: "Pistachios", count: "6 updates", href: "/market?topic=rate_signal" },
  { label: "Walnuts", count: "5 asks", href: "/market?topic=sourcing_ask" },
];

/**
 * Right-rail trending list. Static curation for now — swap for a
 * post-tag aggregation query once the community feed has enough volume.
 */
export function TrendingTopics() {
  return (
    <aside className="rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <TrendingUp className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-bold text-foreground">Trending in the trade</h2>
      </div>
      <ul className="divide-y divide-border">
        {TOPICS.map((t) => (
          <li key={t.label}>
            <Link to={t.href} className="block px-4 py-3 transition-colors hover:bg-muted/60">
              <div className="text-sm font-semibold text-foreground">{t.label}</div>
              <div className="text-xs text-muted-foreground">{t.count}</div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
