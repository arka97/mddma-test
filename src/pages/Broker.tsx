import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useRole } from "@/contexts/RoleContext";
import { Lock, Inbox } from "lucide-react";
import { Link } from "react-router-dom";

const Broker = () => {
  const { canAccess } = useRole();
  const hasAccess = canAccess("broker_marketplace");

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

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center border border-dashed border-border rounded-lg p-10">
            <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Broker Board Coming Soon</h2>
            <p className="text-muted-foreground text-sm">
              Verified brokers will post supply offers and buyer requirements here. Check back soon, or browse the directory to find brokers directly.
            </p>
            <Button variant="outline" className="mt-6" asChild>
              <Link to="/directory?type=Broker">Browse Brokers in Directory</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Broker;
