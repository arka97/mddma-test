import { ShieldCheck, Users, Award, TrendingUp } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Verified network",
    description: "Every member is KYC-vetted by MDDMA. Trade with confidence.",
  },
  {
    icon: Users,
    title: "350+ members",
    description: "Mumbai's largest community of dry-fruit traders, importers and processors.",
  },
  {
    icon: Award,
    title: "95 years of trust",
    description: "One of India's oldest trade associations — a legacy of integrity since 1930.",
  },
  {
    icon: TrendingUp,
    title: "Market intelligence",
    description: "Live prices, expo leads, and trade data to grow your business.",
  },
];

export function WhyMddmaSection() {
  return (
    <section className="bg-background py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="t-h2 text-foreground">Why MDDMA</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            India's most trusted platform for verified dry-fruits and dates trade.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div key={reason.title} className="flex flex-col gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                <reason.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{reason.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
