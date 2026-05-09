import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, ShieldCheck, Star } from "lucide-react";
import { useDirectory } from "@/hooks/queries/useCompanies";

export function FeaturedMembersSection() {
  const { data: entries = [] } = useDirectory();
  // Live verified/paid first, then any featured demo entry
  const featured = entries
    .filter((m) => m.source === "live" || m.isFeatured)
    .slice(0, 6);

  return (
    <section className="py-16 sm:py-20 bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
              Featured Members
            </h2>
            <p className="text-muted-foreground">
              Verified and trusted traders across Mumbai's markets
            </p>
          </div>
          <Link to="/directory" className="inline-flex items-center text-accent hover:text-accent/80 font-medium text-sm whitespace-nowrap">
            View Full Directory <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((member) => (
            <Link key={member.id} to={`/store/${member.slug}`}>
              <Card className="bg-card border-border hover:border-accent/50 card-hover h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                      {member.logoPlaceholder}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold text-foreground truncate text-sm">
                          {member.firmName}
                        </h3>
                        {member.source === "live" && (
                          <span className="text-[9px] uppercase tracking-wide text-accent font-semibold">Live</span>
                        )}
                        {member.isSponsored && (
                          <Star className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {member.verificationStatus === "Verified" && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5 gap-0.5">
                            <ShieldCheck className="h-3 w-3" />
                            {member.verificationLevel}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">{member.memberType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3" />
                    {member.area}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {member.commodities.slice(0, 3).map((c) => (
                      <Badge key={c} variant="outline" className="text-xs">
                        {c}
                      </Badge>
                    ))}
                    {member.commodities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{member.commodities.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
