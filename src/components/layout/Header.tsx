import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, User, LogOut, Building2, Inbox, Package, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRole, roleLabels, type UserRole } from "@/contexts/RoleContext";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Directory", href: "/directory" },
  { name: "Products", href: "/products" },
  { name: "Broker", href: "/broker" },
  { name: "Market", href: "/market" },
  { name: "Community", href: "/community" },
  { name: "Membership", href: "/membership" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { role, setRole } = useRole();
  const { user, profile, company, hasRole, signOut } = useAuth();

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
        <DropdownMenuItem asChild><Link to="/account/products"><Package className="h-4 w-4 mr-2" /> My Products</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/account/rfqs"><Inbox className="h-4 w-4 mr-2" /> RFQ Center</Link></DropdownMenuItem>
        {hasRole("admin") && <DropdownMenuItem asChild><Link to="/account/moderation"><ShieldCheck className="h-4 w-4 mr-2" /> Moderation</Link></DropdownMenuItem>}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}><LogOut className="h-4 w-4 mr-2" /> Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="sticky top-0 z-40 bg-primary shadow-lg">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-primary font-bold text-sm">M</div>
            <div className="hidden sm:block">
              <div className="text-primary-foreground font-bold text-sm leading-tight">MDDMA</div>
              <div className="text-primary-foreground/60 text-[10px]">Digital Trade Hub</div>
            </div>
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-0.5">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className={cn(
                "px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors",
                isActive(item.href) ? "bg-accent text-primary" : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              )}>{item.name}</Link>
            ))}
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-2">
            {!user && (
              <div className="flex items-center gap-1.5 bg-primary-foreground/10 rounded-md px-2 py-1">
                <span className="text-[10px] text-primary-foreground/60 uppercase tracking-wider">Demo:</span>
                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger className="h-6 w-28 text-xs border-0 bg-transparent text-primary-foreground p-0 pl-1 focus:ring-0"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.entries(roleLabels) as [UserRole, string][]).map(([k, l]) => <SelectItem key={k} value={k} className="text-xs">{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {user ? <UserMenu /> : (
              <Button size="sm" className="bg-accent text-primary hover:bg-accent/90 font-semibold h-8 text-xs" asChild>
                <Link to="/login"><LogIn className="mr-1 h-3.5 w-3.5" /> Login</Link>
              </Button>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-2">
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
