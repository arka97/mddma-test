import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  FileSearch,
  Loader2,
  Package,
  ShieldCheck,
  Store,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommodityImage } from "@/components/commodity/CommodityImage";
import { ProductMediaCarousel } from "@/components/commodity/ProductMediaCarousel";
import { useCompanyById } from "@/hooks/queries/useCompanies";
import { useProductBySlug } from "@/hooks/queries/useProducts";

const ProductPage = () => {
  const { slug } = useParams();
  const { data: product, isLoading, isError } = useProductBySlug(slug);
  const sellerQuery = useCompanyById(product?.company_id);
  const seller = sellerQuery.data;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
        </div>
      </Layout>
    );
  }

  if (isError || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="mb-4 text-2xl font-bold text-primary">Product not found</h1>
          <Link to="/products" className="text-accent hover:underline">Back to products</Link>
        </div>
      </Layout>
    );
  }

  const description =
    product.description ||
    `${product.name} listed by ${seller?.name ?? "a business"} on the G-BAU-G food-trade network.`;

  return (
    <Layout>
      <Seo
        title={`${product.name} — ${seller?.name ?? "Product Listing"} · G-BAU-G`}
        description={description.slice(0, 160)}
        path={`/products/${product.slug}`}
        ogType="product"
      />

      <section className="bg-primary py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/products" className="mb-4 inline-flex items-center text-sm text-primary-foreground/70 hover:text-primary-foreground">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to products
          </Link>
          <div className="flex items-center gap-4">
            <CommodityImage commodity={product.name} aspect="1/1" className="w-20 shrink-0 sm:w-24" />
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-primary-foreground sm:text-3xl">{product.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {product.category && (
                  <Badge className="border-accent/30 bg-accent/20 text-accent">{product.category}</Badge>
                )}
                {product.origin && (
                  <Badge variant="outline" className="border-primary-foreground/20 bg-background/10 text-primary-foreground">
                    {product.origin}
                  </Badge>
                )}
                {seller?.is_verified && (
                  <Badge variant="outline" className="border-primary-foreground/20 bg-background/10 text-primary-foreground">
                    <ShieldCheck className="mr-1 h-3 w-3" /> Verified business
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card className="overflow-hidden">
                <ProductMediaCarousel
                  commodity={product.name}
                  images={[product.image_url, ...(product.gallery ?? [])]}
                  videoUrl={product.video_url}
                  aspect="16/10"
                  rounded={false}
                  videoControls
                />
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-muted-foreground">{description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Indicative pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    {product.price_min !== null
                      ? `₹${product.price_min.toLocaleString()}${product.price_max !== null ? `–₹${product.price_max.toLocaleString()}` : ""}/${product.unit ?? "kg"}`
                      : "Price on request"}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Seller-provided catalogue ranges are indicative. Exact quantity, price, payment and delivery terms should be exchanged through a private quotation.
                  </p>
                </CardContent>
              </Card>

              {(product.packaging_options?.length ?? 0) > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Packaging formats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {product.packaging_options?.map((packaging) => (
                        <Badge key={packaging} variant="outline" className="px-3 py-1 text-sm">
                          <Package className="mr-1 h-3 w-3" /> {packaging}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="border-accent/30 bg-accent/10 ring-2 ring-accent/20">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Listed by</p>
                      <h2 className="mt-1 text-lg font-bold text-foreground">
                        {sellerQuery.isLoading ? "Loading business…" : seller?.name ?? "Business profile unavailable"}
                      </h2>
                      {seller?.tagline && <p className="mt-1 text-sm text-muted-foreground">{seller.tagline}</p>}
                    </div>
                  </div>
                  {seller && (
                    <Button className="mt-4 h-11 w-full font-semibold" asChild>
                      <Link to={`/store/${seller.slug}`}>
                        <Store className="mr-2 h-4 w-4" /> View business profile
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need this product?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Publish a buy requirement or browse current RFQs. Approved businesses can respond with private indicative or formal quotations.
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/rfq">
                      <FileSearch className="mr-2 h-4 w-4" /> Open RFQ network
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5 text-center">
                  <h3 className="mb-2 font-semibold text-foreground">List products for your business</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Register an existing food-trade business and complete verification to publish a catalogue.
                  </p>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/apply">Register business</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductPage;
