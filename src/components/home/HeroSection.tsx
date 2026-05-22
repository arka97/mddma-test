import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck } from "lucide-react";

/**
 * Hims-style hero — calm, generous whitespace, one clear primary action.
 * Designed for older / non-tech traders: large display headline, plain words,
 * single primary CTA, secondary text link.
 */
const HOT_CATEGORIES = [
  { label: "Almonds", hi: "बादाम" },
  { label: "Cashews", hi: "काजू" },
  { label: "Dates", hi: "खजूर" },
  { label: "Pistachios", hi: "पिस्ता" },
];

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
    <section className="relative overflow-hidden bg-surface-cream">
      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="t-eyebrow mb-4 text-muted-foreground">
            Mumbai Dry Fruits &amp; Dates Merchants Association · Since 1930
          </p>

          <h1 className="font-display text-5xl text-foreground sm:text-6xl md:text-7xl">
            Buy &amp; sell dry fruits,
            <br className="hidden sm:block" />
            <span className="italic text-accent"> the verified way.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Find trusted Mumbai sellers. Send one price request. Get replies on WhatsApp.
          </p>

          <form
            onSubmit={submit}
            className="mx-auto mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search: dal, cashew, dates, sugar…"
                aria-label="Search commodities or sellers"
                className="h-12 border-0 pl-11 text-base shadow-none focus-visible:ring-0"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 text-base sm:w-auto">
              Search
            </Button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {HOT_CATEGORIES.map((c) => (
              <Link
                key={c.label}
                to={`/products?q=${encodeURIComponent(c.label)}&view=marketplace`}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:border-accent/40 hover:text-accent"
              >
                {c.label} <span className="text-muted-foreground">· {c.hi}</span>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-success" />
            <span>1,200+ GST-verified Mumbai traders</span>
          </div>
        </div>
      </div>
    </section>
  );
}
