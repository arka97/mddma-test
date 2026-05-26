type Demand = "high" | "medium" | "low";
type Supply = "tight" | "tightening" | "stable" | "increasing";

const DEMAND_TONE: Record<Demand, string> = {
  high: "bg-warning/15 text-warning-foreground",
  medium: "bg-muted text-muted-foreground",
  low: "bg-success/10 text-success",
};

const SUPPLY_TONE: Record<Supply, string> = {
  tight: "bg-danger/10 text-danger",
  tightening: "bg-warning/15 text-warning-foreground",
  stable: "bg-muted text-muted-foreground",
  increasing: "bg-success/10 text-success",
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function DemandSupplyChips({ demand, supply }: { demand: Demand; supply: Supply }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px]">
      <span className="inline-flex items-center gap-1">
        <span className="font-semibold uppercase tracking-wide text-muted-foreground">Demand</span>
        <span className={`rounded-full px-2 py-0.5 font-semibold ${DEMAND_TONE[demand]}`}>{cap(demand)}</span>
      </span>
      <span className="inline-flex items-center gap-1">
        <span className="font-semibold uppercase tracking-wide text-muted-foreground">Supply</span>
        <span className={`rounded-full px-2 py-0.5 font-semibold ${SUPPLY_TONE[supply]}`}>{cap(supply)}</span>
      </span>
    </div>
  );
}
