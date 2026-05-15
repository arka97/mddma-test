import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
interface MembershipTier { name: string; price: string; period: string; features: string[]; badge: string; sponsoredEligible: boolean; highlighted: boolean }
const membershipTiers: MembershipTier[] = [
  { name: "Free", price: "₹0", period: "forever", features: ["Basic directory listing", "Browse verified members", "View public circulars & news", "Submit RFQs as a buyer"], badge: "Free", sponsoredEligible: false, highlighted: false },
  { name: "Paid", price: "₹10,000", period: "per year", features: ["Verified seller storefront", "Product listings with controlled pricing", "Priority placement in directory", "RFQ inbox & CRM", "Market intelligence reports", "Trust seal & verification badge"], badge: "Paid Member", sponsoredEligible: true, highlighted: true },
];
import { CheckCircle2, ShieldCheck, Star, Crown } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const tierIcons = [ShieldCheck, Star, Crown];

const MembershipPlans = () => {
  return (
    <Layout>
      <Seo title='MDDMA Membership Plans — Free & Paid (₹10,000/year)' description='Join MDDMA. Choose Free for buyers or Paid (₹10,000/year) for verified seller storefront, RFQ inbox and trust badges.' path='/membership' />
      <PageHeader
        title="Membership Plans"
        subtitle="Choose the right plan for your business. All plans include directory listing and association membership."
      />

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {membershipTiers.map((tier, index) => {
              const Icon = tierIcons[index];
              return (
                <Card
                  key={tier.name}
                  className={`bg-card border-border relative ${
                    tier.highlighted
                      ? "border-accent shadow-lg ring-2 ring-accent/20"
                      : ""
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-accent text-accent-foreground font-semibold">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-3">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                      <span className="text-muted-foreground text-sm"> / {tier.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="text-xs text-muted-foreground mb-3 space-y-1">
                      <p>Badge: {tier.badge}</p>
                      <p>Sponsored Eligible: {tier.sponsoredEligible ? "Yes" : "No"}</p>
                    </div>
                    <Button
                      className="w-full"
                      variant={tier.highlighted ? "default" : "outline"}
                      asChild
                    >
                      <Link to="/apply">Apply Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MembershipPlans;
