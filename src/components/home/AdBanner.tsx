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
          className="mx-auto block w-full max-w-[728px] rounded-lg border border-accent/30 bg-accent/5 hover:bg-accent/10 transition-colors overflow-hidden"
        >
          {ad.image_url && (
            <div className="aspect-[32/5] w-full overflow-hidden bg-muted md:aspect-[728/90]">
              <img src={ad.image_url} alt={ad.title} className="h-full w-full object-cover" loading="lazy" />
            </div>
          )}
          <div className="p-2 flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-foreground line-clamp-1">{ad.title}</p>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          </div>
        </a>
      ))}
    </div>
  );
}
