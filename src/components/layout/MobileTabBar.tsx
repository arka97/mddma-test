import { Link, useLocation } from "react-router-dom";
import { Home, Users, Inbox, FileText, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

type Tab = {
  label: string;
  icon: typeof Home;
  to: string;
  match: (path: string) => boolean;
  badge?: number;
};

export function MobileTabBar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { count } = useCart();

  const rfqHref = user ? "/account/rfqs" : "/login?next=/account/rfqs";
  const accountHref = user ? "/account/profile" : "/login";

  const tabs: Tab[] = [
    { label: "Today", icon: Home, to: "/", match: (p) => p === "/" },
    { label: "Members", icon: Users, to: "/directory", match: (p) => p.startsWith("/directory") },
    { label: "RFQs", icon: Inbox, to: rfqHref, match: (p) => p.startsWith("/account/rfqs"), badge: count || undefined },
    { label: "Circulars", icon: FileText, to: "/circulars", match: (p) => p.startsWith("/circulars") },
    { label: "Account", icon: UserIcon, to: accountHref, match: (p) => p.startsWith("/account") && !p.startsWith("/account/rfqs") },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <ul className="grid grid-cols-5">
        {tabs.map((t) => {
          const active = t.match(pathname);
          const Icon = t.icon;
          return (
            <li key={t.label}>
              <Link
                to={t.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium",
                  active ? "text-accent" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "relative flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                    active && "bg-accent/10",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {t.badge ? (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-danger-foreground">
                      {t.badge}
                    </span>
                  ) : null}
                </span>
                <span>{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
