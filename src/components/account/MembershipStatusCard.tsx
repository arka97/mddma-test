import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Building2, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { isFounderAdmin } from "@/lib/membership";

// Compatibility name retained while the access model is migrated away from paid-first language.
export function MembershipStatusCard() {
  const { user, company, roles, hasRole } = useAuth();

  if (!user) return null;

  if (isFounderAdmin(roles)) {
    return (
      <Card className="border-accent/30 bg-accent/10">
        <CardContent className="flex items-center gap-3 p-4">
          <ShieldCheck className="h-5 w-5 text-accent" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 font-semibold">
              Platform operator access
              <Badge variant="success">Admin</Badge>
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              Moderation, verification and operational tools are available.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasRole("paid_member") || hasRole("broker")) {
    return (
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="flex items-center gap-3 p-4">
          <BadgeCheck className="h-5 w-5 text-accent" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 font-semibold">
              Business network access
              <Badge variant="success">Active</Badge>
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              Commercial tools are enabled under the current access policy. This status is separate from verification.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (company) {
    return (
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <Building2 className="mt-0.5 h-5 w-5 text-warning-foreground" />
            <div>
              <div className="font-semibold">Business profile submitted</div>
              <div className="text-xs text-muted-foreground">
                Complete the profile and follow its review status from your business workspace.
              </div>
            </div>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link to="/account/company">
              Open profile <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <Building2 className="mt-0.5 h-5 w-5 text-accent" />
          <div>
            <div className="font-semibold">Register an existing business</div>
            <div className="text-xs text-muted-foreground">
              Commercial participation requires a reviewed business identity.
            </div>
          </div>
        </div>
        <Button asChild size="sm" variant="accent">
          <Link to="/apply">
            Start <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default MembershipStatusCard;
