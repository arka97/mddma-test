import { Pin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CommunityPostRow } from "@/repositories/communityPosts";

interface RateRow {
  variant?: string;
  origin?: string;
  grade?: string;
  currency?: string;
  price_min?: number;
  price_max?: number;
  unit?: string;
}

interface Props {
  post: CommunityPostRow;
  likeCount: number;
  commentCount: number;
  viewCount: number;
}

export function PinnedRatesCard({ post, likeCount, commentCount, viewCount }: Props) {
  const data = (post.structured_data ?? {}) as { rows?: RateRow[]; title?: string; currency?: string };
  const rows = data.rows ?? [];

  return (
    <Card className="relative border-accent/30">
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <Badge className="bg-accent text-accent-foreground">Association market reference</Badge>
          <Pin className="h-4 w-4 text-accent" />
        </div>
        {data.title && <h3 className="mb-2 text-sm font-semibold text-foreground">{data.title}</h3>}
        {post.content && <p className="mb-3 text-xs leading-relaxed text-muted-foreground">{post.content}</p>}
        {rows.length > 0 && (
          <div className="overflow-x-auto rounded-md border border-border/60">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-2 py-1.5 text-left">Variant</th>
                  <th className="px-2 py-1.5 text-left">Origin</th>
                  <th className="px-2 py-1.5 text-left">Grade</th>
                  <th className="px-2 py-1.5 text-right">Indicative price</th>
                  <th className="px-2 py-1.5 text-left">Unit</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const currency = row.currency ?? data.currency ?? "INR";
                  return (
                    <tr key={index} className="border-t border-border/60">
                      <td className="px-2 py-1.5 font-medium text-foreground">{row.variant ?? "—"}</td>
                      <td className="px-2 py-1.5 text-muted-foreground">{row.origin ?? "—"}</td>
                      <td className="px-2 py-1.5 text-muted-foreground">{row.grade ?? "—"}</td>
                      <td className="px-2 py-1.5 text-right font-mono tabular-nums text-foreground">
                        {row.price_min != null && row.price_max != null
                          ? `${currency} ${row.price_min.toLocaleString()}–${row.price_max.toLocaleString()}`
                          : "—"}
                      </td>
                      <td className="px-2 py-1.5 text-muted-foreground">/{row.unit ?? "kg"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
          Informational reference only; not a quotation, offer or guarantee of available inventory.
        </p>
        <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
          <span>♥ {likeCount}</span>
          <span>💬 {commentCount}</span>
          <span>👁 {viewCount}</span>
        </div>
      </CardContent>
    </Card>
  );
}
