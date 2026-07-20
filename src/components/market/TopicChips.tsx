import { cn } from "@/lib/utils";
import type { TopicTag } from "@/repositories/communityPosts";

const CHIPS: { id: TopicTag | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "price_signals", label: "Price signals" },
  { id: "market_alerts", label: "Market alerts" },
  { id: "member_news", label: "Business updates" },
  { id: "polls", label: "Polls" },
];

interface Props {
  active: TopicTag | "all";
  onChange: (topic: TopicTag | "all") => void;
}

export function TopicChips({ active, onChange }: Props) {
  return (
    <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1">
      {CHIPS.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={() => onChange(chip.id)}
          className={cn(
            "shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            active === chip.id
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-card text-muted-foreground hover:text-foreground",
          )}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
