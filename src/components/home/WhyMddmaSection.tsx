import { ShieldCheck, Users, Scale, Globe, Award, TrendingUp } from "lucide-react";

const reasons = [
  { icon: ShieldCheck, title: "Verified Network", description: "Every member goes through MDDMA's verification process. Trade with confidence." },
  { icon: Users, title: "350+ Members", description: "Access Mumbai's largest community of dry fruits traders, importers and processors." },
  { icon: Scale, title: "Dispute Resolution", description: "Fair and efficient arbitration to resolve trade disputes quickly." },
  { icon: Globe, title: "Global Sourcing", description: "Members import from 20+ countries — USA, Iran, Afghanistan, Vietnam and more." },
  { icon: Award, title: "95 Years of Trust", description: "One of India's oldest trade associations with a legacy of integrity since 1930." },
  { icon: TrendingUp, title: "Market Intelligence", description: "Access expo leads, trade data and market reports to grow your business." },
];

export function WhyMddmaSection() {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
            Why MDDMA?
          </h2>
          <p className="text-muted-foreground">
            India's most trusted platform for verified dry fruits and dates trade
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => (
            <div key={reason.title} className="flex items-start gap-4 p-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <reason.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{reason.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
