import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Globe2,
  Landmark,
  ShieldCheck,
} from "lucide-react";

interface AccessPath {
  name: string;
  label: string;
  tagline: string;
  cta: string;
  ctaHref: string;
  highlighted: boolean;
  icon: typeof Globe2;
  features: string[];
}

const accessPaths: AccessPath[] = [
  {
    name: "Individual account",
    label: "Create an account",
    tagline: "Explore G-BAU-G and prepare a business-verification application.",
    cta: "Create account",
    ctaHref: "/login",
    highlighted: false,
    icon: Globe2,
    features: [
      "Browse permitted public network content",
      "Discover businesses, products and market information",
      "Save your account and begin business onboarding",
      "Contact support and follow Association announcements",
    ],
  },
  {
    name: "Verified business",
    label: "Application reviewed",
    tagline: "For existing Indian and overseas businesses participating in the food trade.",
    cta: "Register your business",
    ctaHref: "/apply",
    highlighted: true,
    icon: Building2,
    features: [
      "Reviewed business identity and public business profile",
      "Storefront for products, brands, services and capabilities",
      "Commercial posting, messaging and Communities as access opens",
      "RFQs and quotations after the required approval",
      "Authorised representatives acting for the business",
    ],
  },
];

const compareRows = [
  { label: "Browse public network", account: "Yes", business: "Yes" },
  { label: "Public business profile", account: "—", business: "After approval" },
  { label: "Business-verification badge", account: "—", business: "Evidence reviewed" },
  { label: "Products, brands and services", account: "—", business: "Storefront" },
  { label: "Commercial posts and messaging", account: "Limited", business: "According to access policy" },
  { label: "RFQs and quotations", account: "—", business: "According to access policy" },
  { label: "MDDMA member badge", account: "—", business: "Only for eligible Association members" },
];

const MembershipPlans = () => {
  return (
    <Layout>
      <Seo
        title="Join the G-BAU-G Verified Business Network"
        description="Create an account or register an existing Indian or overseas food business for verification on G-BAU-G, operated by MDDMA."
        path="/membership"
      />
      <PageHeader
        eyebrow="Join G-BAU-G"
        title="One network, clear identities"
        subtitle="Anyone may create an account. Commercial participation requires an existing business and successful verification."
      />

      <section className="py-10 sm:py-14">
        <div className="container mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
          <div className="mb-6 rounded-2xl border border-border bg-muted/30 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
              <div>
                <h2 className="text-sm font-semibold text-foreground">Verification is not a paid trust badge</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  G-BAU-G business verification, MDDMA Association membership and future commercial packaging are
                  separate. Monetisation is being designed independently and does not determine whether evidence is
                  accepted as genuine.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {accessPaths.map((path) => {
              const Icon = path.icon;
              return (
                <Card
                  key={path.name}
                  className={`relative border-border bg-card ${
                    path.highlighted
                      ? "border-[hsl(var(--gold))]/50 shadow-lg ring-1 ring-[hsl(var(--gold))]/30"
                      : ""
                  }`}
                >
                  {path.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-[hsl(var(--gold))] font-semibold text-primary-foreground">
                        Required for commercial participation
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${
                          path.highlighted
                            ? "bg-[hsl(var(--gold))]/15 text-[hsl(var(--gold-dark))]"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-xl">{path.name}</CardTitle>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{path.tagline}</p>
                    <div className="mt-3 text-sm font-semibold text-foreground">{path.label}</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="mb-5 space-y-2.5">
                      {path.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--gold-dark))]" />
                          <span className="text-foreground/90">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={path.highlighted ? "default" : "outline"} asChild>
                      <Link to={path.ctaHref}>
                        {path.cta} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-muted/30 px-5 py-3">
              <h2 className="text-sm font-semibold text-foreground">Account and business access</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-semibold">Capability</th>
                    <th className="px-5 py-3 font-semibold">Account</th>
                    <th className="px-5 py-3 font-semibold text-[hsl(var(--gold-dark))]">Verified business</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {compareRows.map((row) => (
                    <tr key={row.label} className="hover:bg-muted/20">
                      <td className="px-5 py-2.5 font-medium text-foreground">{row.label}</td>
                      <td className="px-5 py-2.5 text-muted-foreground">{row.account}</td>
                      <td className="px-5 py-2.5 text-foreground">{row.business}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-muted/30 p-5">
              <div className="flex items-start gap-3">
                <Landmark className="mt-0.5 h-5 w-5 text-[hsl(var(--gold-dark))]" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Already an MDDMA member?</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Complete business verification to connect the official MDDMA affiliation badge to your G-BAU-G profile.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-border bg-muted/30 p-5">
              <div>
                <p className="text-sm font-semibold text-foreground">Need help with overseas evidence or authorised users?</p>
                <p className="mt-1 text-xs text-muted-foreground">The secretariat can guide you through the initial application.</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/contact">
                  Contact us <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MembershipPlans;
