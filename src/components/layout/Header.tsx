import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, User, LogOut, Building2, Package, ShieldCheck, Store, Search, Sparkles, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useScrolled } from "@/hooks/use-scrolled";

import { useAuth } from "@/contexts/AuthContext";

import { Logo } from "@/components/brand/Logo";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Desktop-only nav. On mobile, the bottom tab bar carries primary navigation.
const desktopNav = [
  { name: "Directory", href: "/directory" },
  { name: "Products", href: "/products" },
  { name: "Brands", href: "/brands" },
  { name: "Market", href: "/market" },
  { name: "Community", href: "/community" },
  { name: "Membership", href: "/membership" },
];

export function Header() {
  const [searchQ, setSearchQ] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, company, hasRole, signOut } = useAuth();
  const scrolled = useScrolled(24);


  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const sp = new URLSearchParams();
    if (searchQ.trim()) sp.set("q", searchQ.trim());
    sp.set("view", "marketplace");
    navigate(`/products?${sp.toString()}`);
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
          <div className="text-sm">{profile?.full_name || "Member"}</div>
          <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/account/profile"><User className="mr-2 h-4 w-4" /> My Profile</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/account/company"><Building2 className="mr-2 h-4 w-4" /> {company ? "My Company" : "Create Company"}</Link></DropdownMenuItem>
        {company && <DropdownMenuItem asChild><Link to={`/store/${company.slug}`}><Store className="mr-2 h-4 w-4" /> My Storefront</Link></DropdownMenuItem>}
        <DropdownMenuItem asChild><Link to="/account/products"><Package className="mr-2 h-4 w-4" /> My Products</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/account/brands"><Sparkles className="mr-2 h-4 w-4" /> My Brands</Link></DropdownMenuItem>
        
        {hasRole("admin") && <DropdownMenuItem asChild><Link to="/account/moderation"><ShieldCheck className="mr-2 h-4 w-4" /> Moderation</Link></DropdownMenuItem>}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" /> Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card pt-safe">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        {/* Row 1: collapses on scroll on mobile/tablet, always visible on desktop */}
        <div
          className={cn(
            "flex items-center justify-between gap-2 overflow-hidden transition-all duration-200 ease-out",
            scrolled
              ? "h-0 opacity-0 pointer-events-none lg:h-12 lg:opacity-100 lg:pointer-events-auto"
              : "h-12 opacity-100",
          )}
          aria-hidden={scrolled ? "true" : "false"}
        >

          <div className="flex min-w-0 items-center gap-2">
            <Link to="/" className="flex min-w-0 items-center gap-2 lg:py-1" aria-label="G.BAU.G — by MDDMA">
              <Logo variant="mark" className="h-8 w-8 shrink-0 lg:h-9 lg:w-9" />
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="text-sm font-bold tracking-tight text-foreground lg:text-base">G.BAU.G</span>
                <span className="whitespace-pre-line text-[10px] font-medium text-muted-foreground lg:text-xs">
                  {`by Mumbai Dryfruits &\nDates Merchants Association\u00a0`}
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
          </div>

          <div className="flex items-center gap-1.5">
            <InstallAppButton iconOnly size="sm" className="h-9 w-9 p-0" />
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

        {/* Row 2: search — always visible (the wireframe's primary affordance) */}
        <form onSubmit={submitSearch} className="relative pb-2.5 pt-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Search Mamra, Medjool, traders…"
            aria-label="Search products and traders"
            className="h-10 w-full rounded-full border-border/80 bg-muted/60 pl-9 text-sm shadow-none focus-visible:bg-background"
          />
        </form>
      </div>
    </header>
  );
}
