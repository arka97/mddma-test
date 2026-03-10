import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleProducts, sampleMembers } from "@/data/sampleData";
import { ArrowLeft, ShieldCheck, ExternalLink, Package, MapPin } from "lucide-react";

const ProductPage = () => {
  const { slug } = useParams();
  const product = sampleProducts.find((p) => p.slug === slug);

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

  const sellers = sampleMembers.filter((m) => product.sellerMemberIds.includes(m.id));

  return (
    <Layout>
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/products" className="inline-flex items-center text-primary-foreground/70 hover:text-primary-foreground text-sm mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Products
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{product.image}</div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground">{product.name}</h1>
              <Badge className="mt-1 bg-accent/20 text-accent border-accent/30">{product.category}</Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Overview */}
              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Product Overview</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </CardContent>
              </Card>

              {/* Variants */}
              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Common Variants</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <Badge key={v} variant="secondary" className="text-sm px-3 py-1">{v}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Packaging */}
              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Packaging Formats</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {product.packagingFormats.map((p) => (
                      <Badge key={p} variant="outline" className="text-sm px-3 py-1">
                        <Package className="h-3 w-3 mr-1" /> {p}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Verified Sellers */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Verified Member Sellers</CardTitle>
                    <Link to="/apply" className="text-sm text-accent hover:underline">Become a listed seller →</Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sellers.map((seller) => (
                      <Link key={seller.id} to={`/directory/${seller.slug}`} className="block">
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent/50 transition-colors">
                          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs flex-shrink-0">
                            {seller.logoPlaceholder}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-foreground text-sm truncate">{seller.firmName}</span>
                              {seller.verificationStatus === "Verified" && (
                                <ShieldCheck className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" /> {seller.area} · {seller.memberType}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Contact</Button>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* CTA */}
              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="p-5 text-center">
                  <h3 className="font-semibold text-foreground mb-2">List Your Products</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Are you a trader or importer of {product.name}? Join MDDMA and get listed.
                  </p>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-primary" asChild>
                    <Link to="/apply">Become a Member</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Affiliate Links */}
              {product.affiliateLinks.length > 0 && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Retail Purchase Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3 italic">
                      Affiliate links — MDDMA may earn a commission.
                    </p>
                    <div className="space-y-2">
                      {product.affiliateLinks.map((link) => (
                        <a
                          key={link.name}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 rounded border border-border hover:border-accent/50 transition-colors"
                        >
                          <span className="text-sm font-medium text-foreground">{link.name}</span>
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Community Discussions */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Discussions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Join conversations about {product.name} on the MDDMA community forum.
                  </p>
                  <div className="space-y-2">
                    {["Market Intelligence", "Trade Discussions"].map((cat) => (
                      <a
                        key={cat}
                        href={`https://community.mddma.com/c/${cat.toLowerCase().replace(/ /g, "-")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 rounded border border-border hover:border-accent/40 transition-colors"
                      >
                        <span className="text-sm font-medium text-foreground">{cat}</span>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 italic">
                    ❌ No trade offers — discussion & intelligence only.
                  </p>
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
