import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const featuredCategories = [
  { name: "Almonds", icon: "🥜", slug: "almonds", count: 5 },
  { name: "Cashews", icon: "🥜", slug: "cashews", count: 5 },
  { name: "Dates", icon: "🌴", slug: "dates", count: 3 },
  { name: "Raisins", icon: "🍇", slug: "raisins", count: 3 },
  { name: "Pistachios", icon: "🥜", slug: "pistachios", count: 3 },
  { name: "Walnuts", icon: "🥜", slug: "walnuts", count: 2 },
  { name: "Seeds", icon: "🌱", slug: "pumpkin-seeds", count: 5 },
];

export function FeaturedCategoriesSection() {
  return (
    <section className="py-16 sm:py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
            Browse by Category
          </h2>
          <p className="text-muted-foreground">
            Discover products and find verified sellers across Mumbai's top traded categories
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {featuredCategories.map((cat) => (
            <Link key={cat.name} to={`/products/${cat.slug}`}>
              <Card className="bg-card border-border hover:border-accent/50 card-hover text-center h-full">
                <CardContent className="p-4 sm:p-6">
                  <div className="text-3xl sm:text-4xl mb-3">{cat.icon}</div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {cat.count} sellers
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/products" className="inline-flex items-center text-accent hover:text-accent/80 font-medium text-sm">
            View All 25 Products <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
