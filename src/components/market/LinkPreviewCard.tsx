import { X, Link2, Play, FileText, ImageIcon } from "lucide-react";
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
  const kind = preview.kind ?? "link";
  const isVideo = kind === "video";
  const isImage = kind === "image";
  const isPdf = kind === "pdf";
  const hasImage = !!preview.image;

  const heroLayout = hasImage || isImage;

  const meta = (
    <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
      {isPdf ? <FileText className="h-3 w-3" /> : isImage ? <ImageIcon className="h-3 w-3" /> : <Link2 className="h-3 w-3" />}
      <span className="truncate">{site}</span>
    </div>
  );

  const textBlock = (
    <div className="min-w-0 flex-1 px-3 py-2">
      {meta}
      {preview.title && (
        <div className="mt-0.5 line-clamp-2 text-sm font-semibold text-foreground">
          {preview.title}
        </div>
      )}
      {preview.description && (
        <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
          {preview.description}
        </p>
      )}
    </div>
  );

  let content: React.ReactNode;

  if (heroLayout) {
    content = (
      <div className="overflow-hidden">
        <div className="relative aspect-video w-full bg-muted">
          {preview.image && (
            <img
              src={preview.image}
              alt={preview.title ?? ""}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          )}
          {isVideo && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/65 shadow-lg">
                <Play className="h-7 w-7 translate-x-0.5 fill-white text-white" />
              </div>
            </div>
          )}
        </div>
        {(preview.title || preview.description || !isImage) && textBlock}
      </div>
    );
  } else if (isPdf) {
    content = (
      <div className="flex items-center gap-3 p-3">
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-md bg-primary/10 text-primary">
          <FileText className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          {meta}
          <div className="mt-0.5 truncate text-sm font-semibold text-foreground">
            {preview.title ?? "PDF document"}
          </div>
        </div>
      </div>
    );
  } else {
    content = <div className="flex overflow-hidden">{textBlock}</div>;
  }

  return (
    <div className="relative mt-2 overflow-hidden rounded-xl border border-border bg-card">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 text-xs text-muted-foreground">
          Loading preview…
        </div>
      )}
      {asLink ? (
        <a href={preview.url} target="_blank" rel="noreferrer noopener" className="block hover:bg-muted/40">
          {content}
        </a>
      ) : content}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
          className="absolute right-1.5 top-1.5 z-20 rounded-full bg-background/90 p-1 text-muted-foreground shadow hover:text-foreground"
          aria-label="Remove preview"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
