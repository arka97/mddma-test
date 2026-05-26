import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

type Trend = "up" | "down" | "flat";

export function TrendArrow({ trend, label = true }: { trend: Trend; label?: boolean }) {
  if (trend === "up") {
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-danger">
        <ArrowUpRight className="h-3.5 w-3.5" />
        {label && <span>Up</span>}
      </span>
    );
  }
  if (trend === "down") {
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-success">
        <ArrowDownRight className="h-3.5 w-3.5" />
        {label && <span>Down</span>}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-muted-foreground">
      <Minus className="h-3.5 w-3.5" />
      {label && <span>Flat</span>}
    </span>
  );
}
