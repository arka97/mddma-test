import { useEffect, useState } from "react";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  ChevronDown,
  FileCheck2,
  LayoutDashboard,
  LogIn,
  LogOut,
  Bookmark,
  MessageSquareText,
  Package,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useScrolled } from "@/hooks/use-scrolled";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/brand/Logo";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import { CompanySwitcher } from "@/components/layout/CompanySwitcher";
import { useDealRoomsActivity } from "@/hooks/useDealRoomsActivity";
import { AdSlot } from "@/components/home/today/AdSlot";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const desktopNav = [
  { name: "Directory", href: "/directory" },
  { name: "Products", href: "/products" },
  { name: "Market", href: "/market" },
  { name: "RFQ", href: "/rfq" },
  { name: "Join", href: "/membership" },
];

const moreNav = [
  { name: "Brands", href: "/brands" },
  { name: "Bulletin", href: "/circulars" },
  { name: "Knowledge", href: "/knowledge" },
  { name: "FAQ", href: "/faq" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, company, hasRole, signOut } = useAuth();
  const scrolled = useScrolled(24);
  const { hasActivity: hasDealActivity } = useDealRoomsActivity();

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


  const isActive = (href: string) => location.pathname.startsWith(href);
  const initials = (profile?.full_name || user?.email || "U").slice(0, 1).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full p-0.5 hover:bg-muted" aria-label="Account menu">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url ?? undefined} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="text-sm">{profile?.full_name || "User"}</div>
          <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/messages">
            <MessageSquareText className="mr-2 h-4 w-4" /> Deal rooms
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/quotes">
            <FileCheck2 className="mr-2 h-4 w-4" /> My quotations
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/account/bookmarks">
            <Bookmark className="mr-2 h-4 w-4" /> Bookmarks
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/account/profile">
            <User className="mr-2 h-4 w-4" /> My profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/account/company">
            <Building2 className="mr-2 h-4 w-4" /> {company ? "My business" : "Register business"}
          </Link>
        </DropdownMenuItem>
        {company && (
          <DropdownMenuItem asChild>
            <Link to={`/store/${company.slug}`}>
              <Store className="mr-2 h-4 w-4" /> My storefront
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/account/products">
            <Package className="mr-2 h-4 w-4" /> My products
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/account/brands">
            <Sparkles className="mr-2 h-4 w-4" /> My brands
          </Link>
        </DropdownMenuItem>

        {hasRole("admin") && (
          <DropdownMenuItem asChild>
            <Link to="/account/moderation">
              <ShieldCheck className="mr-2 h-4 w-4" /> Moderation
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card pt-safe">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <div
          className={cn(
            "grid grid-cols-[1fr_auto_1fr] items-center gap-2 overflow-hidden transition-all duration-200 ease-out",
            scrolled
              ? "pointer-events-none h-0 opacity-0 lg:pointer-events-auto lg:h-12 lg:opacity-100"
              : "h-12 opacity-100",
          )}
          aria-hidden={scrolled ? "true" : "false"}
        >
          <Link to="/" className="flex min-w-0 items-center" aria-label="G-BAU-G">
            <span className="text-base font-bold tracking-tight text-foreground lg:text-lg">G-BAU-G</span>
          </Link>

          <Link to="/" className="flex justify-center" aria-label="G-BAU-G home">
            <Logo variant="mark" className="h-10 w-10 shrink-0 lg:h-12 lg:w-12" />
          </Link>

          <div className="flex items-center justify-end gap-1.5">
            <div className="hidden lg:flex lg:items-center lg:gap-0.5">
              {desktopNav.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-0.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    More <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {moreNav.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link to={item.href}>{item.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <InstallAppButton iconOnly size="sm" className="h-9 w-9 p-0" />
            {user && (
              <Link
                to="/messages"
                aria-label="Deal rooms"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <MessageSquareText className="h-[18px] w-[18px]" />
                {hasDealActivity && (
                  <span
                    aria-hidden
                    className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card"
                  />
                )}
              </Link>
            )}
            {user && <CompanySwitcher />}
            {user ? (
              <UserMenu />
            ) : (
              <Button size="sm" variant="default" className="h-9" asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

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

        <div className="pb-2.5">
          <AdSlot placement="search-below" />
        </div>
      </div>
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
