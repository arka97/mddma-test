import { useEffect, useState } from "react";
import { useMarketSignals } from "@/hooks/queries/useMarketSignals";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface TickerItem {
  id: string;
  name: string;
  origin: string | null;
  range: string;
}

export function LiveRatesTicker() {
  const { data: signals } = useMarketSignals();
  const [fallback, setFallback] = useState<TickerItem[] | null>(null);

  useEffect(() => {
    if (signals && signals.length > 0) return;
    let alive = true;
    supabase
      .from("products")
      .select("id,name,origin,price_min,price_max,unit")
      .eq("is_hidden", false)
      .not("price_min", "is", null)
      .not("price_max", "is", null)
      .limit(12)
      .then(({ data }) => {
        if (!alive) return;
        setFallback(
          (data ?? []).map((p) => ({
            id: p.id,
            name: p.name as string,
            origin: p.origin as string | null,
            range: `₹${Number(p.price_min).toLocaleString()}–${Number(p.price_max).toLocaleString()}/${p.unit ?? "kg"}`,
          })),
        );
      });
    return () => { alive = false; };
  }, [signals]);

  const items: TickerItem[] | null =
    signals && signals.length > 0
      ? signals.slice(0, 12).map((s) => ({
          id: s.id,
          name: s.commodity_name,
          origin: s.origin,
          range:
            s.price_min != null && s.price_max != null
              ? `₹${Number(s.price_min).toLocaleString()}–${Number(s.price_max).toLocaleString()}/${s.unit}`
              : "On request",
        }))
      : fallback;

  if (items === null) return <Skeleton className="h-10 w-full rounded-xl" />;
  if (items.length === 0) return null;

  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-foreground/95 text-background">
      <div className="flex items-center">
        <div className="flex shrink-0 items-center gap-1.5 border-r border-background/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-success">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          Live
        </div>
        <div className="flex-1 overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)" }}>
          <div className="flex whitespace-nowrap motion-reduce:animate-none" style={{ animation: "ticker-scroll 60s linear infinite" }}>
            {loop.map((item, i) => (
              <div key={`${item.id}-${i}`} className="inline-flex items-center gap-2 px-4 py-1.5 text-xs">
                <span className="font-medium text-background/95">{item.name}</span>
                {item.origin && <span className="text-background/60">· {item.origin}</span>}
                <span className="font-mono tabular-nums text-background/90">{item.range}</span>
                <span className="px-1 text-background/25">│</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
