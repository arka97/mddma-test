import { useEffect, useState } from "react";
import { FileText, Download } from "lucide-react";
import { getMediaSignedUrl, formatBytes } from "@/lib/uploads";
import { Lightbox } from "@/components/ui/lightbox";
import { cn } from "@/lib/utils";

function useSigned(path: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    if (!path) { setUrl(null); return; }
    getMediaSignedUrl(path).then((u) => { if (alive) setUrl(u); });
    return () => { alive = false; };
  }, [path]);
  return url;
}

function useSignedMany(paths: string[]) {
  const [urls, setUrls] = useState<(string | null)[]>(() => paths.map(() => null));
  const key = paths.join("|");
  useEffect(() => {
    let alive = true;
    Promise.all(paths.map((p) => getMediaSignedUrl(p).catch(() => null))).then((res) => {
      if (alive) setUrls(res);
    });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return urls;
}

/**
 * X-style media grid. Tap any image to open it full-screen in the lightbox.
 * Layouts: 1 = single wide, 2 = side-by-side, 3 = one tall + two stacked,
 * 4+ = 2×2 with a "+N" overflow badge on the last tile.
 */
export function PostImages({ paths }: { paths: string[] }) {
  const [viewer, setViewer] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });
  const urls = useSignedMany(paths.slice(0, 4));
  const resolved = urls.filter((u): u is string => !!u);

  if (!paths.length) return null;
  const count = Math.min(paths.length, 4);
  const extra = paths.length - 4;

  const openAt = (i: number) => setViewer({ open: true, index: i });

  const Tile = ({ i, className }: { i: number; className?: string }) => {
    const url = urls[i];
    return (
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); openAt(i); }}
        aria-label={`Open image ${i + 1}`}
        className={cn(
          "group relative overflow-hidden bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
      >
        {url ? (
          <img
            src={url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="h-full w-full animate-pulse bg-muted" />
        )}
        {i === 3 && extra > 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-lg font-bold text-white">
            +{extra}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      <div className="mt-3 overflow-hidden rounded-2xl border border-border">
        {count === 1 && (
          <Tile i={0} className="block max-h-[510px] w-full" />
        )}
        {count === 2 && (
          <div className="grid grid-cols-2 gap-0.5">
            <Tile i={0} className="aspect-[4/5]" />
            <Tile i={1} className="aspect-[4/5]" />
          </div>
        )}
        {count === 3 && (
          <div className="grid grid-cols-2 grid-rows-2 gap-0.5" style={{ height: 320 }}>
            <Tile i={0} className="row-span-2 h-full" />
            <Tile i={1} className="h-full" />
            <Tile i={2} className="h-full" />
          </div>
        )}
        {count === 4 && (
          <div className="grid grid-cols-2 grid-rows-2 gap-0.5" style={{ height: 320 }}>
            <Tile i={0} className="h-full" />
            <Tile i={1} className="h-full" />
            <Tile i={2} className="h-full" />
            <Tile i={3} className="h-full" />
          </div>
        )}
      </div>

      <Lightbox
        images={resolved}
        startIndex={Math.min(viewer.index, Math.max(resolved.length - 1, 0))}
        open={viewer.open && resolved.length > 0}
        onOpenChange={(o) => setViewer((v) => ({ ...v, open: o }))}
      />
    </>
  );
}

export function PostFileChip({ file }: { file: { path: string; name: string; size: number } }) {
  const url = useSigned(file.path);
  return (
    <a
      href={url ?? "#"}
      target="_blank"
      rel="noreferrer noopener"
      onClick={(e) => { e.stopPropagation(); if (!url) e.preventDefault(); }}
      className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-2 text-xs hover:bg-muted"
    >
      <FileText className="h-4 w-4 text-primary" />
      <span className="max-w-[200px] truncate font-medium">{file.name}</span>
      <span className="text-muted-foreground">· {formatBytes(file.size)}</span>
      <Download className="h-3.5 w-3.5 text-muted-foreground" />
    </a>
  );
}
