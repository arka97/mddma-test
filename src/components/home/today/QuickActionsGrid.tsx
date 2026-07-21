import { Link } from "react-router-dom";
import { Building2, FileSearch, LineChart, Megaphone } from "lucide-react";
import { useHomeMetrics } from "@/hooks/queries/useHomeMetrics";

interface Tile {
  label: string;
  meta: string;
  href: string;
  icon: typeof Building2;
  tone: "accent" | "primary" | "warning" | "gold";
}

const toneMap: Record<Tile["tone"], string> = {
  accent: "bg-primary/10 text-primary",
  primary: "bg-primary/10 text-primary",
  warning: "bg-primary/10 text-primary",
  gold: "bg-primary/10 text-primary",
};

export function QuickActionsGrid() {
  const { data: metrics } = useHomeMetrics();

  const tiles: Tile[] = [
    { label: "Market", meta: "Signals, reports and trade updates", href: "/market", icon: LineChart, tone: "primary" },
    {
      label: "Bulletin",
      meta: metrics ? `${metrics.recentBulletins} official updates` : "Official trade notices",
      href: "/circulars",
      icon: Megaphone,
      tone: "warning",
    },
    {
      label: "RFQ",
      meta: metrics ? `${metrics.activeRfqs} active requirements` : "Buying and selling requirements",
      href: "/rfq",
      icon: FileSearch,
      tone: "gold",
    },
    {
      label: "Businesses",
      meta: metrics ? `${metrics.verifiedBusinesses} approved profiles` : "Explore verified businesses",
      href: "/directory",
      icon: Building2,
      tone: "accent",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        return (
          <Link
            key={tile.label}
            to={tile.href}
            className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${toneMap[tile.tone]}`}>
              <Icon className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-foreground">{tile.label}</div>
              <div className="line-clamp-2 text-[11px] leading-4 text-muted-foreground">{tile.meta}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
