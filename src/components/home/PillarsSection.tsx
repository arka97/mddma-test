import { Building2, FileCheck, Scale, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const pillars = [
  {
    icon: Building2,
    title: "Trade Representation",
    description:
      "Representing the collective interests of dry fruits and dates merchants before government bodies and regulatory authorities.",
  },
  {
    icon: FileCheck,
    title: "Government Liaison",
    description:
      "Facilitating communication with APMC, FSSAI, customs, and other government departments on behalf of our members.",
  },
  {
    icon: Scale,
    title: "Dispute Resolution",
    description:
      "Providing fair and efficient arbitration services to resolve trade disputes between members and with external parties.",
  },
  {
    icon: TrendingUp,
    title: "Market Information",
    description:
      "Disseminating timely market updates, price trends, and regulatory changes to keep members informed and competitive.",
  },
];

export function PillarsSection() {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
            What MDDMA Does
          </h2>
          <p className="text-muted-foreground">
            Four key pillars that define our service to the dry fruits and dates
            trading community of Mumbai
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, index) => (
            <Card
              key={pillar.title}
              className="group bg-card border-border hover:border-accent/50 card-hover"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-primary transition-colors">
                  <pillar.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
