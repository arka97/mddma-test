import { Link, useLocation } from "react-router-dom";
import { Building2, FileText, Home, MessageSquareText, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useDealRoomsActivity } from "@/hooks/useDealRoomsActivity";
import { useScrollDirection } from "@/hooks/useScrollDirection";

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
  const { user } = useAuth();
  const { hasActivity } = useDealRoomsActivity();
  const hidden = useScrollDirection();

  const tabs: Tab[] = [
    { label: "Home", href: "/", icon: Home, match: (p) => p === "/" },
    {
      label: "Discover",
      href: "/discover",
      icon: Search,
      match: (p) => p.startsWith("/discover") || p.startsWith("/store") || p.startsWith("/products"),
    },
    { label: "RFQ", href: "/rfq", icon: FileText, match: (p) => p.startsWith("/rfq") },
    { label: "Firms", href: "/directory", icon: Building2, match: (p) => p.startsWith("/directory") },
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

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-safe backdrop-blur transition-transform duration-200 ease-out will-change-transform lg:hidden",
        hidden ? "translate-y-[130%]" : "translate-y-0",
      )}
      aria-label="Primary"
    >
      <ul className="flex items-center">{tabs.map(renderTab)}</ul>
    </nav>
  );
}
