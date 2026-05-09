import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LiveAd {
  id: string;
  title: string;
  link_url: string | null;
}

export function SponsorsSection() {
  const [ads, setAds] = useState<LiveAd[]>([]);

  useEffect(() => {
    let alive = true;
    const today = new Date().toISOString().slice(0, 10);
    supabase
      .from("advertisements")
      .select("id,title,link_url,start_date,end_date,is_active")
      .eq("is_active", true)
      .lte("start_date", today)
      .then(({ data }) => {
        if (!alive) return;
        const filtered = (data ?? []).filter(
          (a: { end_date: string | null }) => !a.end_date || a.end_date >= today,
        );
        setAds(filtered as LiveAd[]);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (ads.length === 0) return null;

  return (
    <section className="py-12 bg-muted border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-muted-foreground uppercase tracking-wider mb-6">
          Our Partners & Sponsors
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {ads.map((ad) => (
            <a
              key={ad.id}
              href={ad.link_url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg bg-card border border-border hover:border-accent/50 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {ad.title}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
