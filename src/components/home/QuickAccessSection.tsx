import { Link } from "react-router-dom";
import { FileText, CreditCard, BarChart3, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sampleCirculars } from "@/data/sampleData";

const quickAccessItems = [
  {
    title: "Latest Circulars",
    description: "Stay updated with recent government notifications and trade updates",
    icon: FileText,
    href: "/circulars",
    badge: "3 New",
    badgeVariant: "default" as const,
  },
  {
    title: "Membership Renewal",
    description: "Renew your membership online with easy payment options",
    icon: CreditCard,
    href: "/renew",
    badge: "Due Soon?",
    badgeVariant: "outline" as const,
  },
  {
    title: "Market Updates",
    description: "Get the latest commodity prices and market trends",
    icon: BarChart3,
    href: "/market",
    badge: "Daily",
    badgeVariant: "secondary" as const,
  },
];

export function QuickAccessSection() {
  // Get latest 3 public circulars
  const latestCirculars = sampleCirculars
    .filter((c) => c.isPublic)
    .slice(0, 3);

  return (
    <section className="py-16 sm:py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
            Quick Access
          </h2>
          <p className="text-muted-foreground">
            Essential services and information at your fingertips
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Access Cards */}
          {quickAccessItems.map((item) => (
            <Card
              key={item.title}
              className="group bg-card border-border hover:border-accent/50 card-hover"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-accent group-hover:text-primary transition-colors">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <Badge variant={item.badgeVariant}>{item.badge}</Badge>
                </div>
                <CardTitle className="text-lg mt-4">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.description}
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-accent hover:text-accent/80"
                  asChild
                >
                  <Link to={item.href}>
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Circulars Preview */}
        <div className="mt-12">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Recent Circulars</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/circulars">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {latestCirculars.map((circular) => (
                  <div
                    key={circular.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={
                            circular.category === "Government"
                              ? "default"
                              : circular.category === "Trade"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {circular.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(circular.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <h4 className="font-medium text-foreground">
                        {circular.title}
                      </h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-accent self-start sm:self-center"
                      asChild
                    >
                      <Link to={`/circulars/${circular.id}`}>
                        Read
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
