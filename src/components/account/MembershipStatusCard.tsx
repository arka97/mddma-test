import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck, Crown, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  STATUS_LABEL,
  TIER_LABEL,
  daysUntilExpiry,
  formatINR,
  getLatestMembershipForUser,
  isMembershipActive,
  type Membership,
} from "@/lib/membership";

const statusTone = (status: Membership["status"]) => {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "pending":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "expired":
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
  }
};

export function MembershipStatusCard() {
  const { user } = useAuth();
  const [m, setM] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const row = await getLatestMembershipForUser(user.id);
      if (!active) return;
      setM(row);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [user]);

  if (!user) return null;
  if (loading) {
    return (
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="p-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Checking membership status…
        </CardContent>
      </Card>
    );
  }

  // No application yet
  if (!m) {
    return (
      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Crown className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <div className="font-semibold">Become a Founding Member</div>
              <div className="text-xs text-muted-foreground">
                Lock 24-month founding pricing. Direct RFQ inbox · verified buyer pool · seller microsite.
              </div>
            </div>
          </div>
          <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-primary font-semibold">
            <Link to="/apply">Apply <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const active = isMembershipActive(m);
  const days = daysUntilExpiry(m.expires_at);
  const Icon = active ? BadgeCheck : m.status === "pending" ? ShieldCheck : ShieldAlert;

  return (
    <Card className="border-accent/20 bg-accent/5">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 text-accent mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{TIER_LABEL[m.tier]}</span>
              <Badge variant="outline" className={statusTone(m.status)}>{STATUS_LABEL[m.status]}</Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {m.status === "pending" && "Awaiting committee review · payment link will arrive on approval."}
              {m.status === "active" && days !== null && `Renews in ${days} day${days === 1 ? "" : "s"}.`}
              {m.status === "active" && days === null && "Active · founding-member rate locked."}
              {(m.status === "expired" || m.status === "cancelled") && "Renew to restore directory + RFQ access."}
              {m.price_paid_inr ? ` · ${formatINR(m.price_paid_inr)}/yr` : ""}
            </div>
          </div>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link to="/account/verify">{active ? "Manage" : "Continue"} <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default MembershipStatusCard;
