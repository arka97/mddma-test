import { Link } from "react-router-dom";
import { Building2, Check, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

/**
 * Right-rail widget: shows the current user's businesses and highlights
 * the active one. Doubles as a quick switcher — a natural spot for the
 * N:M identity model to live in view while browsing feeds.
 *
 * Hidden for signed-out users and for users with no memberships.
 */
export function MyBusinessesCard() {
  const { user, memberships, company: active, setActiveCompany } = useAuth();

  if (!user) return null;

  if (memberships.length === 0) {
    return (
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Building2 className="h-4 w-4 text-primary" /> Your businesses
        </div>
        <p className="text-xs text-muted-foreground">
          Register your company to post, quote and reveal contacts.
        </p>
        <Button asChild size="sm" className="mt-3 h-8 w-full rounded-full text-xs">
          <Link to="/apply">
            <Plus className="mr-1 h-3.5 w-3.5" /> Register business
          </Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Building2 className="h-4 w-4 text-primary" /> Your businesses
        </div>
        <Link
          to="/account/companies"
          className="text-[11px] font-medium text-primary hover:underline"
        >
          Manage
        </Link>
      </div>

      <ul className="space-y-1">
        {memberships.slice(0, 4).map(({ company: c, role }) => {
          const isActive = c.id === active?.id;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setActiveCompany(c.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-muted",
                  isActive && "bg-muted",
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={c.logo_url ?? undefined} />
                  <AvatarFallback className="text-[10px]">
                    {c.name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">{c.name}</div>
                  <div className="text-[11px] capitalize text-muted-foreground">{role}</div>
                </div>
                {isActive && <Check className="h-4 w-4 shrink-0 text-primary" />}
              </button>
            </li>
          );
        })}
      </ul>

      {memberships.length > 4 && (
        <Link
          to="/account/companies"
          className="mt-2 block text-center text-[11px] font-medium text-muted-foreground hover:text-foreground"
        >
          +{memberships.length - 4} more
        </Link>
      )}
    </section>
  );
}
