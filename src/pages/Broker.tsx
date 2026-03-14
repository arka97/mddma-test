import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { brokerListings } from "@/data/productListings";
import { useRole } from "@/contexts/RoleContext";
import { MessageCircle, MapPin, Package, Calendar, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Broker = () => {
  const { canAccess } = useRole();
  const hasAccess = canAccess("broker_marketplace");

  const supplyListings = brokerListings.filter((l) => l.type === "supply");
  const demandListings = brokerListings.filter((l) => l.type === "demand");

  if (!hasAccess) {
    return (
      <Layout>
        <section className="bg-primary py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">Broker Marketplace</h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">Connect supply with demand through verified brokers</p>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4 text-center max-w-md">
            <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Broker Access Required</h2>
            <p className="text-muted-foreground mb-6">The Broker Marketplace is available to Broker and Admin roles. Switch your role using the simulator in the header.</p>
            <Button className="bg-accent hover:bg-accent/90 text-primary" asChild>
              <Link to="/membership">View Membership Plans</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const renderListing = (listing: typeof brokerListings[0]) => (
    <Card key={listing.id} className="bg-card border-border hover:border-accent/50 card-hover">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground">{listing.commodity}</h3>
            <p className="text-sm text-muted-foreground">{listing.variant}</p>
          </div>
          <Badge variant={listing.type === "supply" ? "secondary" : "outline"} className="text-xs">
            {listing.type === "supply" ? "Supply" : "Demand"}
          </Badge>
        </div>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Package className="h-3.5 w-3.5" /> Qty: {listing.quantity}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {listing.location}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" /> {new Date(listing.postedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{listing.brokerName}</span> · {listing.brokerCompany}
          </div>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" asChild>
            <a href={`https://wa.me/${listing.contactWhatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi, I'm interested in your ${listing.type === "supply" ? "supply of" : "requirement for"} ${listing.commodity} (${listing.variant}). Qty: ${listing.quantity}`)}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-3.5 w-3.5 mr-1" /> Contact
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">Broker Marketplace</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Live supply offers and buyer requirements from verified MDDMA brokers
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="supply">
            <TabsList className="mb-6">
              <TabsTrigger value="supply">Supply Offers ({supplyListings.length})</TabsTrigger>
              <TabsTrigger value="demand">Buyer Requirements ({demandListings.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="supply">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {supplyListings.map(renderListing)}
              </div>
            </TabsContent>
            <TabsContent value="demand">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {demandListings.map(renderListing)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Broker;
