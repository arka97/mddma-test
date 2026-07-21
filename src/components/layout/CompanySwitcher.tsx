import { Building2, Check, ChevronDown, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface CompanySwitcherProps {
  /** Compact icon-only trigger (used in dense header). */
  compact?: boolean;
  className?: string;
}

/**
 * Lets a signed-in user pick which company they are acting as
 * when they belong to more than one business (N:M identity).
 * Silently renders nothing when the user has 0 or 1 membership.
 */
export function CompanySwitcher({ compact = false, className }: CompanySwitcherProps) {
  const { memberships, company, activeMembershipRole, setActiveCompany } = useAuth();

  if (memberships.length < 2) return null;

  const initials = (company?.name || "?").slice(0, 1).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted",
            compact && "px-1.5",
            className,
          )}
          aria-label="Switch active business"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={company?.logo_url ?? undefined} />
            <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
          </Avatar>
          {!compact && (
            <span className="max-w-[10ch] truncate text-xs sm:max-w-[16ch]">
              {company?.name ?? "Choose business"}
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
          Acting as
        </DropdownMenuLabel>
        {memberships.map(({ company: c, role }) => {
          const isActive = c.id === company?.id;
          return (
            <DropdownMenuItem
              key={c.id}
              onClick={() => setActiveCompany(c.id)}
              className="flex items-center gap-2"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={c.logo_url ?? undefined} />
                <AvatarFallback className="text-[10px]">
                  {c.name.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{c.name}</div>
                <div className="text-[11px] capitalize text-muted-foreground">
                  {role}
                  {isActive && activeMembershipRole ? " • current" : ""}
                </div>
              </div>
              {isActive && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/account/companies" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" /> All my businesses
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/account/team" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Team & roles
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
