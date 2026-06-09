import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { tierPriceInr } from "@/lib/membership";

export function MembershipCTA() {
  const { hasRole } = useAuth();
  if (hasRole("paid_member") || hasRole("admin")) return null;

  return (
    <article className="rounded-2xl border border-[hsl(var(--gold))]/40 bg-gradient-to-br from-[hsl(var(--gold))]/12 via-background to-background p-4 shadow-sm">
      <div className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--gold-dark))]">
        Paid membership
      </div>
      <h3 className="mt-1 text-base font-semibold leading-tight text-foreground">
        Become a Paid Member
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        ₹{tierPriceInr("paid").toLocaleString()}/yr — verified storefront and priority placement.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <Link
          to="/apply"
          className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90"
        >
          Apply <ArrowRight className="h-3 w-3" />
        </Link>
        <Link to="/membership" className="text-xs font-medium text-muted-foreground hover:text-foreground">
          See benefits
        </Link>
      </div>
    </article>
  );
}
