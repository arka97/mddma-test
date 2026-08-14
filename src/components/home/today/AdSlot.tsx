import { useEffect, useMemo, useState } from "react";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { listAdsByPlacement, type AdRow } from "@/repositories/advertisements";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  placement: string;
}

const MOBILE_SLOT_ASPECT = 32 / 5;      // 6.4
const DESKTOP_SLOT_ASPECT = 728 / 90;   // ~8.09
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

function AdCard({ ad }: { ad: AdRow }) {
  const isMobile = useIsMobile();
  const slotAspect = isMobile ? MOBILE_SLOT_ASPECT : DESKTOP_SLOT_ASPECT;
  const imageUrl = isMobile && ad.mobile_image_url ? ad.mobile_image_url : ad.image_url;
  const aspect = isMobile && ad.mobile_image_url ? undefined : ad.image_aspect;
  const mode = fitMode(aspect, slotAspect);
  const position = objectPosition(ad.focal_y);

  return (
    <a
      href={ad.link_url ?? "#"}
      target={ad.link_url ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="group relative mx-auto block w-full max-w-[728px] overflow-hidden rounded-xl border border-border bg-muted/40 shadow-sm transition-shadow hover:shadow-md"
    >
      <span className="absolute right-1.5 top-1.5 z-10 rounded-sm bg-background/80 px-1 py-px text-[8px] font-semibold uppercase tracking-wider text-muted-foreground leading-none">
        Ad
      </span>
      {imageUrl && (
        <div className="relative aspect-[32/5] w-full overflow-hidden bg-muted md:aspect-[728/90]">
          {/* Blurred backdrop for letterboxed creatives so the slot never looks empty */}
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
              "relative z-[1] h-full w-full transition-transform group-hover:scale-[1.02]",
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
  if (ads.length === 1) return <AdCard ad={ads[0]} />;

  return <AdCarousel ads={ads} />;
}

function AdCarousel({ ads }: { ads: AdRow[] }) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    prefersReducedMotion
      ? []
      : [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })],
  );

  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {ads.map((ad) => (
            <div key={ad.id} className="min-w-0 shrink-0 grow-0 basis-full">
              <AdCard ad={ad} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-1.5 flex justify-center gap-1">
        {ads.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to ad ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn(
              "h-1 rounded-full transition-all",
              i === selected ? "w-3 bg-accent" : "w-1 bg-muted-foreground/30 hover:bg-muted-foreground/60",
            )}
          />
        ))}
      </div>
    </div>
  );
}
