import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, MapPin, CalendarClock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface HeroCounts {
  members: number | null;
  circulars: number | null;
}

export function HomeHero() {
  const { user, hasRole } = useAuth();
  const isMember = hasRole("paid_member") || hasRole("admin");
  const [counts, setCounts] = useState<HeroCounts>({ members: null, circulars: null });

  useEffect(() => {
    let alive = true;
    const quarterAgo = new Date(Date.now() - 90 * 86400_000).toISOString();
    (async () => {
      const [{ count: members }, { count: circs }] = await Promise.all([
        supabase.from("companies").select("id", { count: "exact", head: true }),
        supabase
          .from("circulars")
          .select("id", { count: "exact", head: true })
          .eq("is_published", true)
          .gte("published_at", quarterAgo),
      ]);
      if (!alive) return;
      setCounts({ members: members ?? 0, circulars: circs ?? 0 });
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section
      aria-label="Association introduction"
      className="relative overflow-hidden rounded-2xl border border-border bg-card px-5 py-6 shadow-sm sm:px-7 sm:py-8"
    >
      <div className="absolute inset-x-5 top-0 h-0.5 bg-[hsl(var(--gold))]/70 sm:inset-x-7" aria-hidden />
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[hsl(var(--gold-dark))]">
        MDDMA · Est. 1930
      </p>
      <h1 className="mt-2 max-w-2xl text-xl font-semibold leading-tight text-foreground sm:text-2xl md:text-3xl">
        India&apos;s verified trade network for dates, mamra &amp; dry fruits.
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {counts.members != null && counts.circulars != null ? (
          <>
            {counts.members} verified merchant firms · {counts.circulars} trade circulars this quarter · APMC Vashi, Mumbai.
          </>
        ) : (
          <>Verified merchant firms, live APMC signals and official trade circulars from Mumbai&apos;s dry-fruit mandi.</>
        )}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link
          to="/directory"
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-sm transition-opacity hover:opacity-90"
        >
          Browse members <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        {!isMember && (
          <Link
            to={user ? "/apply" : "/membership"}
            className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--gold))]/50 bg-[hsl(var(--gold))]/10 px-4 py-2 text-xs font-semibold text-[hsl(var(--gold-dark))] transition-colors hover:bg-[hsl(var(--gold))]/20"
          >
            {user ? "Apply for membership" : "See membership"}
          </Link>
        )}
        {isMember && (
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Open dashboard
          </Link>
        )}
      </div>

      {!isMember && (
        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-muted-foreground">
          <li className="inline-flex items-center gap-1.5">
            <CalendarClock className="h-3.5 w-3.5 text-[hsl(var(--gold-dark))]" /> 95+ years of trade
          </li>
          <li className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[hsl(var(--gold-dark))]" /> APMC Vashi, Navi Mumbai
          </li>
          <li className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[hsl(var(--gold-dark))]" /> KYC-verified firms
          </li>
        </ul>
      )}
    </section>
  );
}
