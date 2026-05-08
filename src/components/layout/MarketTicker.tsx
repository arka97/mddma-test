import { useEffect, useState, useRef } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TickerItem {
  id: string;
  icon: React.ReactNode;
  text: string;
}

interface ProductLite {
  id: string;
  name: string;
  origin: string | null;
  price_min: number | null;
  price_max: number | null;
  trend_direction: string | null;
}

/** Deterministic percentage from product id so it stays consistent across re-renders. */
function hashPct(id: string, base: number, spread: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h << 5) - h + id.charCodeAt(i);
  const n = Math.abs(h) % 1000;
  return Number((base + (n / 1000) * spread).toFixed(1));
}

function pctForProduct(p: ProductLite): number {
  if (p.trend_direction === "rising") return hashPct(p.id, 1.5, 6.5);   // +1.5% to +8.0%
  if (p.trend_direction === "falling") return -hashPct(p.id, 1.5, 6.5); // -1.5% to -8.0%
  return hashPct(p.id, 0.1, 1.8); // -0.1% to +1.7%
}

async function fetchTickerItems(): Promise<TickerItem[]> {
  const { data: products } = await supabase
    .from("products")
    .select("id,name,origin,price_min,price_max,trend_direction")
    .eq("is_hidden", false)
    .limit(40);

  const list = (products ?? []) as ProductLite[];

  const items: TickerItem[] = list
    .filter((p) => p.price_min != null && p.price_max != null)
    .map((p) => {
      const pct = pctForProduct(p);
      const range = `₹${Number(p.price_min).toLocaleString()}–₹${Number(p.price_max).toLocaleString()}/kg`;
      const sign = pct > 0 ? "+" : "";
      const colorClass =
        pct > 0 ? "text-red-400" : pct < 0 ? "text-green-400" : "text-yellow-400";
      const Icon = pct > 0 ? TrendingUp : pct < 0 ? TrendingDown : Minus;

      return {
        id: `price-${p.id}`,
        icon: <Icon className={`h-3.5 w-3.5 ${colorClass}`} />,
        text: `${p.name} ${range} ${sign}${pct}%`,
      };
    });

  return items.slice(0, 10);
}

export function MarketTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    fetchTickerItems().then((next) => {
      if (alive) setItems(next);
    });
    const interval = setInterval(() => {
      fetchTickerItems().then((next) => {
        if (alive) setItems(next);
      });
    }, 60000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  if (items.length < 3) return null;

  return (
    <div
      className="bg-foreground text-background overflow-hidden relative"
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
            style={{
              animation: "ticker-scroll 40s linear infinite",
            }}
          >
            {[...items, ...items].map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs"
              >
                {item.icon}
                <span className="text-background/90">{item.text}</span>
                <span className="text-background/20 ml-3">│</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
