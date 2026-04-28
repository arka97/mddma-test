import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, ShieldCheck, BadgeCheck, ArrowRight } from "lucide-react";
import { associationStats } from "@/data/sampleData";

const HOT_CATEGORIES = ["Almonds", "Cashews", "Dates", "Pistachios", "Walnuts", "Raisins"];
const ORIGINS = ["USA", "Iran", "Afghanistan", "India", "Vietnam", "Chile", "Turkey", "Saudi Arabia", "Jordan", "Australia", "Kashmir"];

export function HeroSection() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [origin, setOrigin] = useState("all");

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (origin !== "all") sp.set("origin", origin);
    sp.set("view", "marketplace");
    navigate(`/products?${sp.toString()}`);
  };

  return (
    <section className="relative bg-primary overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Heritage badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 mb-6">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span className="text-accent font-semibold text-sm">Established 1930s</span>
            <span className="text-primary-foreground/60">•</span>
            <span className="text-primary-foreground/80 text-sm">
              {associationStats.yearsOfService} Years of Service
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-4">
            India&apos;s Digital <span className="text-accent">Trade Hub</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl mt-2 text-primary-foreground/90 font-semibold">
              for Dry Fruits, Dates &amp; Commodities
            </span>
          </h1>

          <p className="text-base sm:text-lg text-primary-foreground/75 max-w-2xl mx-auto mb-8">
            <span className="font-semibold text-accent">{associationStats.memberCount}+ KYC-verified sellers</span>
            {" · "}direct quotes
            {" · "}no broker gatekeeping.
          </p>

          {/* Command bar */}
          <form
            onSubmit={submit}
            className="bg-background rounded-xl shadow-2xl p-2 sm:p-3 flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto"
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
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger className="h-11 sm:w-44 border-0 bg-muted/40">
                <SelectValue placeholder="Any origin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any origin</SelectItem>
                {ORIGINS.map((o) => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="submit"
              size="lg"
              className="h-11 bg-accent hover:bg-accent/90 text-primary font-semibold sm:w-auto"
            >
              <Search className="h-4 w-4 mr-1.5" /> Find Sellers
            </Button>
          </form>

          {/* Trust line under command bar */}
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary-foreground/70">
            <BadgeCheck className="h-3.5 w-3.5 text-accent" />
            All sellers are KYC-verified by MDDMA admin · GST · PAN · FSSAI · Bank
          </div>

          {/* Quick category chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-primary-foreground/60">Popular:</span>
            {HOT_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/products?q=${encodeURIComponent(cat)}&view=marketplace`}
                className="text-xs px-3 py-1 rounded-full bg-primary-foreground/10 hover:bg-accent/30 text-primary-foreground/90 hover:text-accent border border-primary-foreground/20 hover:border-accent/40 transition-colors"
              >
                {cat}
              </Link>
            ))}
            <Link
              to="/directory"
              className="text-xs px-3 py-1 rounded-full text-primary-foreground/80 hover:text-accent inline-flex items-center"
            >
              Browse all sellers <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { value: `${associationStats.yearsOfService}`, label: "Years Legacy" },
            { value: `${associationStats.memberCount}+`, label: "Verified Members" },
            { value: "₹1,000 Cr", label: "Annual Trade" },
            { value: `${associationStats.commodityTypes}+`, label: "Commodity Categories" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4">
              <div className="text-3xl sm:text-4xl font-bold text-accent mb-1">{stat.value}</div>
              <div className="text-sm text-primary-foreground/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
