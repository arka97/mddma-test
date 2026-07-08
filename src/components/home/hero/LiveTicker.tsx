import { Link } from "react-router-dom";
import { LineChart } from "lucide-react";
import { useMarketSignals } from "@/hooks/queries/useMarketSignals";
import { TrendArrow } from "@/components/commodity/TrendArrow";

export function LiveTicker() {
  const { data: signals, isLoading } = useMarketSignals();
  const items = (signals ?? []).slice(0, 10);

  if (!isLoading && items.length === 0) return null;

  const row = items.length > 0 ? [...items, ...items] : [];

  return (
    <Link
      to="/market"
      aria-label="Open full market"
      className="group relative flex items-stretch overflow-hidden rounded-xl border border-border bg-card shadow-sm"
    >
      <div className="flex shrink-0 items-center gap-1.5 border-r border-border bg-muted/40 px-3 text-[10px] font-bold uppercase tracking-widest text-accent">
        <LineChart className="h-3 w-3" /> Live
      </div>

      <div className="relative flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center px-3 py-2 text-xs text-muted-foreground">Loading APMC rates…</div>
        ) : (
          <div className="ticker-track flex items-center gap-6 whitespace-nowrap py-2 pl-4 pr-6 text-xs">
            {row.map((s, i) => (
              <span key={`${s.id}-${i}`} className="inline-flex items-center gap-2">
                <span className="font-medium text-foreground">{s.commodity_name}</span>
                {s.origin && <span className="text-muted-foreground">· {s.origin}</span>}
                <span className="font-mono tabular-nums text-foreground/90">
                  {s.price_min != null && s.price_max != null
                    ? `₹${Number(s.price_min).toLocaleString()}–${Number(s.price_max).toLocaleString()}/${s.unit}`
                    : "On request"}
                </span>
                <TrendArrow trend={s.trend} />
              </span>
            ))}
          </div>
        )}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-card to-transparent" />
      </div>
    </Link>
  );
}
