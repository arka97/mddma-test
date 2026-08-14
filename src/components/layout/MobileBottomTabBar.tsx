import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Compass, FileText, Home, MessageSquareText, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { useDealRoomsActivity } from "@/hooks/useDealRoomsActivity";
import { ComposeSheet } from "@/components/market/ComposeSheet";

interface Tab {
  label: string;
  href: string;
  icon: typeof Home;
  match: (path: string) => boolean;
  requireAuth?: boolean;
  dot?: boolean;
}

export function MobileBottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { role } = useRole();
  const { hasActivity } = useDealRoomsActivity();
  const [composeOpen, setComposeOpen] = useState(false);

  const left: Tab[] = [
    { label: "Home", href: "/", icon: Home, match: (p) => p === "/" },
    {
      label: "Discover",
      href: "/discover",
      icon: Search,
      match: (p) => p.startsWith("/discover") || p.startsWith("/directory") || p.startsWith("/store") || p.startsWith("/products"),
    },
  ];

  const right: Tab[] = [
    { label: "RFQ", href: "/rfq", icon: FileText, match: (p) => p.startsWith("/rfq") },
    {
      label: "Chat",
      href: "/messages",
      icon: MessageSquareText,
      match: (p) => p.startsWith("/messages") || p.startsWith("/quotes"),
      requireAuth: true,
      dot: hasActivity,
    },
  ];

  const renderTab = (tab: Tab) => {
    const active = tab.match(location.pathname);
    const Icon = tab.icon;
    const target = tab.requireAuth && !user ? `/login?next=${encodeURIComponent(tab.href)}` : tab.href;
    return (
      <li key={tab.label} className="flex-1">
        <Link
          to={target}
          aria-current={active ? "page" : undefined}
          aria-label={tab.label}
          className={cn(
            "group relative flex min-h-[54px] flex-col items-center justify-center gap-0.5 px-1 pb-1.5 pt-2 text-[10px] font-medium transition-colors touch-action-manipulation",
            active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span className="relative">
            <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.6 : 2} />
            {tab.dot && (
              <span
                aria-hidden
                className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background"
              />
            )}
          </span>
          <span className={cn(active && "font-semibold")}>{tab.label}</span>
        </Link>
      </li>
    );
  };

  const onCreate = () => {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent("/")}`);
      return;
    }
    setComposeOpen(true);
  };

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-safe backdrop-blur lg:hidden"
        aria-label="Primary"
      >
        <ul className="flex items-center">
          {left.map(renderTab)}

          <li className="flex-1">
            <button
              type="button"
              onClick={onCreate}
              aria-label="Create post"
              className="flex min-h-[54px] w-full flex-col items-center justify-center gap-0.5 pb-1.5 pt-2 text-[10px] font-medium text-muted-foreground touch-action-manipulation"
            >
              <span className="flex h-8 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Plus className="h-5 w-5" strokeWidth={2.6} />
              </span>
              <span>Post</span>
            </button>
          </li>

          {right.map(renderTab)}
        </ul>
      </nav>

      {user && (
        <ComposeSheet
          open={composeOpen}
          onOpenChange={(v) => {
            setComposeOpen(v);
            if (!v) window.dispatchEvent(new Event("gbaug:feed-refresh"));
          }}
          canPostAnonymous={role === "paid_member" || role === "broker"}
        />
      )}
    </>
  );
}
