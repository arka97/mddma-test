import { BadgeCheck, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import type { FeedEvent } from "@/repositories/feedEvents";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export function SystemEventCard({ event }: { event: FeedEvent }) {
  if (event.kind === "circular_published") {
    return (
      <Link
        to="/circulars"
        className="flex gap-3 px-4 py-3 transition hover:bg-muted/40"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-muted-foreground">
            New bulletin · {timeAgo(event.created_at)}
            {event.category ? ` · ${event.category}` : ""}
          </p>
          <p className="mt-0.5 truncate text-[15px] font-semibold text-foreground">
            {event.title}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/store/${event.slug}`}
      className="flex gap-3 px-4 py-3 transition hover:bg-muted/40"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
        {event.logo_url ? (
          <img src={event.logo_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <BadgeCheck className="h-5 w-5 text-accent" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] text-muted-foreground">
          New verified member · {timeAgo(event.created_at)}
        </p>
        <p className="mt-0.5 flex items-center gap-1 truncate text-[15px] font-semibold text-foreground">
          {event.name}
          <BadgeCheck className="h-4 w-4 shrink-0 text-accent" />
        </p>
        {event.city && (
          <p className="truncate text-[13px] text-muted-foreground">{event.city}</p>
        )}
      </div>
    </Link>
  );
}
