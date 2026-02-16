import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Search, ArrowRight, ShieldCheck } from "lucide-react";
import { associationStats } from "@/data/sampleData";

export function HeroSection() {
  return (
    <section className="relative bg-primary overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="text-center max-w-4xl mx-auto">
          {/* Heritage Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 mb-6">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span className="text-accent font-semibold text-sm">
              Established 1930s
            </span>
            <span className="text-primary-foreground/60">•</span>
            <span className="text-primary-foreground/80 text-sm">
              {associationStats.yearsOfService} Years of Service
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
            Mumbai's Trusted{" "}
            <span className="text-accent">Dry Fruits Trade</span> Association
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Connecting verified traders, importers, and buyers across{" "}
            <span className="font-semibold text-accent">
              {associationStats.memberCount}+ members
            </span>{" "}
            in {associationStats.marketsCovered} major markets — Mumbai & Navi
            Mumbai.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 h-12 text-base"
              asChild
            >
              <Link to="/directory">
                <Search className="mr-2 h-5 w-5" />
                Find Verified Traders
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8 h-12 text-base"
              asChild
            >
              <Link to="/apply">
                <Users className="mr-2 h-5 w-5" />
                Become a Member
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { value: `${associationStats.yearsOfService}`, label: "Years Legacy" },
            { value: `${associationStats.memberCount}+`, label: "Verified Members" },
            { value: `${associationStats.marketsCovered}`, label: "APMC Markets" },
            { value: `${associationStats.commodityTypes}+`, label: "Products Listed" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4">
              <div className="text-3xl sm:text-4xl font-bold text-accent mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-primary-foreground/70">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
