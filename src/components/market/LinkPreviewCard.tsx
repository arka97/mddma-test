import { X, Link2 } from "lucide-react";
import type { LinkPreview } from "@/lib/linkPreview";

interface Props {
  preview: LinkPreview;
  onRemove?: () => void;
  loading?: boolean;
  asLink?: boolean;
}

function hostOf(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}

export function LinkPreviewCard({ preview, onRemove, loading, asLink = true }: Props) {
  const site = preview.site_name || hostOf(preview.url);

  const content = (
    <div className="flex overflow-hidden">
      {preview.image && (
        <img
          src={preview.image}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-20 w-20 flex-none object-cover sm:h-24 sm:w-24"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      )}
      <div className="min-w-0 flex-1 p-2 sm:p-3">
        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
          <Link2 className="h-3 w-3" />
          <span className="truncate">{site}</span>
        </div>
        {preview.title && (
          <div className="mt-0.5 line-clamp-2 text-xs font-semibold text-foreground sm:text-sm">
            {preview.title}
          </div>
        )}
        {preview.description && (
          <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
            {preview.description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative mt-2 overflow-hidden rounded-md border border-border bg-muted/30">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 text-xs text-muted-foreground">
          Loading preview…
        </div>
      )}
      {asLink ? (
        <a href={preview.url} target="_blank" rel="noreferrer noopener" className="block hover:bg-muted/50">
          {content}
        </a>
      ) : content}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
          className="absolute right-1 top-1 z-20 rounded-full bg-background/90 p-1 text-muted-foreground hover:text-foreground"
          aria-label="Remove preview"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
