import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { listAdsByPlacement, type AdRow } from "@/repositories/advertisements";

interface Props {
  placement: string;
}

export function AdSlot({ placement }: Props) {
  const [ads, setAds] = useState<AdRow[] | null>(null);

  useEffect(() => {
    let alive = true;
    listAdsByPlacement(placement)
      .then((data) => { if (alive) setAds(data); })
      .catch(() => { if (alive) setAds([]); });
    return () => { alive = false; };
  }, [placement]);

  if (!ads || ads.length === 0) return null;
  const ad = ads[0];

  return (
    <a
      href={ad.link_url ?? "#"}
      target={ad.link_url ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-2xl border border-border bg-muted/40 shadow-sm transition-shadow hover:shadow-md"
    >
      <span className="absolute right-3 top-3 z-10 rounded-md bg-background/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
        Ad
      </span>
      {ad.image_url && (
        <div className="aspect-[16/7] w-full overflow-hidden bg-muted">
          <img src={ad.image_url} alt={ad.title} className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]" loading="lazy" />
        </div>
      )}
      <div className="flex items-center justify-between gap-3 p-3">
        <p className="line-clamp-2 text-sm font-medium text-foreground">{ad.title}</p>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-accent">
          Learn more <ExternalLink className="h-3 w-3" />
        </span>
      </div>
    </a>
  );
}
