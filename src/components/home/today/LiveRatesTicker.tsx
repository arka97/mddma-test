import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface TickerItem {
  id: string;
  name: string;
  origin: string | null;
  range: string;
}

const FALLBACK: TickerItem[] = [
  { id: "f1", name: "Mamra Almond", origin: "Iran 270", range: "₹1,820–1,860/kg" },
  { id: "f2", name: "Cashew W320", origin: "Vietnam", range: "₹770–790/kg" },
  { id: "f3", name: "Pistachio", origin: "Kerman A", range: "₹2,220–2,300/kg" },
  { id: "f4", name: "Medjool Date", origin: "Jordan", range: "₹680–720/kg" },
  { id: "f5", name: "Anjeer", origin: "Afghan", range: "₹1,120–1,180/kg" },
  { id: "f6", name: "Walnut", origin: "Kashmir", range: "₹920–960/kg" },
];

export function LiveRatesTicker() {
  const [items, setItems] = useState<TickerItem[] | null>(null);

  useEffect(() => {
    let alive = true;
    supabase
      .from("products")
      .select("id,name,origin,price_min,price_max,unit")
      .eq("is_hidden", false)
      .limit(40)
      .then(({ data }) => {
        if (!alive) return;
        const live = (data ?? [])
          .filter((p) => p.price_min != null && p.price_max != null)
          .slice(0, 12)
          .map((p) => ({
            id: p.id,
            name: p.name as string,
            origin: p.origin as string | null,
            range: `₹${Number(p.price_min).toLocaleString()}–${Number(p.price_max).toLocaleString()}/${p.unit ?? "kg"}`,
          }));
        setItems(live.length > 0 ? live : FALLBACK);
      });
    return () => { alive = false; };
  }, []);

  if (items === null) return <Skeleton className="h-10 w-full rounded-xl" />;

  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-foreground/95 text-background">
      <div className="flex items-center">
        <div className="flex shrink-0 items-center gap-1.5 border-r border-background/15 px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-success">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          Live
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex whitespace-nowrap" style={{ animation: "ticker-scroll 60s linear infinite" }}>
            {loop.map((item, i) => (
              <div key={`${item.id}-${i}`} className="inline-flex items-center gap-2 px-4 py-2.5 text-xs">
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
