import { BadgeCheck, ShieldCheck } from "lucide-react";

// Slim persistent strip under the header. Surfaces credibility on every
// page in <40px without competing with the navy hero on landing.
export function TrustStrip() {
  return (
    <div className="hidden sm:block border-b border-border bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 py-1.5 text-[11px] text-muted-foreground">
          <BadgeCheck className="h-3.5 w-3.5 text-accent" />
          <span>KYC-verified sellers</span>
          <span className="text-border">·</span>
          <ShieldCheck className="h-3.5 w-3.5 text-accent" />
          <span>Established 1930</span>
        </div>
      </div>
    </div>
  );
}

export default TrustStrip;
