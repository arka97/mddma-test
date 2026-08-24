import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCheck, Heart, MessageSquareText, Megaphone, Repeat2, TrendingUp, UserPlus } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications, notificationHref, type AppNotification } from "@/hooks/useNotifications";
import { NotificationSettings } from "@/components/notifications/NotificationSettings";
import { shortTimeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";

const ICONS: Record<string, typeof Bell> = {
  like: Heart,
  comment: MessageSquareText,
  repost: Repeat2,
  follow: UserPlus,
  deal_message: MessageSquareText,
  quotation: MessageSquareText,
  rfq_reply: MessageSquareText,
  circular: Megaphone,
  market_signal: TrendingUp,
};

function Row({ n }: { n: AppNotification }) {
  const Icon = ICONS[n.type] ?? Bell;
  const initials = (n.actor_name || "G").slice(0, 1).toUpperCase();
  const label =
    n.group_count > 1 && (n.type === "like" || n.type === "repost")
      ? `${n.title} and ${n.group_count - 1} other${n.group_count > 2 ? "s" : ""}`
      : n.title;

  return (
    <Link
      to={notificationHref(n)}
      className={cn(
        "flex gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-muted/50",
        !n.read_at && "bg-primary/[0.04]",
      )}
    >
      <span className="mt-1 shrink-0">
        <Icon className="h-5 w-5 text-gold-dark" />
      </span>
      <div className="min-w-0 flex-1">
        {n.actor_id && (
          <Avatar className="mb-1.5 h-7 w-7">
            <AvatarImage src={n.actor_avatar ?? undefined} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        )}
        <div className="text-sm font-medium text-foreground">{label}</div>
        {n.body && <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{n.body}</p>}
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">{shortTimeAgo(n.created_at)}</span>
    </Link>
  );
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, isLoading, unreadCount, markAllRead } = useNotifications(50);

  useEffect(() => {
    if (unreadCount > 0) {
      const t = setTimeout(() => markAllRead(), 1500);
      return () => clearTimeout(t);
    }
  }, [unreadCount, markAllRead]);

  return (
    <Layout>
      <Seo title="Notifications | G-BAU-G" description="Your activity on G-BAU-G." path="/notifications" noindex />
      <div className="mx-auto max-w-2xl pb-24">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h1 className="text-lg font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={() => markAllRead()}>
              <CheckCheck className="mr-1.5 h-4 w-4" /> Mark all read
            </Button>
          )}
        </div>

        {!user ? (
          <div className="px-4 py-16 text-center">
            <p className="text-sm text-muted-foreground">Sign in to see your notifications.</p>
            <Button asChild className="mt-3">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        ) : isLoading ? (
          <div className="px-4 py-16 text-center text-sm text-muted-foreground">Loading…</div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              Nothing yet. Replies, follows and bulletins will show up here.
            </p>
          </div>
        ) : (
          <div>
            {notifications.map((n) => (
              <Row key={n.id} n={n} />
            ))}
          </div>
        )}

        {user && (
          <div className="px-4 pt-6">
            <NotificationSettings />
          </div>
        )}
      </div>
    </Layout>
  );
}
