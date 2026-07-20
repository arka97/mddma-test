import { cn } from "@/lib/utils";
import type { TopicTag } from "@/repositories/communityPosts";

const CHIPS: { id: TopicTag | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "price_signals", label: "Price Signals" },
  { id: "market_alerts", label: "Market Alerts" },
  { id: "sourcing", label: "Sourcing" },
  { id: "member_news", label: "Member News" },
  { id: "polls", label: "Polls" },
];

interface Props {
  active: TopicTag | "all";
  onChange: (t: TopicTag | "all") => void;
}

export function TopicChips({ active, onChange }: Props) {
  return (
    <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1">
      {CHIPS.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onChange(c.id)}
          className={cn(
            "shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            active === c.id
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-card text-muted-foreground hover:text-foreground",
          )}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
