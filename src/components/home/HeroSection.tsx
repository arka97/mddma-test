import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck, BadgeCheck, ArrowRight } from "lucide-react";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import { Logo } from "@/components/brand/Logo";


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
    <section className="relative bg-gradient-to-b from-card via-cream to-muted overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231B2F5E' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Heritage badge */}
          <div className="inline-block mb-6">
            <Logo variant="horizontal" className="h-16 sm:h-20 w-auto" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-6">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span className="text-burgundy font-semibold text-sm">Established 1930</span>
            <span className="text-navy/30">•</span>
            <span className="text-navy/75 text-sm">Mumbai&apos;s Trade Authority</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight mb-8">
            India&apos;s Digital <span className="text-accent">Trade Hub</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl mt-2 text-navy/85 font-semibold">
              for Dry Fruits, Dates &amp; Commodities
            </span>
          </h1>

          {/* Command bar */}
          <form
            onSubmit={submit}
            className="bg-card border border-border/80 ring-1 ring-navy/5 rounded-xl shadow-2xl p-2 sm:p-3 flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="What commodity? e.g. Mamra almonds, W320 cashews"
                className="pl-10 h-11 border-0 focus-visible:ring-1 focus-visible:ring-accent"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              variant="premium"
              className="h-11 font-semibold sm:w-auto"
            >
              <Search className="h-4 w-4 mr-1.5" /> Find Sellers
            </Button>
          </form>

          {/* Trust line under command bar */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-navy/70">
            <BadgeCheck className="h-4 w-4 text-accent" />
            {["Verified Sellers", "Direct Quotes"].map((item, i, arr) => (
              <span key={item} className="inline-flex items-center gap-2.5">
                <span className="font-medium tracking-wide uppercase text-[11px] sm:text-xs text-navy/80">
                  {item}
                </span>
                {i < arr.length - 1 && <span className="text-accent/70">•</span>}
              </span>
            ))}
          </div>

          {/* Quick category chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-navy/60">Popular:</span>
            {HOT_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/products?q=${encodeURIComponent(cat)}&view=marketplace`}
                className="text-xs px-3 py-1 rounded-full bg-card text-navy hover:text-burgundy border border-border hover:border-accent/60 transition-colors"
              >
                {cat}
              </Link>
            ))}
            <Link
              to="/directory"
              className="text-xs px-3 py-1 rounded-full text-navy/70 hover:text-burgundy inline-flex items-center"
            >
              Browse all sellers <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>

          {/* PWA install CTA */}
          <div className="mt-8 flex justify-center">
            <InstallAppButton size="lg" className="h-11 px-5" label="Install MDDMA App" />
          </div>
        </div>

        {/* Brand line */}
        <div className="mt-14 text-center max-w-3xl mx-auto">
          <div className="text-3xl sm:text-4xl font-bold text-accent mb-1">Established 1930</div>
          <div className="text-sm text-navy/60">
            One of India&apos;s oldest dry fruits &amp; dates trade associations
          </div>
        </div>
      </div>
    </section>
  );
}
