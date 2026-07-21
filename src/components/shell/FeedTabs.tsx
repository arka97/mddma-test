import { cn } from "@/lib/utils";

export type FeedTab = "for_you" | "following" | "market" | "rfq" | "bulletin";

const TABS: Array<{ id: FeedTab; label: string }> = [
  { id: "for_you", label: "For you" },
  { id: "following", label: "Following" },
  { id: "market", label: "Market" },
  { id: "rfq", label: "RFQ" },
  { id: "bulletin", label: "Bulletin" },
];

export function FeedTabs({ active, onChange }: { active: FeedTab; onChange: (t: FeedTab) => void }) {
  return (
    <div className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur lg:top-0">
      <div className="flex overflow-x-auto">
        {TABS.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={cn(
                "relative flex-1 min-w-[80px] px-3 py-4 text-sm font-semibold transition-colors hover:bg-muted/50",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <span className="relative inline-block pb-3">
                {t.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-[13px] mx-auto h-1 w-12 rounded-full bg-primary" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
