import { Link } from "react-router-dom";
import { ArrowRight, Building2, Globe2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useHomeMetrics } from "@/hooks/queries/useHomeMetrics";

export function HomeHero() {
  const { user, hasRole } = useAuth();
  const canParticipate = hasRole("paid_member") || hasRole("admin");
  const { data: metrics } = useHomeMetrics();

  return (
    <section
      aria-label="G-BAU-G trade network introduction"
      className="rounded-2xl border border-border bg-card px-5 py-6 sm:px-7 sm:py-8"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
        GOVERNED BY MUMBAI DRY FRUITS & DATES MERCHANTS ASSOCIATION
      </p>
      <h1 className="mt-2 max-w-3xl text-2xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-3xl md:text-[2.5rem]">
        The verified business network for nuts, dry fruits, dates, seeds and spices.
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
        Discover legitimate businesses, follow market intelligence, publish requirements and move qualified trade conversations forward.
      </p>

      {metrics && (
        <p className="mt-3 text-[13px] font-medium text-foreground">
          {metrics.verifiedBusinesses} approved businesses · {metrics.activeRfqs} active requirements · {metrics.recentBulletins} official updates this quarter
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <Link
          to="/directory"
          className="inline-flex h-11 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Explore businesses <ArrowRight className="h-4 w-4" />
        </Link>
        {!canParticipate && (
          <Link
            to={user ? "/apply" : "/login"}
            className="inline-flex h-11 items-center gap-1.5 rounded-full border border-input bg-background px-5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            {user ? "Verify your business" : "Register your business"}
          </Link>
        )}
        {canParticipate && (
          <Link
            to="/dashboard"
            className="inline-flex h-11 items-center gap-1.5 rounded-full border border-input bg-background px-5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            Open business desk
          </Link>
        )}
      </div>

      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12px] font-medium text-muted-foreground">
        <li className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-primary" /> Verified businesses only
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Globe2 className="h-4 w-4 text-primary" /> Indian &amp; overseas participation
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Building2 className="h-4 w-4 text-primary" /> Operated by MDDMA
        </li>
      </ul>
    </section>
  );
}
