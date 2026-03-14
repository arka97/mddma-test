import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRole, roleLabels, type UserRole } from "@/contexts/RoleContext";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Directory", href: "/directory" },
  { name: "Products", href: "/products" },
  { name: "Broker", href: "/broker", feature: "broker_marketplace" },
  { name: "Market", href: "/market", feature: "market_intelligence" },
  { name: "Dashboard", href: "/dashboard", feature: "crm_dashboard" },
  { name: "Community", href: "/community" },
  { name: "Membership", href: "/membership" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { role, setRole } = useRole();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-primary font-bold text-sm">
              M
            </div>
            <div className="hidden sm:block">
              <div className="text-primary-foreground font-bold text-sm leading-tight">MDDMA</div>
              <div className="text-primary-foreground/60 text-[10px]">Digital Trade Hub</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex lg:items-center lg:gap-0.5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors",
                  isActive(item.href)
                    ? "bg-accent text-primary"
                    : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side: Role Simulator + Login */}
          <div className="hidden lg:flex lg:items-center lg:gap-2">
            {/* Role Simulator */}
            <div className="flex items-center gap-1.5 bg-primary-foreground/10 rounded-md px-2 py-1">
              <span className="text-[10px] text-primary-foreground/60 uppercase tracking-wider">Role:</span>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger className="h-6 w-28 text-xs border-0 bg-transparent text-primary-foreground p-0 pl-1 focus:ring-0 focus:ring-offset-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(roleLabels) as [UserRole, string][]).map(([key, label]) => (
                    <SelectItem key={key} value={key} className="text-xs">{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 h-8 text-xs" asChild>
              <Link to="/login"><LogIn className="mr-1 h-3.5 w-3.5" /> Login</Link>
            </Button>
            <Button size="sm" className="bg-accent text-primary hover:bg-accent/90 font-semibold h-8 text-xs" asChild>
              <Link to="/apply">Join MDDMA</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Role Selector */}
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger className="h-7 w-24 text-[10px] border-primary-foreground/30 bg-transparent text-primary-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(roleLabels) as [UserRole, string][]).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="text-xs">{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-primary-foreground p-2">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-primary-foreground/20 mt-2 pt-4">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href) ? "bg-accent text-primary" : "text-primary-foreground/80"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-primary-foreground/20">
                <Button variant="ghost" size="sm" className="justify-start text-primary-foreground/80" asChild>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}><LogIn className="mr-2 h-4 w-4" /> Login</Link>
                </Button>
                <Button size="sm" className="bg-accent text-primary hover:bg-accent/90 font-semibold" asChild>
                  <Link to="/apply" onClick={() => setMobileMenuOpen(false)}>Join MDDMA</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
