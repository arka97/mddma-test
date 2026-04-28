import { BadgeCheck, ShieldCheck, Users } from "lucide-react";
import { associationStats } from "@/data/sampleData";

// Slim persistent strip under the header. Surfaces credibility on every
// page in <40px without competing with the navy hero on landing.
export function TrustStrip() {
  return (
    <div className="hidden sm:block border-b border-border bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-1.5 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              Est. 1930s · {associationStats.yearsOfService} years
            </span>
            <span className="hidden md:inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-accent" />
              {associationStats.memberCount}+ verified members
            </span>
          </div>
          <span className="inline-flex items-center gap-1">
            <BadgeCheck className="h-3.5 w-3.5 text-accent" />
            <span className="hidden md:inline">All sellers KYC-verified by MDDMA admin</span>
            <span className="md:hidden">KYC-verified by MDDMA</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default TrustStrip;
