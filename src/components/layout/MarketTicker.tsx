import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TickerItem {
  id: string;
  text: string;
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
    .slice(0, 10)
    .map((p) => {
      const range = `₹${Number(p.price_min).toLocaleString()}–₹${Number(p.price_max).toLocaleString()}/${p.unit ?? "kg"}`;
      const origin = p.origin ? ` · ${p.origin}` : "";
      return { id: `price-${p.id}`, text: `${p.name}${origin} · ${range}` };
    });
}

export function MarketTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);
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

  if (items.length < 1) return null;

  return (
    <div
      className="bg-muted text-navy border-b border-border overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-accent text-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest z-10 flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Live
        </div>

        <div className="overflow-hidden flex-1" ref={scrollRef}>
          <div
            className={`flex whitespace-nowrap ${isPaused ? "[animation-play-state:paused]" : ""}`}
            style={{ animation: "ticker-scroll 40s linear infinite" }}
          >
            {[...items, ...items].map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs"
              >
                <span className="text-navy/85">{item.text}</span>
                <span className="text-navy/20 ml-3">│</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
