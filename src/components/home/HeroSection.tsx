import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck, ArrowRight } from "lucide-react";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import { MarketTicker } from "@/components/layout/MarketTicker";

const HOT_CATEGORIES = ["Almonds", "Cashews", "Dates", "Pistachios", "Walnuts", "Raisins"];

export function HeroSection() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    sp.set("view", "marketplace");
    navigate(`/products?${sp.toString()}`);
  };

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-muted/40 via-background to-background">
      <div className="relative container mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="t-eyebrow mb-4 inline-flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden />
            Established 1930 · India's Trade Authority
          </div>

          <h1 className="t-display mb-4 text-foreground">
            The home of <span className="text-accent">India's dry fruit trade.</span>
          </h1>

          <p className="t-body mx-auto mb-8 max-w-2xl text-muted-foreground">
            Browse verified sellers, get direct quotes, and track live prices across Mumbai's APMC market.
          </p>

          <form
            onSubmit={submit}
            className="mx-auto flex max-w-2xl flex-col gap-2 rounded-xl border border-border bg-card p-2 shadow-sm sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Mamra almonds, W320 cashews, Medjool dates…"
                className="h-11 border-0 pl-10 shadow-none focus-visible:ring-0"
              />
            </div>
            <Button type="submit" size="lg" className="h-11 sm:w-auto">
              <Search className="mr-1.5 h-4 w-4" /> Find sellers
            </Button>
          </form>

          <div className="mx-auto mt-4 max-w-3xl">
            <MarketTicker />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground">Popular:</span>
            {HOT_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/products?q=${encodeURIComponent(cat)}&view=marketplace`}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground transition-colors hover:border-accent/40 hover:text-accent"
              >
                {cat}
              </Link>
            ))}
            <Link
              to="/directory"
              className="inline-flex items-center rounded-full px-3 py-1 text-xs text-muted-foreground hover:text-accent"
            >
              Browse all sellers <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>

          <div className="mt-6 flex justify-center">
            <InstallAppButton size="sm" label="Install MDDMA App" />
          </div>
        </div>
      </div>
    </section>
  );
}
