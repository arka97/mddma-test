import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PaywallOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur px-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Join MDDMA to access the community</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Get market signals, trade alerts, RFQ board and direct messaging with verified members.
        </p>
        <div className="mt-5 space-y-2">
          <Button asChild variant="accent" className="w-full">
            <Link to="/apply">Join for ₹10,000/year</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/membership">Learn more</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function GuestTeaser() {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-gradient-to-t from-background via-background/90 to-transparent px-6 pb-24 pt-32 sm:items-center sm:pb-6">
      <div className="max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-lg">
        <h2 className="text-lg font-bold text-foreground">Sign in to join the conversation</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The G-BAU-G market feed is open to verified members only.
        </p>
        <div className="mt-4 space-y-2">
          <Button asChild variant="accent" className="w-full">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/apply">Apply for membership</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
