import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Step {
  key: string;
  label: string;
  href: string;
  done: boolean;
}

const DISMISS_KEY = "mddma:onboarding-dismissed";

export function OnboardingChecklist() {
  const { profile, company } = useAuth();
  const [productCount, setProductCount] = useState<number | null>(null);
  const [brandCount, setBrandCount] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  useEffect(() => {
    if (!company?.id) return;
    let alive = true;
    (async () => {
      const [{ count: pc }, { count: bc }] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("company_id", company.id),
        supabase.from("brands" as never).select("id", { count: "exact", head: true }).eq("company_id" as never, company.id),
      ]);
      if (!alive) return;
      setProductCount(pc ?? 0);
      setBrandCount(bc ?? 0);
    })();
    return () => { alive = false; };
  }, [company?.id]);

  const steps: Step[] = [
    { key: "profile", label: "Add your name & photo", href: "/account/profile", done: Boolean(profile?.full_name && profile?.avatar_url) },
    { key: "company", label: "Create company profile", href: "/account/company", done: Boolean(company?.id) },
    { key: "logo", label: "Upload company logo", href: "/account/company", done: Boolean(company?.logo_url) },
    { key: "product", label: "List your first product", href: "/account/products", done: (productCount ?? 0) > 0 },
    { key: "brand", label: "Publish your first brand", href: "/account/brands", done: (brandCount ?? 0) > 0 },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const allDone = doneCount === steps.length;
  const pct = Math.round((doneCount / steps.length) * 100);

  if (dismissed || allDone) return null;

  return (
    <section className="rounded-2xl border border-[hsl(var(--gold))]/40 bg-gradient-to-br from-[hsl(var(--gold))]/8 via-card to-card p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--gold-dark))]">
            Set up your storefront
          </p>
          <h2 className="mt-1 text-base font-semibold text-foreground">
            {doneCount} of {steps.length} done · {pct}%
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Finish these to appear higher in the directory and start receiving buyer enquiries.
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, "1");
            setDismissed(true);
          }}
          className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
        >
          Hide
        </button>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-[hsl(var(--gold))] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="mt-4 space-y-2">
        {steps.map((s) => (
          <li key={s.key}>
            <Link
              to={s.href}
              className={`group flex items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2 text-sm transition-colors ${
                s.done ? "text-muted-foreground" : "text-foreground hover:border-border hover:bg-muted/40"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                {s.done ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={s.done ? "line-through" : ""}>{s.label}</span>
              </span>
              {!s.done && <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
