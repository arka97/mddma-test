import { Link } from "react-router-dom";
import { ExternalLink, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BrandRow } from "@/repositories/brands";

export function BrandCard({ brand }: { brand: BrandRow }) {
  return (
    <Card className="overflow-hidden card-hover h-full flex flex-col bg-card border-border">
      <Link to={`/brands/${brand.slug}`} className="block">
        <div className="aspect-[16/9] bg-muted overflow-hidden">
          {brand.cover_url ? (
            <img src={brand.cover_url} alt={brand.name} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
              {brand.logo_url ? (
                <img src={brand.logo_url} alt={brand.name} className="h-16 max-w-[60%] object-contain" />
              ) : (
                <Sparkles className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="flex items-start gap-3">
          {brand.logo_url && (
            <div className="h-10 w-10 flex-shrink-0 rounded border border-border bg-background overflow-hidden flex items-center justify-center">
              <img src={brand.logo_url} alt="" className="h-full w-full object-contain" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <Link to={`/brands/${brand.slug}`} className="block font-semibold text-foreground hover:text-accent truncate">
              {brand.name}
            </Link>
            {brand.tagline && <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{brand.tagline}</p>}
          </div>
        </div>
        {brand.categories && brand.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {brand.categories.slice(0, 3).map((c) => (
              <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
            ))}
          </div>
        )}
        {brand.b2c_url && (
          <a
            href={brand.b2c_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs text-accent hover:underline"
          >
            Buy retail <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}
