import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/contexts/RoleContext";
import { TrendingUp, TrendingDown, Minus, BarChart3, Lock, Flame, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// V2: Signal-based market intelligence — no complex charts
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

  if (!canAccess("market_intelligence")) {
    return (
      <Layout>
        <section className="bg-primary py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">Market Intelligence</h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">Price signals, supply-demand indicators and trade insights</p>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4 text-center max-w-md">
            <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Paid Members Only</h2>
            <p className="text-muted-foreground mb-6">Market Intelligence is available to Paid Members, Brokers and Admins.</p>
            <Button className="bg-accent hover:bg-accent/90 text-primary" asChild>
              <Link to="/membership">View Membership Plans</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* V2: Signal-based dashboard */}
          <Card className="mb-6">
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
                      <th className="py-2 px-3 text-muted-foreground font-medium hidden lg:table-cell">Signal</th>
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
                        <td className="py-2.5 px-3 text-muted-foreground text-xs hidden lg:table-cell max-w-[300px]">{item.signal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <h2 className="text-xl font-bold text-foreground mb-4">Market Insights</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {insights.map((insight) => (
              <Card key={insight.title} className="bg-card border-border">
                <CardContent className="p-5">
                  <Badge variant="secondary" className="text-xs mb-2">{insight.category}</Badge>
                  <h3 className="font-semibold text-foreground mb-1">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Market;
