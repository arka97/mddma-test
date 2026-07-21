import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  ChevronDown,
  FileCheck2,
  LayoutDashboard,
  LogIn,
  LogOut,
  MessageSquareText,
  Package,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useScrolled } from "@/hooks/use-scrolled";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/brand/Logo";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import { CompanySwitcher } from "@/components/layout/CompanySwitcher";
import { useDealRoomsActivity } from "@/hooks/useDealRoomsActivity";
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
  const [searchQ, setSearchQ] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, company, hasRole, signOut } = useAuth();
  const scrolled = useScrolled(24);
  const { hasActivity: hasDealActivity } = useDealRoomsActivity();

  const submitSearch = (event?: React.FormEvent) => {
    event?.preventDefault();
    const searchParams = new URLSearchParams();
    if (searchQ.trim()) searchParams.set("q", searchQ.trim());
    searchParams.set("view", "marketplace");
    navigate(`/products?${searchParams.toString()}`);
  };

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
            "flex items-center justify-between gap-2 overflow-hidden transition-all duration-200 ease-out",
            scrolled
              ? "pointer-events-none h-0 opacity-0 lg:pointer-events-auto lg:h-12 lg:opacity-100"
              : "h-12 opacity-100",
          )}
          aria-hidden={scrolled ? "true" : "false"}
        >
          <div className="flex min-w-0 items-center gap-2">
            <Link to="/" className="flex min-w-0 items-center gap-2 lg:py-1" aria-label="G-BAU-G — by MDDMA">
              <Logo variant="mark" className="h-8 w-8 shrink-0 lg:h-9 lg:w-9" />
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="text-sm font-bold tracking-tight text-foreground lg:text-base">G-BAU-G</span>
                <span className="whitespace-pre-line text-[10px] font-medium text-muted-foreground lg:text-xs">
                  {`by Mumbai Dry Fruits &\nDates Merchants Association`}
                </span>
              </span>
            </Link>
          </div>

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

          <div className="flex items-center gap-1.5">
            <InstallAppButton iconOnly size="sm" className="h-9 w-9 p-0" />
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

        <form onSubmit={submitSearch} className="relative pb-2.5 pt-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQ}
            onChange={(event) => setSearchQ(event.target.value)}
            placeholder="Search products, brands and businesses…"
            aria-label="Search the G-BAU-G network"
            className="h-11 w-full rounded-full border-transparent bg-muted pl-10 text-sm shadow-none focus-visible:border-primary focus-visible:bg-background focus-visible:ring-0"
          />
        </form>
      </div>
    </header>
  );
}