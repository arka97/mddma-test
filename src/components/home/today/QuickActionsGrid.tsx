import { Link } from "react-router-dom";
import { Users, Megaphone, LineChart, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Tile {
  label: string;
  meta: string;
  href: string;
  icon: typeof Users;
  tone: "accent" | "primary" | "warning" | "gold";
}

const toneMap: Record<Tile["tone"], string> = {
  accent: "bg-accent/10 text-accent",
  primary: "bg-primary/10 text-primary",
  warning: "bg-warning/15 text-warning-foreground",
  gold: "bg-[hsl(var(--gold))]/15 text-[hsl(var(--gold-dark))]",
};

export function QuickActionsGrid() {
  const [circularCount, setCircularCount] = useState<number | null>(null);
  const [brandCount, setBrandCount] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    const since = new Date(Date.now() - 14 * 86400_000).toISOString();

    (async () => {
      const [{ count: circs }, { count: brands }] = await Promise.all([
        supabase.from("circulars").select("id", { count: "exact", head: true }).eq("is_published", true).gte("published_at", since),
        supabase.from("brands" as never).select("id", { count: "exact", head: true }),
      ]);
      if (!alive) return;
      setCircularCount(circs ?? 0);
      setBrandCount(brands ?? 0);
    })();

    return () => { alive = false; };
  }, []);

  const tiles: Tile[] = [
    {
      label: "Member Directory",
      meta: "Browse verified traders",
      href: "/directory",
      icon: Users,
      tone: "accent",
    },
    {
      label: "Circulars",
      meta: circularCount == null ? "Trade notices" : `${circularCount} new`,
      href: "/circulars",
      icon: Megaphone,
      tone: "warning",
    },
    {
      label: "Market",
      meta: "APMC rates & trends",
      href: "/market",
      icon: LineChart,
      tone: "primary",
    },
    {
      label: "Brands",
      meta: brandCount == null ? "House brands" : `${brandCount}+ brands`,
      href: "/brands",
      icon: Sparkles,
      tone: "gold",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {tiles.map((t) => {
        const Icon = t.icon;
        return (
          <Link
            key={t.label}
            to={t.href}
            className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${toneMap[t.tone]}`}>
              <Icon className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-foreground">{t.label}</div>
              <div className="truncate text-[11px] text-muted-foreground">{t.meta}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
