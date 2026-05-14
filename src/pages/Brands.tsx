import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { useBrands } from "@/hooks/queries/useBrands";
import { BrandCard } from "@/components/brands/BrandCard";
import { ListingsGridSkeleton } from "@/components/ui/skeletons";
import { Sparkles } from "lucide-react";

const Brands = () => {
  const { data: brands = [], isLoading } = useBrands();

  return (
    <Layout>
      <PageHeader
        title="House Brands"
        subtitle="Discover consumer brands built by MDDMA member companies. Bulk B2B inquiries via the seller's storefront; retail purchases at the brand's own shop."
      />

      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <ListingsGridSkeleton count={9} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
          ) : brands.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-lg">
              <Sparkles className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No brands listed yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {brands.map((b) => <BrandCard key={b.id} brand={b} />)}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Brands;
