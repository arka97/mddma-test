import { Link, useLocation } from "react-router-dom";
import { Home, Users, Sparkles, Megaphone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface Tab {
  label: string;
  href: string;
  icon: typeof Home;
  match: (path: string) => boolean;
  requireAuth?: boolean;
}

const baseTabs: Tab[] = [
  { label: "Today", href: "/", icon: Home, match: (p) => p === "/" },
  { label: "Members", href: "/directory", icon: Users, match: (p) => p.startsWith("/directory") || p.startsWith("/store") },
  { label: "Brands", href: "/brands", icon: Sparkles, match: (p) => p.startsWith("/brands") },
  { label: "Circulars", href: "/circulars", icon: Megaphone, match: (p) => p.startsWith("/circulars") },
  { label: "Account", href: "/account/profile", icon: User, match: (p) => p.startsWith("/account"), requireAuth: true },
];

export function MobileBottomTabBar() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden pb-safe"
      aria-label="Primary"
    >
      <ul className="grid grid-cols-5">
        {baseTabs.map((tab) => {
          const active = tab.match(location.pathname);
          const Icon = tab.icon;
          const target = tab.requireAuth && !user
            ? `/login?next=${encodeURIComponent(tab.href)}`
            : tab.href;
          return (
            <li key={tab.label}>
              <Link
                to={target}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "text-primary")} strokeWidth={active ? 2.5 : 2} />
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
