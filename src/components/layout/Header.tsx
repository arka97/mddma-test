import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Directory", href: "/directory" },
  { name: "Commodities", href: "/commodities" },
  { name: "Circulars", href: "/circulars" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary font-bold text-lg">
              M
            </div>
            <div className="hidden sm:block">
              <div className="text-primary-foreground font-bold text-lg leading-tight">
                MDDMA
              </div>
              <div className="text-primary-foreground/70 text-xs">
                Est. 1930 • Mumbai
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive(item.href)
                    ? "bg-accent text-primary"
                    : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/80"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side - Auth buttons */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/80"
              asChild
            >
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Member Login
              </Link>
            </Button>
            <Button
              size="sm"
              className="bg-accent text-primary hover:bg-accent/90 font-semibold"
              asChild
            >
              <Link to="/apply">Apply for Membership</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-primary-foreground p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-primary-foreground/20 mt-2 pt-4">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href)
                      ? "bg-accent text-primary"
                      : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/80"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-primary-foreground/20">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/80"
                  asChild
                >
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Member Login
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-accent text-primary hover:bg-accent/90 font-semibold"
                  asChild
                >
                  <Link to="/apply" onClick={() => setMobileMenuOpen(false)}>
                    Apply for Membership
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
