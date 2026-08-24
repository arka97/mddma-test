import { Bell, CheckCheck, MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDealRoomsActivity } from "@/hooks/useDealRoomsActivity";
import { useNotifications, notificationHref } from "@/hooks/useNotifications";
import { shortTimeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";

/** Header bell: live unread count plus the most recent notifications. */
export function NotificationsButton() {
  const { hasActivity } = useDealRoomsActivity();
  const { notifications, unreadCount, markAllRead } = useNotifications(8);

  const badge = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-[20px] w-[20px]" />
          {unreadCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 min-w-[18px] rounded-full bg-primary px-1 text-[10px] font-bold leading-[18px] text-primary-foreground ring-2 ring-card">
              {badge}
            </span>
          ) : (
            hasActivity && (
              <span
                aria-hidden
                className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card"
              />
            )
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                markAllRead();
              }}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {hasActivity && (
          <DropdownMenuItem asChild>
            <Link to="/messages">
              <MessageSquareText className="mr-2 h-4 w-4" />
              New activity in your deal rooms
            </Link>
          </DropdownMenuItem>
        )}

        {notifications.length === 0 && !hasActivity ? (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
            Nothing new right now.
          </div>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem key={n.id} asChild>
              <Link
                to={notificationHref(n)}
                className={cn("flex flex-col items-start gap-0.5", !n.read_at && "bg-primary/[0.05]")}
              >
                <span className="line-clamp-2 text-sm">
                  {n.group_count > 1 && (n.type === "like" || n.type === "repost")
                    ? `${n.title} and ${n.group_count - 1} other${n.group_count > 2 ? "s" : ""}`
                    : n.title}
                </span>
                <span className="line-clamp-1 text-xs text-muted-foreground">
                  {n.body ? `${n.body} · ` : ""}
                  {shortTimeAgo(n.created_at)}
                </span>
              </Link>
            </DropdownMenuItem>
          ))
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/notifications" className="justify-center text-sm font-medium">
            See all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
