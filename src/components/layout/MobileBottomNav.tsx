import { NavLink, useLocation } from "react-router-dom";
import { Home, Search, ShoppingBag, HelpCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

/**
 * Mobile-only bottom tab bar. Hidden ≥ md.
 * Four tabs only — Home, Find (search), Cart, Help — chosen for
 * non-tech users who shouldn't have to hunt for primary actions.
 */
export function MobileBottomNav() {
  const { count, setOpen } = useCart();
  const location = useLocation();

  const tabs = [
    { to: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
    { to: "/products", label: "Find", icon: Search, match: (p: string) => p.startsWith("/products") || p.startsWith("/directory") || p.startsWith("/brands") },
    { to: "#cart", label: "Cart", icon: ShoppingBag, isCart: true },
    { to: "/help", label: "Help", icon: HelpCircle, match: (p: string) => p.startsWith("/help") },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur pb-safe md:hidden"
      aria-label="Primary"
    >
      <ul className="grid grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.match ? tab.match(location.pathname) : false;
          if (tab.isCart) {
            return (
              <li key={tab.label}>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="relative flex h-16 w-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                  aria-label={`Cart, ${count} items`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                  {count > 0 && (
                    <span className="absolute right-4 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-danger-foreground">
                      {count}
                    </span>
                  )}
                </button>
              </li>
            );
          }
          return (
            <li key={tab.label}>
              <NavLink
                to={tab.to}
                className={cn(
                  "flex h-16 w-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                  active ? "text-accent" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
