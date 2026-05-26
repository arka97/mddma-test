import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Crown, Lock, Sparkles } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { useRole } from "@/contexts/RoleContext";
import { useAnalystReports, useMarketSignals } from "@/hooks/queries/useMarketSignals";
import { SignalCard } from "@/components/market/SignalCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Filter = "all" | "high_demand" | "tight_supply" | "rising";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "high_demand", label: "High demand" },
  { id: "tight_supply", label: "Tight supply" },
  { id: "rising", label: "Rising" },
];

const Market = () => {
  const { canAccess } = useRole();
  const isPaid = canAccess("market_intelligence");
  const { data: signals, isLoading } = useMarketSignals();
  const { data: reports } = useAnalystReports();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (!signals) return [];
    return signals.filter((s) => {
      if (filter === "high_demand") return s.demand === "high";
      if (filter === "tight_supply") return s.supply === "tight" || s.supply === "tightening";
      if (filter === "rising") return s.trend === "up";
      return true;
    });
  }, [signals, filter]);

  return (
    <Layout>
      <Seo title="Market Intelligence — MDDMA" description="Signal-based market intelligence for MDDMA members." path="/market" noindex />

      <div className="container mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* Hero */}
        <header className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Market Intelligence</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Signal-based market intel — price ranges, demand indicators, and supply signals from the MDDMA committee.
          </p>
        </header>

        {!isPaid && (
          <article className="mb-5 flex flex-col items-start gap-3 rounded-2xl border border-accent/40 bg-accent/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Crown className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <div className="text-sm font-semibold text-foreground">Unlock full Market Intelligence</div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Committee analyst reasoning + weekly supply alerts.
                </p>
              </div>
            </div>
            <Button asChild variant="accent" size="sm" className="w-full sm:w-auto">
              <Link to="/membership">View plans</Link>
            </Button>
          </article>
        )}

        {/* Filter chips */}
        <div className="-mx-1 mb-4 flex items-center gap-2 overflow-x-auto px-1 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                filter === f.id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Section header */}
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Live signals</h2>
            <p className="text-xs text-muted-foreground">
              {signals ? `${filtered.length} commodit${filtered.length === 1 ? "y" : "ies"} tracked` : "Loading…"}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            <Sparkles className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
            {signals && signals.length === 0
              ? "No active market signals yet — committee analysts will publish soon."
              : "No signals match the selected filter."}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((s) => (
              <SignalCard key={s.id} signal={s} canSeeAnalyst={isPaid} />
            ))}
          </div>
        )}

        {/* Weekly insights */}
        {reports && reports.length > 0 && (
          <section className="mt-8">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">Weekly insights</h2>
                <p className="text-xs text-muted-foreground">Committee analyst reports</p>
              </div>
              {!isPaid && (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Lock className="h-3 w-3 text-accent" /> Paid-member feed
                </span>
              )}
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {reports.map((r) => {
                const locked = r.requires_paid && !isPaid;
                return (
                  <li key={r.id} className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-accent">{r.kind}</div>
                    <h3 className={cn("mt-1 text-sm font-semibold text-foreground", locked && "blur-[2px]")}>{r.title}</h3>
                    {r.body && (
                      <p className={cn("mt-1 line-clamp-2 text-xs text-muted-foreground", locked && "blur-[3px] select-none")}>
                        {r.body}
                      </p>
                    )}
                    {locked && (
                      <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-background via-background/60 to-transparent p-3">
                        <Button asChild variant="accent" size="sm">
                          <Link to="/membership"><Lock className="mr-1 h-3 w-3" /> Unlock</Link>
                        </Button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Market;
