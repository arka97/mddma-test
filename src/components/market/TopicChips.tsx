import { cn } from "@/lib/utils";
import type { TopicTag } from "@/repositories/communityPosts";

export type FeedTopic = TopicTag | "all" | "following" | "bulletin";

const CHIPS: { id: FeedTopic; label: string }[] = [
  { id: "all", label: "For You" },
  { id: "following", label: "Following" },
  { id: "bulletin", label: "Bulletin" },
  { id: "price_signals", label: "Price Signals" },
  { id: "market_alerts", label: "Market Alerts" },
  { id: "sourcing", label: "Sourcing" },
  { id: "member_news", label: "Member News" },
  { id: "polls", label: "Polls" },
];


interface Props {
  active: FeedTopic;
  onChange: (t: FeedTopic) => void;
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
