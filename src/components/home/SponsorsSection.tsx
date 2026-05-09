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
    <section className="border-t border-border bg-background py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="t-eyebrow mb-6 text-center text-muted-foreground">Our partners</p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {ads.map((ad) => (
            <a
              key={ad.id}
              href={ad.link_url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground grayscale transition hover:text-foreground hover:grayscale-0"
            >
              {ad.title}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
