import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { PriceBand } from "@/components/commodity/PriceBand";
import { TrendArrow } from "@/components/commodity/TrendArrow";
import { DemandSupplyChips } from "@/components/commodity/DemandSupplyChips";
import type { MarketSignal } from "@/repositories/marketSignals";

interface Props {
  signal: MarketSignal;
  canSeeAnalyst: boolean;
}

export function SignalCard({ signal, canSeeAnalyst }: Props) {
  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">{signal.commodity_name}</h3>
          {signal.origin && (
            <p className="mt-0.5 text-[11px] text-muted-foreground">{signal.origin}</p>
          )}
        </div>
        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          <span className="font-bold text-foreground">{signal.inquiries_week}</span> inquiries / wk
        </span>
      </header>

      <div className="mt-3 flex items-end justify-between gap-3">
        <PriceBand min={signal.price_min} max={signal.price_max} unit={signal.unit} showIndicativeChip={false} />
        <TrendArrow trend={signal.trend} />
      </div>

      <div className="mt-3">
        <DemandSupplyChips demand={signal.demand} supply={signal.supply} />
      </div>

      <div className="mt-3 rounded-xl border border-border bg-muted/40 p-3">
        <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Analyst signal</div>
        {canSeeAnalyst || !signal.requires_paid ? (
          <p className="mt-1 text-xs text-foreground/90">{signal.analyst_note ?? "—"}</p>
        ) : (
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="line-clamp-2 select-none text-xs text-foreground/50 blur-[3px]" aria-hidden>
              {signal.analyst_note ?? "Committee analyst reasoning for paid members."}
            </p>
            <Link
              to="/membership"
              className="shrink-0 inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1 text-[11px] font-semibold text-background hover:opacity-90"
            >
              <Lock className="h-3 w-3" /> Unlock
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
