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
      className="relative overflow-hidden rounded-2xl border border-border bg-card px-5 py-6 shadow-sm sm:px-7 sm:py-8"
    >
      <div className="absolute inset-x-5 top-0 h-0.5 bg-[hsl(var(--gold))]/70 sm:inset-x-7" aria-hidden />
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[hsl(var(--gold-dark))]">
        G-BAU-G · Governed by MDDMA
      </p>
      <h1 className="mt-2 max-w-3xl text-xl font-semibold leading-tight text-foreground sm:text-2xl md:text-3xl">
        The verified business network for nuts, dry fruits, dates, seeds, spices and allied foods.
      </h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Discover legitimate businesses, follow market intelligence, publish requirements and move qualified trade conversations forward.
      </p>

      {metrics && (
        <p className="mt-3 text-xs font-medium text-foreground">
          {metrics.verifiedBusinesses} approved businesses · {metrics.activeRfqs} active requirements · {metrics.recentBulletins} official updates this quarter
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link
          to="/directory"
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-sm transition-opacity hover:opacity-90"
        >
          Explore businesses <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        {!canParticipate && (
          <Link
            to={user ? "/apply" : "/login"}
            className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--gold))]/50 bg-[hsl(var(--gold))]/10 px-4 py-2 text-xs font-semibold text-[hsl(var(--gold-dark))] transition-colors hover:bg-[hsl(var(--gold))]/20"
          >
            {user ? "Verify your business" : "Register your business"}
          </Link>
        )}
        {canParticipate && (
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Open business desk
          </Link>
        )}
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-muted-foreground">
        <li className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-[hsl(var(--gold-dark))]" /> Verified businesses only
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Globe2 className="h-3.5 w-3.5 text-[hsl(var(--gold-dark))]" /> Indian and overseas participation
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5 text-[hsl(var(--gold-dark))]" /> Operated by MDDMA
        </li>
      </ul>
    </section>
  );
}
