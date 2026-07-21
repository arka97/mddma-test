import { cn } from "@/lib/utils";

export type FeedTab = "for_you" | "following";

interface Props {
  active: FeedTab;
  onChange: (t: FeedTab) => void;
  followingDisabled?: boolean;
}

/**
 * X-style two-tab header for the community feed. "Following" is disabled
 * for signed-out users (the caller controls this via `followingDisabled`).
 */
export function FeedTabs({ active, onChange, followingDisabled }: Props) {
  const tabs: { id: FeedTab; label: string; disabled?: boolean }[] = [
    { id: "for_you", label: "For you" },
    { id: "following", label: "Following", disabled: followingDisabled },
  ];

  return (
    <div role="tablist" className="grid grid-cols-2 border-b border-border bg-background/95 backdrop-blur">
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={isActive}
            disabled={t.disabled}
            onClick={() => !t.disabled && onChange(t.id)}
            className={cn(
              "relative flex h-12 items-center justify-center text-sm font-semibold transition-colors",
              isActive ? "text-foreground" : "text-muted-foreground hover:bg-muted/60",
              t.disabled && "cursor-not-allowed opacity-50",
            )}
          >
            <span className="relative py-3">
              {t.label}
              {isActive && (
                <span className="absolute inset-x-0 -bottom-[1px] h-1 rounded-full bg-primary" aria-hidden />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
