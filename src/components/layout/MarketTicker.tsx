import { useEffect, useState, useRef } from "react";
import { TrendingUp, TrendingDown, Minus, Flame, AlertTriangle, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TickerItem {
  id: string;
  icon: React.ReactNode;
  text: string;
  type: "trend" | "demand" | "activity" | "supply";
}

interface ProductLite {
  id: string;
  name: string;
  origin: string | null;
  category: string | null;
  price_min: number | null;
  price_max: number | null;
  trend_direction: string | null;
  demand_score: number | null;
  stock_band: string | null;
}

async function fetchTickerItems(): Promise<TickerItem[]> {
  const items: TickerItem[] = [];

  const { data: products } = await supabase
    .from("products")
    .select("id,name,origin,category,price_min,price_max,trend_direction,demand_score,stock_band")
    .eq("is_hidden", false)
    .limit(40);

  const list = (products ?? []) as ProductLite[];

  list
    .filter((p) => p.trend_direction === "rising" || p.trend_direction === "falling")
    .slice(0, 3)
    .forEach((p) => {
      const rising = p.trend_direction === "rising";
      const range =
        p.price_min && p.price_max
          ? ` (₹${Number(p.price_min).toLocaleString()}–₹${Number(p.price_max).toLocaleString()})`
          : "";
      items.push({
        id: `trend-${p.id}`,
        icon: rising ? (
          <TrendingUp className="h-3.5 w-3.5 text-red-400" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 text-green-400" />
        ),
        text: `${p.name} ${rising ? "↑ Rising" : "↓ Falling"}${range}`,
        type: "trend",
      });
    });

  list
    .filter((p) => p.trend_direction === "stable")
    .slice(0, 2)
    .forEach((p) => {
      items.push({
        id: `stable-${p.id}`,
        icon: <Minus className="h-3.5 w-3.5 text-yellow-400" />,
        text: `${p.name} → Stable`,
        type: "trend",
      });
    });

  list
    .filter((p) => (p.demand_score ?? 0) >= 70)
    .slice(0, 2)
    .forEach((p) => {
      items.push({
        id: `demand-${p.id}`,
        icon: <Flame className="h-3.5 w-3.5 text-orange-400" />,
        text: `High demand for ${p.name}`,
        type: "demand",
      });
    });

  list
    .filter((p) => p.stock_band === "low")
    .slice(0, 2)
    .forEach((p) => {
      items.push({
        id: `supply-${p.id}`,
        icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />,
        text: `Limited stock: ${p.origin ? p.origin + " " : ""}${p.name}`,
        type: "supply",
      });
    });

  // Live RFQ count in last hour
  const sinceIso = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("rfqs")
    .select("id", { count: "exact", head: true })
    .gte("created_at", sinceIso);

  if ((count ?? 0) > 0) {
    items.push({
      id: "activity-rfq",
      icon: <Users className="h-3.5 w-3.5 text-blue-400" />,
      text: `${count} RFQs sent in the last hour`,
      type: "activity",
    });
  }

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
          Live Market
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
