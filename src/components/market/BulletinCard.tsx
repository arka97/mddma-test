import { useEffect, useState } from "react";
import { Calendar, FileText, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { signPrivatePath } from "@/lib/storage";
import type { CircularRow, CircularAttachment } from "@/repositories/circulars";

function useSignedAttachments(attachments: CircularAttachment[]) {
  const [items, setItems] = useState<CircularAttachment[]>([]);
  const key = attachments.map((a) => a.url).join("|");
  useEffect(() => {
    let alive = true;
    Promise.all(
      attachments.map(async (a) => ({ ...a, url: (await signPrivatePath(a.url).catch(() => null)) ?? "" })),
    ).then((res) => { if (alive) setItems(res.filter((a) => !!a.url)); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return items;
}

/** Feed-styled bulletin (circular) item — rendered inline with posts. */
export function BulletinCard({ circular }: { circular: CircularRow }) {
  const attachments = useSignedAttachments(Array.isArray(circular.attachments) ? circular.attachments : []);
  const images = attachments.filter((a) => a.type === "image");
  const pdfs = attachments.filter((a) => a.type === "pdf");
  const date = circular.published_at ?? circular.created_at;

  return (
    <article className="px-4 py-3">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Megaphone className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            <span className="font-bold text-foreground">Bulletin</span>
            {circular.category && <Badge variant="neutral" className="capitalize">{circular.category}</Badge>}
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>

          <h3 className="mt-1 text-[15px] font-semibold text-foreground">{circular.title}</h3>
          {circular.body && (
            <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed text-foreground/90">{circular.body}</p>
          )}

          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-0.5 overflow-hidden rounded-2xl border border-border">
              {images.slice(0, 4).map((img, i) => (
                <a key={i} href={img.url} target="_blank" rel="noreferrer noopener" className="block">
                  <img src={img.url} alt={img.name} loading="lazy" className="h-32 w-full object-cover" />
                </a>
              ))}
            </div>
          )}

          {pdfs.map((pdf, i) => (
            <a
              key={i}
              href={pdf.url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-2 text-xs hover:bg-muted"
            >
              <FileText className="h-4 w-4 text-primary" />
              <span className="max-w-[220px] truncate font-medium">{pdf.name}</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
