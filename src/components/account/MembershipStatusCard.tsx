import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { isFounderAdmin } from "@/lib/membership";

// Lightweight banner: shows founder bypass, paid status, or a CTA to apply.
// Membership state derives from auth roles only; the legacy memberships
// table + Razorpay payment-link queue was retired with the schema cleanup.
export function MembershipStatusCard() {
  const { user, roles, hasRole } = useAuth();

  if (!user) return null;

  if (isFounderAdmin(roles)) {
    return (
      <Card className="border-accent/30 bg-accent/10">
        <CardContent className="p-4 flex items-center gap-3">
          <Crown className="h-5 w-5 text-accent" />
          <div className="min-w-0">
            <div className="font-semibold flex items-center gap-2">
              Founder · Lifetime access
              <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">Admin</Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              All paid features unlocked. No fees required.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasRole("paid_member") || hasRole("broker")) {
    return (
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="p-4 flex items-center gap-3">
          <BadgeCheck className="h-5 w-5 text-accent" />
          <div className="min-w-0 flex-1">
            <div className="font-semibold flex items-center gap-2">
              Paid Membership
              <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">Active</Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Verified storefront, RFQ inbox, and priority placement unlocked.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Crown className="h-5 w-5 text-accent mt-0.5" />
          <div>
            <div className="font-semibold">Become a Paid Member</div>
            <div className="text-xs text-muted-foreground">
              ₹10,000/yr — verified storefront, RFQ inbox, priority placement.
            </div>
          </div>
        </div>
        <Button asChild size="sm" variant="accent">
          <Link to="/apply">Apply <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default MembershipStatusCard;
