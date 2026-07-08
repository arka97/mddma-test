import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { CheckCircle2, ShieldCheck, Crown, ArrowRight, Sparkles } from "lucide-react";

interface Tier {
  name: string;
  price: string;
  period: string;
  tagline: string;
  cta: string;
  ctaHref: string;
  highlighted: boolean;
  icon: typeof ShieldCheck;
  features: string[];
}

const tiers: Tier[] = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    tagline: "For buyers, retailers and market-watchers.",
    cta: "Create free account",
    ctaHref: "/login",
    highlighted: false,
    icon: ShieldCheck,
    features: [
      "Browse the verified member directory",
      "Read every published circular",
      "View category-level rate ranges",
      "Contact any verified seller (after sign-in)",
    ],
  },
  {
    name: "Paid",
    price: "₹10,000",
    period: "per year",
    tagline: "For importers, wholesalers, sellers and brokers.",
    cta: "Apply for membership",
    ctaHref: "/apply",
    highlighted: true,
    icon: Crown,
    features: [
      "Verified seller storefront with logo & badge",
      "Unlimited product & brand listings",
      "Priority placement in directory & search",
      "Post & respond to live RFQs (1–90 day expiry)",
      "Community feed access — post, comment, ask",
      "Market intelligence — full rate history & trend signals",
      "Contact-reveal analytics & lead notifications",
    ],
  },
];

const compareRows: { label: string; free: string; paid: string }[] = [
  { label: "Directory listing", free: "Basic", paid: "Verified + priority" },
  { label: "Contact seller", free: "Yes", paid: "Yes + your contact revealed to buyers" },
  { label: "Product listings", free: "—", paid: "Unlimited" },
  { label: "Brand storefront", free: "—", paid: "Included" },
  { label: "Live RFQs", free: "Teaser only", paid: "Post & respond" },
  { label: "Community feed", free: "Read (first 7 days)", paid: "Post, comment, anonymous option" },
  { label: "Market intelligence", free: "Range only", paid: "Full history + signals" },
  { label: "Broker profile", free: "—", paid: "Included (tick 'I operate as a broker' at apply)" },
  { label: "Trust badge", free: "—", paid: "Yes" },
];

const MembershipPlans = () => {
  return (
    <Layout>
      <Seo
        title="MDDMA Membership — Free & Paid (₹10,000/year)"
        description="Join India's 95-year-old dry-fruit trade association. Free for buyers. ₹10,000/year for verified sellers, brokers and importers — storefront, RFQs, community and market intelligence."
        path="/membership"
      />
      <PageHeader
        eyebrow="Membership"
        title="One association, two ways to join"
        subtitle="Free for buyers and market-watchers. ₹10,000/year for sellers, importers and brokers who want to be found, quoted and verified."
      />

      <section className="py-10 sm:py-14">
        <div className="container mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <Card
                  key={tier.name}
                  className={`relative bg-card border-border ${
                    tier.highlighted ? "border-[hsl(var(--gold))]/50 shadow-lg ring-1 ring-[hsl(var(--gold))]/30" : ""
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] font-semibold">
                        Recommended for sellers
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${
                          tier.highlighted
                            ? "bg-[hsl(var(--gold))]/15 text-[hsl(var(--gold-dark))]"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{tier.tagline}</p>
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                      <span className="text-sm text-muted-foreground">/ {tier.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="mb-5 space-y-2.5">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--gold-dark))]" />
                          <span className="text-foreground/90">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={tier.highlighted ? "default" : "outline"}
                      asChild
                    >
                      <Link to={tier.ctaHref}>
                        {tier.cta} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-muted/30 px-5 py-3">
              <h2 className="text-sm font-semibold text-foreground">What you unlock, side by side</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-semibold">Feature</th>
                    <th className="px-5 py-3 font-semibold">Free</th>
                    <th className="px-5 py-3 font-semibold text-[hsl(var(--gold-dark))]">Paid · ₹10,000/yr</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {compareRows.map((r) => (
                    <tr key={r.label} className="hover:bg-muted/20">
                      <td className="px-5 py-2.5 font-medium text-foreground">{r.label}</td>
                      <td className="px-5 py-2.5 text-muted-foreground">{r.free}</td>
                      <td className="px-5 py-2.5 text-foreground">{r.paid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-border bg-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-[hsl(var(--gold-dark))]" />
              <div>
                <p className="text-sm font-semibold text-foreground">Questions about brokers, group discounts or enterprise access?</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Reach the secretariat and we'll help you pick.</p>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link to="/contact">Contact us <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MembershipPlans;
