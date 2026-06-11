import { Link } from "react-router-dom";
import { ArrowRight, LineChart } from "lucide-react";
import { useMarketSignals } from "@/hooks/queries/useMarketSignals";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendArrow } from "@/components/commodity/TrendArrow";

export function MarketSnapshot() {
  const { data: signals, isLoading } = useMarketSignals();
  const items = (signals ?? []).slice(0, 6);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <header className="mb-3 flex items-end justify-between gap-2">
        <div>
          <p className="t-eyebrow inline-flex items-center gap-1.5 text-accent">
            <LineChart className="h-3.5 w-3.5" /> Market
          </p>
          <h2 className="t-h3 mt-1 text-foreground">Today's rate snapshot</h2>
        </div>
        <Link to="/market" className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-accent hover:text-accent/80">
          Full market <ArrowRight className="h-3 w-3" />
        </Link>
      </header>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-9 rounded-md" />)}
        </div>
      ) : items.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">No market signals yet.</p>
      ) : (
        <ul className="divide-y divide-border/60">
          {items.map((s) => (
            <li key={s.id} className="flex items-center gap-3 py-2.5 text-sm">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{s.commodity_name}</p>
                {s.origin && <p className="truncate text-[11px] text-muted-foreground">{s.origin}</p>}
              </div>
              <div className="shrink-0 font-mono tabular-nums text-xs text-foreground/90">
                {s.price_min != null && s.price_max != null
                  ? `₹${Number(s.price_min).toLocaleString()}–${Number(s.price_max).toLocaleString()}/${s.unit}`
                  : "On request"}
              </div>
              <TrendArrow trend={s.trend} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
