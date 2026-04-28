import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { CommodityImage } from "@/components/commodity/CommodityImage";

const featuredCategories = [
  { name: "Almonds", slug: "almonds", count: 5 },
  { name: "Cashews", slug: "cashews", count: 5 },
  { name: "Dates", slug: "dates", count: 3 },
  { name: "Raisins", slug: "raisins", count: 3 },
  { name: "Pistachios", slug: "pistachios", count: 3 },
  { name: "Walnuts", slug: "walnuts", count: 2 },
  { name: "Pumpkin Seeds", slug: "pumpkin-seeds", count: 5 },
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
            Discover products and find verified sellers across Mumbai&apos;s top traded categories
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {featuredCategories.map((cat) => (
            <Link key={cat.name} to={`/products/${cat.slug}`}>
              <Card className="bg-card border-border hover:border-accent/60 card-hover h-full overflow-hidden">
                <CommodityImage commodity={cat.name} aspect="1/1" rounded={false} />
                <div className="p-3 text-center">
                  <h3 className="font-semibold text-foreground text-sm">{cat.name}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {cat.count} sellers
                  </p>
                </div>
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
