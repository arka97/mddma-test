import { useEffect, useState } from "react";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { Link, useLocation } from "react-router-dom";
import { LogIn, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useScrolled } from "@/hooks/use-scrolled";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/brand/Logo";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import { AccountDrawer } from "@/components/layout/AccountDrawer";
import { NotificationsButton } from "@/components/layout/NotificationsButton";
import { AdSlot } from "@/components/home/today/AdSlot";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const desktopNav = [
  { name: "Home", href: "/" },
  { name: "Discover", href: "/discover" },
  { name: "Directory", href: "/directory" },
  { name: "Products", href: "/products" },
  { name: "RFQ", href: "/rfq" },
];

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const { user, profile } = useAuth();
  const scrolled = useScrolled(24);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((o) => !o);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);


  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);
  const initials = (profile?.full_name || user?.email || "U").slice(0, 1).toUpperCase();


  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card pt-safe">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <div
          className={cn(
            "grid grid-cols-[1fr_auto_1fr] items-center gap-2 overflow-hidden transition-all duration-200 ease-out",
            scrolled && !isHome
              ? "pointer-events-none h-0 opacity-0 lg:pointer-events-auto lg:h-12 lg:opacity-100"
              : "h-12 opacity-100",
          )}
        >
          <div className="flex min-w-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open account menu"
              className="rounded-full p-0.5 transition-colors hover:bg-muted"
            >
              {user ? (
                <Avatar className="h-9 w-9">
                  <AvatarImage src={profile?.avatar_url ?? undefined} />
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground">
                  <Menu className="h-[18px] w-[18px]" />
                </span>
              )}
            </button>

            <div className="hidden lg:flex lg:items-center lg:gap-0.5">
              {desktopNav.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/" className="flex justify-center" aria-label="G-BAU-G home">
            <Logo variant="mark" className="h-10 w-10 shrink-0 lg:h-12 lg:w-12" />
          </Link>

          <div className="flex items-center justify-end gap-1.5">
            <InstallAppButton iconOnly size="sm" className="hidden h-9 w-9 p-0 sm:inline-flex" />
            <NotificationsButton />
            {!user && (
              <Button size="sm" variant="default" className="h-9" asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        {!isHome && (
          <div className="relative pb-2.5 pt-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="group flex h-11 w-full items-center gap-2.5 rounded-full border border-transparent bg-muted px-4 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/70 focus-visible:border-primary focus-visible:bg-background focus-visible:outline-none"
              aria-label="Open global search"
            >
              <Search className="h-[18px] w-[18px]" aria-hidden />
              <span className="flex-1 truncate">Search businesses, products, RFQs…</span>
              <kbd className="hidden shrink-0 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground sm:inline-block">
                ⌘K
              </kbd>
            </button>
          </div>
        )}

        {!isHome && (
          <div className="pb-2.5">
            <AdSlot placement="search-below" />
          </div>
        )}
      </div>
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
      <AccountDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </header>
  );
}
