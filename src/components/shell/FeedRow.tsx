import { Link } from "react-router-dom";
import { ShieldCheck, Package, Users, FileText, Bell, MessageCircle, Repeat2, ThumbsUp, BarChart2 } from "lucide-react";
import type { FeedItem } from "@/hooks/queries/useUnifiedFeed";
import { PostCard } from "@/components/market/PostCard";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { listLikes } from "@/repositories/postLikes";
import { commentCounts } from "@/repositories/postComments";
import { viewCounts } from "@/repositories/postViews";

interface RowChromeProps {
  chipIcon: React.ReactNode;
  chipLabel: string;
  href: string;
  title: React.ReactNode;
  meta?: React.ReactNode;
  body?: React.ReactNode;
  thumbnail?: string | null;
}

function AutoRow({ chipIcon, chipLabel, href, title, meta, body, thumbnail }: RowChromeProps) {
  return (
    <Link to={href} className="feed-row block">
      <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary/40 bg-primary/5 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
        {chipIcon} {chipLabel}
      </div>
      <div className="flex gap-3">
        {thumbnail && (
          <img src={thumbnail} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" loading="lazy" />
        )}
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold leading-snug text-foreground">{title}</div>
          {meta && <div className="mt-0.5 text-xs text-muted-foreground">{meta}</div>}
          {body && <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{body}</div>}
        </div>
      </div>
    </Link>
  );
}

export function FeedRow({
  item,
  authors,
  likes,
  comments,
  views,
}: {
  item: FeedItem;
  authors: Record<string, { id: string; full_name: string | null; avatar_url: string | null; company_name?: string | null }>;
  likes: { counts: Record<string, number>; mine: Set<string> };
  comments: Record<string, number>;
  views: Record<string, number>;
}) {
  const { user } = useAuth();
  const { role } = useRole();
  const isAdmin = role === "admin";
  const canEngage = !!user && (role === "paid_member" || role === "broker" || role === "admin");

  switch (item.kind) {
    case "post": {
      const p = item.data;
      return (
        <div className="feed-row px-0 py-0">
          <PostCard
            post={p}
            author={authors[p.author_id]}
            liked={likes.mine.has(p.id)}
            likeCount={likes.counts[p.id] ?? 0}
            commentCount={comments[p.id] ?? 0}
            viewCount={views[p.id] ?? 0}
            canEngage={canEngage}
            isAdmin={isAdmin}
          />
        </div>
      );
    }
    case "product": {
      const p = item.data;
      const priceHint = p.price_min && p.price_max ? `₹${p.price_min}–₹${p.price_max} ${p.unit ?? ""}` : "Price on request";
      return (
        <AutoRow
          chipIcon={<Package className="h-3 w-3" />}
          chipLabel="New product"
          href={`/products/${p.slug}`}
          title={p.name}
          meta={<>{p.category ?? "—"} · {priceHint}</>}
          body={p.description}
          thumbnail={p.image_url}
        />
      );
    }
    case "member": {
      const m = item.data;
      const loc = m.city ?? m.state ?? "";
      const cat = (m.categories ?? [])[0];
      return (
        <AutoRow
          chipIcon={<Users className="h-3 w-3" />}
          chipLabel="New member"
          href={`/store/${m.slug}`}
          title={
            <span className="inline-flex items-center gap-1.5">
              {m.name}
              {m.is_verified && <ShieldCheck className="h-3.5 w-3.5 text-success" />}
            </span>
          }
          meta={<>{loc}{cat ? ` · ${cat}` : ""}</>}
        />
      );
    }
    case "rfq": {
      const r = item.data;
      return (
        <AutoRow
          chipIcon={<FileText className="h-3 w-3" />}
          chipLabel={`RFQ · ${r.listing_type === "buy" ? "Buying" : "Selling"}`}
          href="/rfq"
          title={r.commodity}
          meta={<>{r.quantity_min}–{r.quantity_max} {r.quantity_unit} · valid till {new Date(r.valid_until).toLocaleDateString()}</>}
          body={r.notes ?? r.grade_variety ?? ""}
        />
      );
    }
    case "circular": {
      const c = item.data;
      return (
        <AutoRow
          chipIcon={<Bell className="h-3 w-3" />}
          chipLabel="Bulletin"
          href="/circulars"
          title={c.title}
          meta={c.category ?? "Notice"}
          body={c.body}
        />
      );
    }
    case "ad": {
      const a = item.data;
      const inner = (
        <div className="feed-row">
          <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Promoted</div>
          <img src={a.image_url} alt={a.title} className="w-full rounded-xl object-cover" loading="lazy" />
        </div>
      );
      return a.link_url ? <a href={a.link_url} target="_blank" rel="noopener noreferrer">{inner}</a> : inner;
    }
    default:
      return null;
  }
}

// Batch loader for post metadata to avoid N+1 queries in the feed
export function usePostMeta(items: FeedItem[]) {
  const [authors, setAuthors] = useState<Record<string, { id: string; full_name: string | null; avatar_url: string | null; company_name?: string | null }>>({});
  const [likes, setLikes] = useState<{ counts: Record<string, number>; mine: Set<string> }>({ counts: {}, mine: new Set() });
  const [comments, setComments] = useState<Record<string, number>>({});
  const [views, setViews] = useState<Record<string, number>>({});

  useEffect(() => {
    const posts = items.filter((i): i is Extract<FeedItem, { kind: "post" }> => i.kind === "post").map((i) => i.data);
    if (!posts.length) return;
    const ids = posts.map((p) => p.id);
    const aIds = Array.from(new Set(posts.filter((p) => !p.is_anonymous).map((p) => p.author_id)));
    (async () => {
      const [l, c, v, profs] = await Promise.all([
        listLikes(ids),
        commentCounts(ids),
        viewCounts(ids),
        aIds.length
          ? supabase.from("profiles").select("id,full_name,avatar_url,company_name").in("id", aIds)
          : Promise.resolve({ data: [] as Array<{ id: string; full_name: string | null; avatar_url: string | null; company_name?: string | null }> }),
      ]);
      setLikes(l);
      setComments(c);
      setViews(v);
      const map: Record<string, { id: string; full_name: string | null; avatar_url: string | null; company_name?: string | null }> = {};
      ((profs.data ?? []) as Array<{ id: string; full_name: string | null; avatar_url: string | null; company_name?: string | null }>).forEach((p) => { map[p.id] = p; });
      setAuthors(map);
    })();
  }, [items]);

  return { authors, likes, comments, views };
}
