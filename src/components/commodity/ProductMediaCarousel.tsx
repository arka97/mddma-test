import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { CommodityImage } from "./CommodityImage";

type Aspect = "16/10" | "4/3" | "1/1" | "3/2";

const ASPECT: Record<Aspect, string> = {
  "16/10": "aspect-[16/10]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
};

interface ProductMediaCarouselProps {
  commodity: string;
  images?: (string | null | undefined)[];
  videoUrl?: string | null;
  aspect?: Aspect;
  className?: string;
  rounded?: boolean;
  autoPlayMs?: number;
  videoControls?: boolean; // true on detail page; false on cards (muted autoplay)
  alt?: string;
}

interface Slide {
  type: "image" | "video";
  src: string;
}

export function ProductMediaCarousel({
  commodity,
  images,
  videoUrl,
  aspect = "16/10",
  className = "",
  rounded = false,
  autoPlayMs = 3500,
  videoControls = false,
  alt,
}: ProductMediaCarouselProps) {
  const slides: Slide[] = [
    ...(videoUrl ? [{ type: "video" as const, src: videoUrl }] : []),
    ...(images ?? [])
      .filter((s): s is string => Boolean(s && s.trim()))
      .map<Slide>((src) => ({ type: "image", src })),
  ];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || paused || reducedMotion.current) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, autoPlayMs);
    return () => window.clearInterval(id);
  }, [slides.length, paused, autoPlayMs]);

  // No seller media → fallback to stock photo so legacy listings still look fine.
  if (slides.length === 0) {
    return (
      <CommodityImage
        commodity={commodity}
        alt={alt}
        aspect={aspect}
        rounded={rounded}
        className={className}
      />
    );
  }

  const radius = rounded ? "rounded-md" : "";
  const current = slides[Math.min(index, slides.length - 1)];

  const go = (dir: 1 | -1) => {
    setIndex((i) => (i + dir + slides.length) % slides.length);
  };

  return (
    <div
      className={`relative overflow-hidden ${ASPECT[aspect]} ${radius} bg-muted group ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {current.type === "image" ? (
        <img
          src={current.src}
          alt={alt ?? commodity}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <video
            key={current.src}
            src={current.src}
            className="absolute inset-0 h-full w-full object-cover bg-black"
            muted
            playsInline
            loop
            autoPlay={!videoControls}
            controls={videoControls}
            preload="metadata"
          />
          {!videoControls && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-10 w-10 rounded-full bg-background/70 backdrop-blur flex items-center justify-center">
                <Play className="h-5 w-5 text-foreground" />
              </div>
            </div>
          )}
        </>
      )}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              go(-1);
            }}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-background/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              go(1);
            }}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-background/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </button>
          <div className="absolute bottom-1.5 left-0 right-0 flex items-center justify-center gap-1">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-4 bg-background"
                    : "w-1.5 bg-background/60 hover:bg-background/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductMediaCarousel;
