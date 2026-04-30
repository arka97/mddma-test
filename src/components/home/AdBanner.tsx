import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AdBannerProps {
  placement: "homepage-banner" | "category-banner" | "directory-sidebar";
}

interface LiveAd {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  placement: string;
}

export function AdBanner({ placement }: AdBannerProps) {
  const [liveAds, setLiveAds] = useState<LiveAd[]>([]);

  useEffect(() => {
    let alive = true;
    supabase
      .from("advertisements")
      .select("id,title,image_url,link_url,placement")
      .eq("placement", placement)
      .eq("is_active", true)
      .then(({ data }) => { if (alive) setLiveAds((data ?? []) as LiveAd[]); });
    return () => { alive = false; };
  }, [placement]);

  if (liveAds.length === 0) return null;

  return (
    <div className="space-y-3">
      {liveAds.map((ad) => (
        <a
          key={ad.id}
          href={ad.link_url ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg border border-accent/30 bg-accent/5 hover:bg-accent/10 transition-colors overflow-hidden"
        >
          {ad.image_url && (
            <img src={ad.image_url} alt={ad.title} className="w-full h-auto object-cover" loading="lazy" />
          )}
          <div className="p-3 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-foreground">{ad.title}</p>
            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </div>
        </a>
      ))}
    </div>
  );
}
