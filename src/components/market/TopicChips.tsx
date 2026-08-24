import {
  Newspaper,
  PlayCircle,
  UserCheck,
  ScrollText,
  IndianRupee,
  Siren,
  Search,
  Users,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TopicTag } from "@/repositories/communityPosts";

export type FeedTopic = TopicTag | "all" | "reels" | "following" | "bulletin";

export const FEED_TOPIC_ORDER: FeedTopic[] = [
  "all",
  "reels",
  "following",
  "bulletin",
  "price_signals",
  "market_alerts",
  "sourcing",
  "member_news",
  "polls",
];

const CHIPS: { id: FeedTopic; label: string; icon: LucideIcon }[] = [
  { id: "all", label: "Updates", icon: Newspaper },
  { id: "reels", label: "Buzz", icon: PlayCircle },
  { id: "following", label: "Following", icon: UserCheck },
  { id: "bulletin", label: "Bulletin", icon: ScrollText },
  { id: "price_signals", label: "Price Signals", icon: IndianRupee },
  { id: "market_alerts", label: "Market Alerts", icon: Siren },
  { id: "sourcing", label: "Sourcing", icon: Search },
  { id: "member_news", label: "Member News", icon: Users },
  { id: "polls", label: "Polls", icon: BarChart3 },
];

interface Props {
  active: FeedTopic;
  onChange: (t: FeedTopic) => void;
}

export function TopicChips({ active, onChange }: Props) {
  return (
    <div className="rounded-xl bg-muted/40 px-1 py-2">
      <div className="snap-x snap-mandatory overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto flex w-fit items-start gap-1">

        {CHIPS.map((c) => {
          const Icon = c.icon;
          const isActive = active === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onChange(c.id)}
              aria-pressed={isActive}
              className="w-[22vw] max-w-[84px] shrink-0 snap-start rounded-lg px-0.5 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring lg:w-[84px]"
            >
              <span
                className={cn(
                  "mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed transition-colors sm:h-14 sm:w-14",
                  isActive
                    ? "border-primary border-solid bg-primary/10"
                    : "border-border bg-card",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 sm:h-6 sm:w-6",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                  strokeWidth={isActive ? 2.4 : 2}
                />
              </span>
              <span
                className={cn(
                  "mt-1 block text-center text-[11px] leading-tight transition-colors",
                  isActive ? "font-semibold text-foreground" : "font-medium text-muted-foreground",
                )}
              >
                {c.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
