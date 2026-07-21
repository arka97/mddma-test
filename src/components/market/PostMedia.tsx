import { useEffect, useState } from "react";
import { FileText, Download } from "lucide-react";
import { getMediaSignedUrl, formatBytes } from "@/lib/uploads";
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

function SignedImg({ path, className }: { path: string; className?: string }) {
  const url = useSigned(path);
  if (!url) return <div className={cn("bg-muted animate-pulse", className)} />;
  return <img src={url} alt="" loading="lazy" className={cn("h-full w-full object-cover", className)} />;
}

export function PostImages({ paths }: { paths: string[] }) {
  if (!paths.length) return null;
  const grid =
    paths.length === 1 ? "grid-cols-1" :
    paths.length === 2 ? "grid-cols-2" :
    "grid-cols-2";
  return (
    <div className={cn("mt-2 grid gap-1 overflow-hidden rounded-md", grid)}>
      {paths.slice(0, 4).map((p, i) => (
        <div key={p} className={cn(
          "relative overflow-hidden bg-muted",
          paths.length === 3 && i === 0 ? "row-span-2 aspect-square" : "aspect-square"
        )}>
          <SignedImg path={p} />
        </div>
      ))}
    </div>
  );
}

export function PostFileChip({ file }: { file: { path: string; name: string; size: number } }) {
  const url = useSigned(file.path);
  return (
    <a
      href={url ?? "#"}
      target="_blank"
      rel="noreferrer noopener"
      onClick={(e) => { if (!url) e.preventDefault(); }}
      className="mt-2 inline-flex items-center gap-2 rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs hover:bg-muted/50"
    >
      <FileText className="h-4 w-4 text-primary" />
      <span className="max-w-[200px] truncate font-medium">{file.name}</span>
      <span className="text-muted-foreground">· {formatBytes(file.size)}</span>
      <Download className="h-3.5 w-3.5 text-muted-foreground" />
    </a>
  );
}
