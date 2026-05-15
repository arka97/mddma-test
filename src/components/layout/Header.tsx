import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogIn, User, LogOut, Building2, Inbox, Package, ShieldCheck, Store, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
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
  { name: "Brands", href: "/brands" },
  { name: "Market", href: "/market" },
  { name: "Community", href: "/community" },
  { name: "Membership", href: "/membership" },
];

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const lastY = useRef(0);
  const ticking = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, company, hasRole, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (drawerOpen || y < 80) {
          setHidden(false);
        } else if (y > lastY.current) {
          setHidden(true);
        } else if (y < lastY.current) {
          setHidden(false);
        }
        lastY.current = y;
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [drawerOpen]);

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const sp = new URLSearchParams();
    if (searchQ.trim()) sp.set("q", searchQ.trim());
    sp.set("view", "marketplace");
    navigate(`/products?${sp.toString()}`);
    setDrawerOpen(false);
  };

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);
  const initials = (profile?.full_name || user?.email || "U").slice(0, 1).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full p-1 hover:bg-muted" aria-label="Account menu">
          <Avatar className="h-7 w-7">
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
        <DropdownMenuItem asChild><Link to="/account/profile"><User className="mr-2 h-4 w-4" /> My Profile</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/account/company"><Building2 className="mr-2 h-4 w-4" /> {company ? "My Company" : "Create Company"}</Link></DropdownMenuItem>
        {company && <DropdownMenuItem asChild><Link to={`/store/${company.slug}`}><Store className="mr-2 h-4 w-4" /> View My Storefront</Link></DropdownMenuItem>}
        <DropdownMenuItem asChild><Link to="/account/products"><Package className="mr-2 h-4 w-4" /> My Products</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/account/brands"><Sparkles className="mr-2 h-4 w-4" /> My Brands</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/account/rfqs"><Inbox className="mr-2 h-4 w-4" /> RFQ Center</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/account/verify"><ShieldCheck className="mr-2 h-4 w-4" /> Verification</Link></DropdownMenuItem>
        {hasRole("admin") && <DropdownMenuItem asChild><Link to="/account/moderation"><ShieldCheck className="mr-2 h-4 w-4" /> Moderation</Link></DropdownMenuItem>}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" /> Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70 transition-transform duration-300 pt-safe",
        hidden && "-translate-y-full",
      )}
    >
      <nav className="container mx-auto px-4 pl-safe pr-safe sm:px-6 lg:px-8">
        <div className="flex h-[52px] items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2" aria-label="MDDMA — Home">
            <Logo variant="mark" className="h-9 w-9 rounded-md ring-1 ring-border" />
            <span className="text-sm font-semibold tracking-tight text-foreground">MDDMA</span>
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-0.5">
            {navigation.map((item) => (
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

          <div className="flex items-center gap-2">
            <form onSubmit={submitSearch} className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Find sellers…"
                aria-label="Find sellers"
                className="h-8 w-44 pl-8 text-sm"
              />
            </form>
            <InstallAppButton iconOnly size="sm" className="h-10 w-10 p-0 sm:h-8 sm:w-8" />
            {user ? (
              <UserMenu />
            ) : (
              <Button size="sm" variant="default" className="h-10 min-w-10 sm:h-8" asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4 sm:mr-1 sm:h-3.5 sm:w-3.5" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </Button>
            )}

            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-muted lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 p-0"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <SheetHeader className="border-b border-border px-5 py-4">
                  <SheetTitle className="flex items-center gap-2 text-base">
                    <Logo variant="mark" className="h-6 w-6" />
                    MDDMA
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 p-5">
                  <nav className="flex flex-col gap-1">
                    {navigation.map((item) => (
                      <SheetClose asChild key={item.name}>
                        <Link
                          to={item.href}
                          className={cn(
                            "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive(item.href)
                              ? "bg-secondary text-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          {item.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <form onSubmit={submitSearch} className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={searchQ}
                      onChange={(e) => setSearchQ(e.target.value)}
                      placeholder="Find sellers…"
                      aria-label="Find sellers"
                      className="h-10 w-full pl-9"
                    />
                  </form>
                  {!user && (
                    <SheetClose asChild>
                      <Button asChild className="w-full">
                        <Link to="/login">
                          <LogIn className="mr-2 h-4 w-4" /> Login
                        </Link>
                      </Button>
                    </SheetClose>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
