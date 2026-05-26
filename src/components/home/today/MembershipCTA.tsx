import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { tierPriceInr } from "@/lib/membership";

export function MembershipCTA() {
  const { hasRole } = useAuth();
  if (hasRole("paid_member") || hasRole("admin")) return null;

  return (
    <Link
      to="/apply"
      className="group block overflow-hidden rounded-2xl border border-[hsl(var(--gold))]/40 bg-gradient-to-br from-[hsl(var(--gold))]/10 via-background to-background p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--gold))]/20 text-[hsl(var(--gold-dark))]">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground">Become a Paid Member</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            ₹{tierPriceInr("paid").toLocaleString()}/yr — verified storefront, RFQ inbox, priority placement.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 self-center rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background transition-transform group-hover:translate-x-0.5">
          Apply <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
