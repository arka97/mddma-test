import { useState } from "react";
import { getCommodityImage, unsplashUrl } from "@/lib/commodityImages";

interface CommodityImageProps {
  commodity: string;
  alt?: string;
  className?: string;
  // size hint for the requested CDN crop. Layout sizing is via className.
  width?: number;
  height?: number;
  // visual aspect ratio of the rendered box. "16/10" by default.
  aspect?: "16/10" | "4/3" | "1/1" | "3/2";
  rounded?: boolean;
  loading?: "eager" | "lazy";
}

const ASPECT: Record<NonNullable<CommodityImageProps["aspect"]>, string> = {
  "16/10": "aspect-[16/10]",
  "4/3":   "aspect-[4/3]",
  "1/1":   "aspect-square",
  "3/2":   "aspect-[3/2]",
};

export function CommodityImage({
  commodity,
  alt,
  className = "",
  width = 600,
  height = 400,
  aspect = "16/10",
  rounded = true,
  loading = "lazy",
}: CommodityImageProps) {
  const entry = getCommodityImage(commodity);
  const [errored, setErrored] = useState(false);
  const radius = rounded ? "rounded-md" : "";

  return (
    <div
      className={`relative overflow-hidden ${ASPECT[aspect]} ${radius} bg-gradient-to-br ${entry.bg} ${className}`}
    >
      {!errored && (
        <img
          src={unsplashUrl(entry.unsplashId, width, height)}
          alt={alt ?? commodity}
          loading={loading}
          decoding="async"
          onError={() => setErrored(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {errored && (
        <div className="absolute inset-0 flex items-center justify-center text-5xl select-none">
          <span aria-hidden>{entry.emoji}</span>
        </div>
      )}
    </div>
  );
}

export default CommodityImage;
