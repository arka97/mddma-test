import { Link, useLocation } from "react-router-dom";
import { Building2, FileText, Home, Newspaper, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Tab {
  label: string;
  href: string;
  icon: typeof Home;
  match: (path: string) => boolean;
  requireAuth?: boolean;
}

const baseTabs: Tab[] = [
  { label: "Home", href: "/", icon: Home, match: (path) => path === "/" },
  { label: "Market", href: "/market", icon: Newspaper, match: (path) => path.startsWith("/market") },
  { label: "RFQ", href: "/rfq", icon: FileText, match: (path) => path.startsWith("/rfq") },
  {
    label: "Firms",
    href: "/directory",
    icon: Building2,
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

export function MobileBottomTabBar() {
  const location = useLocation();
  const { user, profile } = useAuth();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-safe backdrop-blur lg:hidden"
      aria-label="Primary"
    >
      <ul className="flex">
        {baseTabs.map((tab) => {
          const active = tab.match(location.pathname);
          const Icon = tab.icon;
          const target = tab.requireAuth && !user ? `/login?next=${encodeURIComponent(tab.href)}` : tab.href;
          const isAccount = tab.label === "Account";

          return (
            <li key={tab.label} className="flex-1">
              <Link
                to={target}
                aria-current={active ? "page" : undefined}
                aria-label={tab.label}
                className={cn(
                  "group flex min-h-[54px] flex-col items-center justify-center gap-0.5 px-1 pb-1.5 pt-2 text-[10px] font-medium transition-colors touch-action-manipulation",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {isAccount && user ? (
                  <Avatar className={cn("h-6 w-6 transition-all", active && "ring-2 ring-foreground ring-offset-2 ring-offset-background")}>
                    <AvatarImage src={profile?.avatar_url ?? undefined} />
                    <AvatarFallback className="text-[10px]">
                      {(profile?.full_name || user.email || "U").slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.6 : 2} />
                )}
                <span className={cn(active && "font-semibold")}>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
