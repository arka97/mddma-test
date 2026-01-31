import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { commodityCategories } from "@/data/sampleData";

const Commodities = () => {
  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Commodities We Trade
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Our members deal in a wide variety of premium dry fruits and dates
              from around the world
            </p>
          </div>
        </div>
      </section>

      {/* Commodities Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {commodityCategories.map((category) => (
              <Card
                key={category.name}
                className="bg-card border-border hover:border-accent/50 card-hover text-center"
              >
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Commodities;
