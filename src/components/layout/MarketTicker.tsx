import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface TickerItem {
  id: string;
  name: string;
  origin: string | null;
  range: string;
}

interface ProductLite {
  id: string;
  name: string;
  origin: string | null;
  price_min: number | null;
  price_max: number | null;
  unit: string | null;
}

async function fetchTickerItems(): Promise<TickerItem[]> {
  const { data: products } = await supabase
    .from("products")
    .select("id,name,origin,price_min,price_max,unit")
    .eq("is_hidden", false)
    .limit(40);

  const list = (products ?? []) as ProductLite[];

  return list
    .filter((p) => p.price_min != null && p.price_max != null)
    .slice(0, 12)
    .map((p) => ({
      id: p.id,
      name: p.name,
      origin: p.origin,
      range: `₹${Number(p.price_min).toLocaleString()}–${Number(p.price_max).toLocaleString()}/${p.unit ?? "kg"}`,
    }));
}

export function MarketTicker() {
  const [items, setItems] = useState<TickerItem[] | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    fetchTickerItems().then((next) => { if (alive) setItems(next); });
    const interval = setInterval(() => {
      fetchTickerItems().then((next) => { if (alive) setItems(next); });
    }, 60000);
    return () => { alive = false; clearInterval(interval); };
  }, []);

  if (items === null) {
    return <Skeleton className="h-9 w-full rounded-md" />;
  }

  if (items.length === 0) return null;

  return (
    <div
      className="overflow-hidden rounded-md border border-border/60 bg-foreground/95 text-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center">
        <div className="flex flex-shrink-0 items-center gap-1.5 border-r border-background/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-success">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          Live
        </div>

        <div className="flex-1 overflow-hidden" ref={scrollRef}>
          <div
            className={`flex whitespace-nowrap ${isPaused ? "[animation-play-state:paused]" : ""}`}
            style={{ animation: "ticker-scroll 50s linear infinite" }}
          >
            {[...items, ...items].map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs"
              >
                <span className="font-medium text-background/95">{item.name}</span>
                {item.origin && <span className="text-background/60">· {item.origin}</span>}
                <span className="font-mono tabular-nums text-background/90">{item.range}</span>
                <span className="text-background/20">│</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
