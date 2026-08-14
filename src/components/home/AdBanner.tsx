import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdBannerProps {
  placement: "homepage-banner" | "category-banner" | "directory-sidebar";
}

interface LiveAd {
  id: string;
  title: string;
  image_url: string;
  mobile_image_url: string | null;
  link_url: string | null;
  placement: string;
  image_aspect: number | null;
  focal_y: number | null;
}

const MOBILE_SLOT_ASPECT = 32 / 5;
const DESKTOP_SLOT_ASPECT = 728 / 90;
const FIT_TOLERANCE = 0.15;

function fitMode(
  imageAspect: number | null | undefined,
  slotAspect: number,
  tolerance = FIT_TOLERANCE,
): "cover" | "contain" {
  if (!imageAspect || imageAspect <= 0) return "cover";
  const ratio = imageAspect / slotAspect;
  return ratio >= 1 - tolerance && ratio <= 1 + tolerance ? "cover" : "contain";
}

function objectPosition(focalY: number | null | undefined): string {
  const y = focalY == null ? 50 : Math.max(0, Math.min(100, focalY));
  return `center ${y}%`;
}

function AdBannerCard({ ad }: { ad: LiveAd }) {
  const isMobile = useIsMobile();
  const slotAspect = isMobile ? MOBILE_SLOT_ASPECT : DESKTOP_SLOT_ASPECT;
  const imageUrl = isMobile && ad.mobile_image_url ? ad.mobile_image_url : ad.image_url;
  const aspect = isMobile && ad.mobile_image_url ? undefined : ad.image_aspect;
  const mode = fitMode(aspect, slotAspect);
  const position = objectPosition(ad.focal_y);

  return (
    <a
      href={ad.link_url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="mx-auto block w-full max-w-[728px] rounded-lg border border-accent/30 bg-accent/5 hover:bg-accent/10 transition-colors overflow-hidden"
    >
      {imageUrl && (
        <div className="relative aspect-[32/5] w-full overflow-hidden bg-muted md:aspect-[728/90]">
          {mode === "contain" && (
            <img
              src={imageUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl"
            />
          )}
          <img
            src={imageUrl}
            alt={ad.title}
            className={cn(
              "relative z-[1] h-full w-full",
              mode === "cover" ? "object-cover" : "object-contain",
            )}
            style={{ objectPosition: position }}
            loading="lazy"
          />
        </div>
      )}
    </a>
  );
}

export function AdBanner({ placement }: AdBannerProps) {
  const [liveAds, setLiveAds] = useState<LiveAd[]>([]);

  useEffect(() => {
    let alive = true;
    supabase
      .from("advertisements")
      .select("id,title,image_url,mobile_image_url,link_url,placement,image_aspect,focal_y")
      .eq("placement", placement)
      .eq("is_active", true)
      .then(({ data }) => { if (alive) setLiveAds((data ?? []) as LiveAd[]); });
    return () => { alive = false; };
  }, [placement]);

  if (liveAds.length === 0) return null;

  return (
    <div className="space-y-3">
      {liveAds.map((ad) => (
        <AdBannerCard key={ad.id} ad={ad} />
      ))}
    </div>
  );
}
