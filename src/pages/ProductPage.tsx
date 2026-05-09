import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, Send, Loader2 } from "lucide-react";

import { RFQModal } from "@/components/RFQModal";
import { CommodityImage } from "@/components/commodity/CommodityImage";
import { ProductMediaCarousel } from "@/components/commodity/ProductMediaCarousel";
import { useProductBySlug } from "@/hooks/queries/useProducts";

const ProductPage = () => {
  const { slug } = useParams();
  const [rfqProduct, setRfqProduct] = useState<string | null>(null);
  const { data: product, isLoading } = useProductBySlug(slug);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-accent" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Product Not Found</h1>
          <Link to="/products" className="text-accent hover:underline">Back to Products</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/products" className="inline-flex items-center text-primary-foreground/70 hover:text-primary-foreground text-sm mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Products
          </Link>
          <div className="flex items-center gap-4">
            <CommodityImage commodity={product.name} aspect="1/1" className="w-20 sm:w-24 flex-shrink-0" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground">{product.name}</h1>
              {product.category && (
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge className="bg-accent/20 text-accent border-accent/30">{product.category}</Badge>
                  {product.origin && (
                    <Badge variant="outline" className="bg-background/10 text-primary-foreground border-primary-foreground/20">
                      {product.origin}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card border-border overflow-hidden">
                <ProductMediaCarousel
                  commodity={product.name}
                  images={[product.image_url, ...(product.gallery ?? [])]}
                  videoUrl={product.video_url}
                  aspect="16/10"
                  rounded={false}
                  videoControls
                />
              </Card>

              {product.description && (
                <Card className="bg-card border-border">
                  <CardHeader><CardTitle>Product Overview</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
                <CardContent>
                  <span className="text-sm text-muted-foreground">
                    {product.price_min && product.price_max
                      ? `Indicative: ₹${product.price_min}–${product.price_max}/${product.unit ?? "kg"}`
                      : "Price on request"}
                  </span>
                </CardContent>
              </Card>

              {(product.packaging_options?.length ?? 0) > 0 && (
                <Card className="bg-card border-border">
                  <CardHeader><CardTitle>Packaging Formats</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {product.packaging_options!.map((p) => (
                        <Badge key={p} variant="outline" className="text-sm px-3 py-1">
                          <Package className="h-3 w-3 mr-1" /> {p}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="bg-accent/10 border-accent/30 ring-2 ring-accent/20">
                <CardContent className="p-5 text-center">
                  <h3 className="font-bold text-foreground mb-1 text-lg">Request Best Price</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get a competitive quote from the verified seller
                  </p>
                  <Button
                    className="w-full text-accent-foreground font-bold text-base h-12"
                    onClick={() => setRfqProduct(product.name)}
                  >
                    <Send className="mr-2 h-5 w-5" /> Request Best Price
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-5 text-center">
                  <h3 className="font-semibold text-foreground mb-2">List Your Products</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Are you a trader of {product.name}? Join MDDMA.
                  </p>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/apply">Become a Member</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 bg-primary/95 backdrop-blur border-t border-accent/30 p-3 z-40 lg:hidden">
        <Button
          className="w-full text-accent-foreground font-bold text-sm h-11"
          onClick={() => setRfqProduct(product.name)}
        >
          <Send className="h-4 w-4 mr-1.5" /> Request Quote — {product.name}
        </Button>
      </div>

      {rfqProduct && <RFQModal productName={rfqProduct} onClose={() => setRfqProduct(null)} />}
    </Layout>
  );
};

export default ProductPage;
