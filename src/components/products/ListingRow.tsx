import { Link } from "react-router-dom";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriceBand } from "@/components/commodity/PriceBand";

const EMOJI: Record<string, string> = {
  almond: "🌰", cashew: "🥜", date: "🌴", pistachio: "🌿",
  walnut: "🌰", raisin: "🍇", anjeer: "🟤", fig: "🟤", saffron: "🌺",
};
function emojiFor(name: string) {
  const k = (name ?? "").toLowerCase();
  for (const [key, e] of Object.entries(EMOJI)) if (k.includes(key)) return e;
  return "🌰";
}

const ORIGIN_SHORT: Record<string, string> = {
  "united states": "USA", "united states of america": "USA", "usa": "USA",
  "united kingdom": "UK", "uk": "UK",
  "united arab emirates": "UAE", "uae": "UAE",
  "south africa": "ZA", "saudi arabia": "KSA",
  "afghanistan": "AFG", "australia": "AUS",
};
function shortOrigin(s: string) {
  const k = s.trim().toLowerCase();
  if (ORIGIN_SHORT[k]) return ORIGIN_SHORT[k];
  if (s.length <= 8) return s.toUpperCase();
  return s.slice(0, 6).toUpperCase();
}


interface Props {
  href: string;
  name: string;
  meta?: string | null; // e.g. "Almonds · Iran 270"
  origin?: string | null;
  imageUrl?: string | null;
  priceMin: number | null | undefined;
  priceMax: number | null | undefined;
  unit?: string | null;
  hot?: boolean;
  onRequestQuote?: () => void;
}

export function ListingRow({
  href, name, meta, origin, imageUrl, priceMin, priceMax, unit, hot, onRequestQuote,
}: Props) {
  return (
    <article className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
      <Link to={href} className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full rounded-xl object-cover" loading="lazy" />
        ) : (
          <span aria-hidden>{emojiFor(name)}</span>
        )}
        {origin && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded bg-background/95 px-1 text-[8px] font-semibold uppercase tracking-wide text-foreground shadow">
            {origin}
          </span>
        )}
        {hot && (
          <span className="absolute -right-1 -top-1 rounded bg-accent px-1 text-[8px] font-bold uppercase tracking-wide text-accent-foreground">
            Hot
          </span>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <Link to={href} className="block">
          <h3 className="truncate text-sm font-semibold text-foreground">{name}</h3>
          {meta && <p className="truncate text-[11px] text-muted-foreground">{meta}</p>}
        </Link>
        <div className="mt-1">
          <PriceBand
            min={priceMin}
            max={priceMax}
            unit={unit ?? "kg"}
            showIndicativeChip={false}
            size="sm"
          />
        </div>
      </div>
      {onRequestQuote && (
        <Button size="sm" variant="outline" className="h-8 shrink-0 self-center text-xs" onClick={onRequestQuote}>
          <Send className="mr-1 h-3 w-3" /> RFQ
        </Button>
      )}
    </article>
  );
}
