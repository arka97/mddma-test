import { NavLink, Link } from "react-router-dom";
import {
  Home, Search, Bell, Mail, Users, FileText, Store, BookOpen, MoreHorizontal,
  Feather, MessageSquare, LayoutDashboard, ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";

interface Item { to: string; icon: typeof Home; label: string; end?: boolean; }

const items: Item[] = [
  { to: "/", icon: Home, label: "Home", end: true },
  { to: "/directory", icon: Users, label: "Members" },
  { to: "/products", icon: Store, label: "Products" },
  { to: "/market", icon: MessageSquare, label: "Market" },
  { to: "/rfq", icon: FileText, label: "RFQ" },
  { to: "/messages", icon: Mail, label: "Deal Messages" },
  { to: "/brands", icon: BookOpen, label: "Brands" },
  { to: "/circulars", icon: Bell, label: "Bulletin" },
  { to: "/knowledge", icon: BookOpen, label: "Knowledge" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Account" },
];

export function LeftRail({ onPost }: { onPost: () => void }) {
  const { user, signOut } = useAuth();
  const { role } = useRole();
  const isAdmin = role === "admin";

  return (
    <aside className="sticky top-0 hidden h-screen w-[88px] shrink-0 flex-col justify-between border-r border-border px-2 py-3 xl:w-[275px] xl:px-3 lg:flex">
      <div className="flex flex-col gap-1">
        <Link to="/" className="mb-1 inline-flex h-12 items-center gap-2 rounded-full px-2 hover:bg-muted/40">
          <Logo variant="mark" className="h-9 w-9" />
          <span className="hidden text-lg font-bold tracking-tight xl:inline">G-BAU-G</span>
        </Link>

        <nav className="flex flex-col gap-0.5">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                cn(
                  "group inline-flex items-center gap-4 rounded-full px-3 py-2.5 text-lg font-medium transition-colors hover:bg-muted",
                  isActive ? "font-bold" : "text-foreground",
                )
              }
            >
              <it.icon className="h-6 w-6 shrink-0" />
              <span className="hidden xl:inline">{it.label}</span>
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/account/moderation"
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center gap-4 rounded-full px-3 py-2.5 text-lg font-medium transition-colors hover:bg-muted",
                  isActive ? "font-bold" : "text-foreground",
                )
              }
            >
              <ShieldCheck className="h-6 w-6 shrink-0" />
              <span className="hidden xl:inline">Admin</span>
            </NavLink>
          )}
          <NavLink
            to="/about"
            className="inline-flex items-center gap-4 rounded-full px-3 py-2.5 text-lg font-medium text-foreground transition-colors hover:bg-muted"
          >
            <MoreHorizontal className="h-6 w-6 shrink-0" />
            <span className="hidden xl:inline">More</span>
          </NavLink>
        </nav>

        <Button
          onClick={onPost}
          className="mt-3 h-12 w-12 rounded-full bg-primary p-0 text-primary-foreground shadow-sm hover:bg-primary/90 xl:h-13 xl:w-full xl:rounded-full xl:text-base xl:font-bold"
          size="lg"
          aria-label="Post"
        >
          <Feather className="h-5 w-5 xl:hidden" />
          <span className="hidden xl:inline">Post</span>
        </Button>
      </div>

      <div className="mt-2 flex items-center gap-2 rounded-full p-2 hover:bg-muted/60">
        {user ? (
          <>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold uppercase text-foreground">
              {(user.email ?? "?").slice(0, 1)}
            </div>
            <div className="hidden min-w-0 flex-1 xl:block">
              <div className="truncate text-sm font-semibold">{user.email}</div>
              <div className="truncate text-xs text-muted-foreground">{role}</div>
            </div>
            <button
              onClick={() => signOut()}
              className="hidden text-xs font-medium text-muted-foreground hover:text-foreground xl:inline"
            >
              Log out
            </button>
          </>
        ) : (
          <Link to="/login" className="w-full text-center text-sm font-semibold">Sign in</Link>
        )}
      </div>
    </aside>
  );
}
