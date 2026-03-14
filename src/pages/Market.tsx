import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/contexts/RoleContext";
import { TrendingUp, TrendingDown, BarChart3, AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const priceData = [
  { commodity: "California Almonds", current: "₹850/kg", change: "+5.2%", trend: "up", signal: "Strong demand pre-Diwali. California crop report positive." },
  { commodity: "Iranian Pistachios", current: "₹1,200/kg", change: "+12.3%", trend: "up", signal: "Iran export restrictions tightening. Supply squeeze expected." },
  { commodity: "W240 Cashews", current: "₹780/kg", change: "-2.1%", trend: "down", signal: "Vietnam new crop arriving. Prices stabilizing." },
  { commodity: "Kimia Dates", current: "₹320/kg", change: "+8.7%", trend: "up", signal: "Ramadan season demand. Iranian supply steady." },
  { commodity: "Afghan Green Raisins", current: "₹280/kg", change: "+20.5%", trend: "up", signal: "Supply disruption from Afghanistan. Tight market." },
  { commodity: "Chilean Walnuts", current: "₹920/kg", change: "-1.5%", trend: "down", signal: "New Chilean crop arriving in April. Prices easing." },
  { commodity: "Medjool Dates", current: "₹1,800/kg", change: "+3.8%", trend: "up", signal: "Premium demand growing. Jordan supply stable." },
  { commodity: "W180 Cashews", current: "₹1,450/kg", change: "+1.2%", trend: "up", signal: "King cashew premium holding. Export demand strong." },
];

const insights = [
  { title: "Pistachio supply increasing in Mumbai market", category: "Supply", description: "New arrivals from Iran expected to ease prices by 5-8% in coming weeks." },
  { title: "Cashew processing shift to India", category: "Industry", description: "Increased domestic processing capacity reducing dependence on Vietnam imports." },
  { title: "Dates import volume at 5-year high", category: "Demand", description: "January 2025 recorded highest-ever dates import volume at Mumbai ports." },
  { title: "Almond futures pointing to Q2 price rise", category: "Forecast", description: "California drought concerns and strong Asian demand driving futures up." },
];

const Market = () => {
  const { canAccess } = useRole();

  if (!canAccess("market_intelligence")) {
    return (
      <Layout>
        <section className="bg-primary py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">Market Intelligence</h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">Price trends, supply-demand signals and industry insights</p>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4 text-center max-w-md">
            <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Paid Members Only</h2>
            <p className="text-muted-foreground mb-6">Market Intelligence is available to Paid Members, Brokers and Admins. Switch your role using the simulator in the header.</p>
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
            Real-time price trends, supply-demand signals and trade insights for MDDMA members
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Price Trends */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" /> Price Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="py-2 px-3 text-muted-foreground font-medium">Commodity</th>
                      <th className="py-2 px-3 text-muted-foreground font-medium">Current Price</th>
                      <th className="py-2 px-3 text-muted-foreground font-medium">Change</th>
                      <th className="py-2 px-3 text-muted-foreground font-medium hidden md:table-cell">Signal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceData.map((item) => (
                      <tr key={item.commodity} className="border-b border-border/50">
                        <td className="py-2.5 px-3 font-medium text-foreground">{item.commodity}</td>
                        <td className="py-2.5 px-3 font-semibold text-foreground">{item.current}</td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-flex items-center gap-1 text-sm font-medium ${item.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                            {item.trend === "up" ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                            {item.change}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground text-xs hidden md:table-cell max-w-[300px]">{item.signal}</td>
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
