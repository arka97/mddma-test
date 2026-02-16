import { sampleAdvertisers } from "@/data/sampleData";
import { ExternalLink } from "lucide-react";

interface AdBannerProps {
  placement: "homepage-banner" | "category-banner" | "directory-sidebar";
}

export function AdBanner({ placement }: AdBannerProps) {
  const ads = sampleAdvertisers.filter(
    (a) => a.isActive && a.placement === placement
  );

  if (ads.length === 0) return null;

  return (
    <div className="space-y-3">
      {ads.map((ad) => (
        <a
          key={ad.id}
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg border border-border bg-accent/5 hover:bg-accent/10 transition-colors p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">{ad.bannerText}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Sponsored by {ad.companyName}
              </p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </div>
        </a>
      ))}
    </div>
  );
}
