import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, User, LogOut, Building2, Inbox, Package, ShieldCheck, Store, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/brand/Logo";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Directory", href: "/directory" },
  { name: "Products", href: "/products" },
  { name: "Market", href: "/market" },
  { name: "Community", href: "/community" },
  { name: "Membership", href: "/membership" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const lastY = useRef(0);
  const ticking = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, company, hasRole, signOut } = useAuth();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (mobileMenuOpen || y < 80) {
          setHidden(false);
        } else if (y > lastY.current) {
          setHidden(true);
        } else if (y < lastY.current) {
          setHidden(false);
        }
        // Show inline search once scrolled past hero area, or always on non-home routes
        setShowSearch(!isHome || y > 200);
        lastY.current = y;
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileMenuOpen, isHome]);

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const sp = new URLSearchParams();
    if (searchQ.trim()) sp.set("q", searchQ.trim());
    sp.set("view", "marketplace");
    navigate(`/products?${sp.toString()}`);
  };

  const isActive = (href: string) => href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);
  const initials = (profile?.full_name || user?.email || "U").slice(0, 1).toUpperCase();

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full hover:bg-primary-foreground/10 p-1">
          <Avatar className="h-7 w-7"><AvatarImage src={profile?.avatar_url ?? undefined} /><AvatarFallback className="text-xs">{initials}</AvatarFallback></Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="text-sm">{profile?.full_name || "Member"}</div>
          <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to="/account/profile"><User className="h-4 w-4 mr-2" /> My Profile</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/account/company"><Building2 className="h-4 w-4 mr-2" /> {company ? "My Company" : "Create Company"}</Link></DropdownMenuItem>
        {company && <DropdownMenuItem asChild><Link to={`/store/${company.slug}`}><Store className="h-4 w-4 mr-2" /> View My Storefront</Link></DropdownMenuItem>}
        <DropdownMenuItem asChild><Link to="/account/products"><Package className="h-4 w-4 mr-2" /> My Products</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/account/rfqs"><Inbox className="h-4 w-4 mr-2" /> RFQ Center</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/account/verify"><ShieldCheck className="h-4 w-4 mr-2" /> Verification</Link></DropdownMenuItem>
        {hasRole("admin") && <DropdownMenuItem asChild><Link to="/account/moderation"><ShieldCheck className="h-4 w-4 mr-2" /> Moderation</Link></DropdownMenuItem>}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}><LogOut className="h-4 w-4 mr-2" /> Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className={cn("bg-primary shadow-lg transition-transform duration-300", hidden && "-translate-y-full")}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label="MDDMA — Home">
            <div className="rounded-md bg-primary-foreground/95 p-1">
              <Logo variant="mark" className="h-8 w-8" />
            </div>
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-0.5">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className={cn(
                "px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors",
                isActive(item.href) ? "bg-accent text-primary burgundy-underline" : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              )}>{item.name}</Link>
            ))}
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-2">
            {showSearch && (
              <form onSubmit={submitSearch} className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Find Sellers…"
                  aria-label="Find sellers"
                  className="h-8 w-40 pl-8 py-0 text-xs bg-background"
                />
              </form>
            )}
            <InstallAppButton iconOnly size="sm" className="h-8 w-8 p-0" />
            {user ? <UserMenu /> : (
              <Button size="sm" className="bg-accent text-primary hover:bg-accent/90 font-semibold h-8 text-xs" asChild>
                <Link to="/login"><LogIn className="mr-1 h-3.5 w-3.5" /> Login</Link>
              </Button>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <InstallAppButton iconOnly size="sm" className="h-8 w-8 p-0" />
            {user ? <UserMenu /> : (
              <Button size="sm" className="bg-accent text-primary hover:bg-accent/90 font-semibold h-8 text-xs" asChild>
                <Link to="/login"><LogIn className="mr-1 h-3.5 w-3.5" /> Login</Link>
              </Button>
            )}
            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-primary-foreground p-2">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-primary-foreground/20 mt-2 pt-4">
            <form onSubmit={(e) => { submitSearch(e); setMobileMenuOpen(false); }} className="relative mb-3">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Find Sellers…"
                aria-label="Find sellers"
                className="h-9 w-full pl-8 text-sm bg-background"
              />
            </form>
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href} onClick={() => setMobileMenuOpen(false)} className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive(item.href) ? "bg-accent text-primary" : "text-primary-foreground/80"
                )}>{item.name}</Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
