import { useEffect, useState } from "react";
import { Bell, MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { listFeedEvents, type FeedEvent } from "@/repositories/feedEvents";
import { useDealRoomsActivity } from "@/hooks/useDealRoomsActivity";

/**
 * Header bell. Surfaces recent platform activity (new members, listings,
 * bulletins) plus a shortcut to deal rooms when there is unread chat.
 */
export function NotificationsButton() {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const { hasActivity } = useDealRoomsActivity();

  useEffect(() => {
    listFeedEvents(6)
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  const hasDot = hasActivity || events.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-[20px] w-[20px]" />
          {hasDot && (
            <span
              aria-hidden
              className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card"
            />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hasActivity && (
          <DropdownMenuItem asChild>
            <Link to="/messages">
              <MessageSquareText className="mr-2 h-4 w-4" />
              New activity in your deal rooms
            </Link>
          </DropdownMenuItem>
        )}
        {events.length === 0 && !hasActivity ? (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
            Nothing new right now.
          </div>
        ) : (
          events.map((e) => (
            <DropdownMenuItem key={`${e.kind}-${e.id}`} asChild>
              <Link to={e.href ?? "/"} className="flex flex-col items-start gap-0.5">
                <span className="line-clamp-2 text-sm">{e.title}</span>
                {e.subtitle && (
                  <span className="line-clamp-1 text-xs text-muted-foreground">{e.subtitle}</span>
                )}
              </Link>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
