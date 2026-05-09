import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/contexts/RoleContext";
import { TrendingUp, TrendingDown, Minus, BarChart3, Lock, Flame, AlertTriangle, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const marketSignals = [
  { commodity: "California Almonds", priceRange: "₹820–880/kg", trend: "rising" as const, demand: "High", supply: "Stable", signal: "Strong demand pre-Diwali. California crop report positive.", inquiries: 38 },
  { commodity: "Iranian Pistachios", priceRange: "₹1,150–1,250/kg", trend: "rising" as const, demand: "High", supply: "Tightening", signal: "Iran export restrictions. Supply squeeze expected.", inquiries: 29 },
  { commodity: "W240 Cashews", priceRange: "₹750–810/kg", trend: "falling" as const, demand: "Medium", supply: "Increasing", signal: "Vietnam new crop arriving. Prices stabilizing.", inquiries: 15 },
  { commodity: "Kimia Dates", priceRange: "₹300–340/kg", trend: "rising" as const, demand: "High", supply: "Stable", signal: "Ramadan season demand. Iranian supply steady.", inquiries: 42 },
  { commodity: "Afghan Green Raisins", priceRange: "₹260–300/kg", trend: "rising" as const, demand: "High", supply: "Tight", signal: "Supply disruption from Afghanistan. Limited stock.", inquiries: 28 },
  { commodity: "Chilean Walnuts", priceRange: "₹880–960/kg", trend: "falling" as const, demand: "Medium", supply: "Increasing", signal: "New Chilean crop arriving in April.", inquiries: 17 },
  { commodity: "Medjool Dates", priceRange: "₹1,700–1,900/kg", trend: "rising" as const, demand: "High", supply: "Stable", signal: "Premium demand growing. Jordan supply stable.", inquiries: 21 },
  { commodity: "W180 Cashews", priceRange: "₹1,400–1,500/kg", trend: "stable" as const, demand: "Medium", supply: "Stable", signal: "King cashew premium holding. Export demand steady.", inquiries: 14 },
];

const insights = [
  { title: "Pistachio supply tightening in Mumbai", category: "Supply", description: "Iran restrictions expected to reduce supply 15-20%. RFQ activity up 40%." },
  { title: "Cashew processing shift to India", category: "Industry", description: "Domestic processing capacity growth reducing import dependency." },
  { title: "Dates import at 5-year high", category: "Demand", description: "January recorded highest-ever dates import. Ramadan demand building." },
  { title: "Almond futures pointing to Q2 rise", category: "Forecast", description: "California drought + Asian demand driving futures up 8-12%." },
];

const TrendIcon = ({ trend }: { trend: "rising" | "falling" | "stable" }) => {
  if (trend === "rising") return <TrendingUp className="h-4 w-4 text-red-500" />;
  if (trend === "falling") return <TrendingDown className="h-4 w-4 text-green-600" />;
  return <Minus className="h-4 w-4 text-yellow-500" />;
};

const DemandBadge = ({ level }: { level: string }) => {
  const colors: Record<string, string> = {
    High: "bg-red-100 text-red-700 border-red-200",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Low: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return <Badge variant="outline" className={`text-xs ${colors[level] || ""}`}>{level === "High" && <Flame className="h-3 w-3 mr-0.5" />}{level}</Badge>;
};

const SupplyBadge = ({ level }: { level: string }) => {
  const colors: Record<string, string> = {
    Tight: "bg-red-100 text-red-700 border-red-200",
    Tightening: "bg-orange-100 text-orange-700 border-orange-200",
    Stable: "bg-green-100 text-green-700 border-green-200",
    Increasing: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return <Badge variant="outline" className={`text-xs ${colors[level] || ""}`}>{level === "Tight" && <AlertTriangle className="h-3 w-3 mr-0.5" />}{level}</Badge>;
};

const Market = () => {
  const { canAccess } = useRole();
  const isPaid = canAccess("market_intelligence");

  return (
    <Layout>
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">Market Intelligence</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Signal-based market intelligence — price ranges, demand indicators, and supply signals
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Inline subscribe banner for guests / free members */}
          {!isPaid && (
            <Card className="border-accent/40 bg-accent/5">
              <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Crown className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground">Unlock the full Market Intelligence feed</div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Paid members see committee analyst reasoning behind every price move, plus weekly insights and supply alerts.
                    </p>
                  </div>
                </div>
                <Button asChild size="sm" className="text-accent-foreground sm:flex-shrink-0">
                  <Link to="/membership">View plans</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Signals table — full structure visible to everyone, reasoning gated */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" /> Market Signals Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="py-2 px-3 text-muted-foreground font-medium">Commodity</th>
                      <th className="py-2 px-3 text-muted-foreground font-medium">Price Range</th>
                      <th className="py-2 px-3 text-muted-foreground font-medium">Trend</th>
                      <th className="py-2 px-3 text-muted-foreground font-medium">Demand</th>
                      <th className="py-2 px-3 text-muted-foreground font-medium">Supply</th>
                      <th className="py-2 px-3 text-muted-foreground font-medium hidden lg:table-cell">
                        Analyst signal
                        {!isPaid && <Lock className="inline h-3 w-3 ml-1 text-accent" />}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketSignals.map((item) => (
                      <tr key={item.commodity} className={`border-b border-border/50 ${item.demand === "High" && item.supply === "Tight" ? "bg-red-50/50" : ""}`}>
                        <td className="py-2.5 px-3">
                          <span className="font-medium text-foreground">{item.commodity}</span>
                          <span className="text-[10px] text-muted-foreground block">{item.inquiries} inquiries this week</span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-foreground">{item.priceRange}</td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1">
                            <TrendIcon trend={item.trend} />
                            <span className={`text-xs font-medium ${
                              item.trend === "rising" ? "text-red-600" : item.trend === "falling" ? "text-green-600" : "text-yellow-600"
                            }`}>
                              {item.trend.charAt(0).toUpperCase() + item.trend.slice(1)}
                            </span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3"><DemandBadge level={item.demand} /></td>
                        <td className="py-2.5 px-3"><SupplyBadge level={item.supply} /></td>
                        <td className="py-2.5 px-3 text-xs hidden lg:table-cell max-w-[300px]">
                          {isPaid ? (
                            <span className="text-muted-foreground">{item.signal}</span>
                          ) : (
                            <span className="select-none blur-sm text-muted-foreground" aria-hidden>
                              {item.signal}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!isPaid && (
                <p className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1">
                  <Lock className="h-3 w-3 text-accent" />
                  Direction (rising / stable / falling) is free for everyone. Analyst reasoning is paid-member only.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Insights — gated for non-paid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Market Insights</h2>
              {!isPaid && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3 text-accent" /> Paid-member feed
                </span>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {insights.map((insight) => (
                <Card key={insight.title} className="bg-card border-border relative overflow-hidden">
                  <CardContent className="p-5">
                    <Badge variant="secondary" className="text-xs mb-2">{insight.category}</Badge>
                    <h3 className={`font-semibold text-foreground mb-1 ${isPaid ? "" : "blur-[2px] select-none"}`}>{insight.title}</h3>
                    <p className={`text-sm text-muted-foreground ${isPaid ? "" : "blur-[3px] select-none"}`}>{insight.description}</p>
                  </CardContent>
                  {!isPaid && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/95 via-background/60 to-transparent">
                      <Button asChild size="sm" className="text-accent-foreground mt-12">
                        <Link to="/membership"><Lock className="h-3 w-3 mr-1" /> Unlock insights</Link>
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Market;
