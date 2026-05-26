import { cn } from "@/lib/utils";

interface Props {
  min: number | null | undefined;
  max: number | null | undefined;
  unit?: string | null;
  showIndicativeChip?: boolean;
  footnote?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceBand({ min, max, unit, showIndicativeChip = true, footnote, size = "md", className }: Props) {
  const has = min != null && max != null;
  const sizes = {
    sm: { value: "text-sm", unit: "text-[10px]" },
    md: { value: "text-base", unit: "text-xs" },
    lg: { value: "text-2xl sm:text-3xl", unit: "text-xs sm:text-sm" },
  }[size];

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {showIndicativeChip && (
        <span className="inline-flex w-fit items-center rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
          Indicative
        </span>
      )}
      <div className="flex items-baseline gap-1 font-semibold tabular-nums text-foreground">
        {has ? (
          <>
            <span className={sizes.value}>
              ₹{Number(min).toLocaleString()}–{Number(max).toLocaleString()}
            </span>
            <span className={cn(sizes.unit, "font-normal text-muted-foreground")}>/{unit ?? "kg"}</span>
          </>
        ) : (
          <span className={cn(sizes.value, "text-muted-foreground")}>On request</span>
        )}
      </div>
      {footnote && <p className="text-[11px] text-muted-foreground">{footnote}</p>}
    </div>
  );
}
