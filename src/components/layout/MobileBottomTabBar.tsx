import { Link, useLocation } from "react-router-dom";
import { Feather, Home, MessageSquare, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface Tab {
  label: string;
  href?: string;
  icon: typeof Home;
  match?: (path: string) => boolean;
  requireAuth?: boolean;
  action?: "post";
}

const tabs: Tab[] = [
  { label: "Home", href: "/", icon: Home, match: (path) => path === "/" },
  { label: "Market", href: "/market", icon: MessageSquare, match: (path) => path.startsWith("/market") },
  { label: "Post", icon: Feather, action: "post" },
  {
    label: "Members",
    href: "/directory",
    icon: Users,
    match: (path) => path.startsWith("/directory") || path.startsWith("/store"),
  },
  {
    label: "Account",
    href: "/dashboard",
    icon: User,
    match: (path) =>
      path.startsWith("/account") ||
      path.startsWith("/dashboard") ||
      path.startsWith("/messages") ||
      path.startsWith("/quotes"),
    requireAuth: true,
  },
];

export function MobileBottomTabBar({ onPost }: { onPost?: () => void }) {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-safe backdrop-blur lg:hidden"
      aria-label="Primary"
    >
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => {
          const active = tab.match ? tab.match(location.pathname) : false;
          const Icon = tab.icon;
          const isPost = tab.action === "post";

          if (isPost) {
            return (
              <li key={tab.label} className="relative flex items-center justify-center">
                <button
                  onClick={onPost}
                  className="my-1 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                  aria-label="Post"
                >
                  <Icon className="h-5 w-5" strokeWidth={2.5} />
                </button>
              </li>
            );
          }

          const target = tab.requireAuth && !user ? `/login?next=${encodeURIComponent(tab.href!)}` : tab.href!;
          return (
            <li key={tab.label}>
              <Link
                to={target}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[52px] flex-col items-center justify-center gap-0.5 px-1 pb-2 pt-2 text-[11px] font-semibold transition-colors",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
