import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FooterCTA() {
  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-10 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <div>
          <h2 className="t-h3 text-foreground">Become a verified seller</h2>
          <p className="text-sm text-muted-foreground">
            Apply for membership and get listed in front of MDDMA's buyer network.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link to="/apply">
              Apply now <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
