import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleProducts, sampleMembers } from "@/data/sampleData";
import { productListings } from "@/data/productListings";
import { communityPosts } from "@/data/productListings";
import { ArrowLeft, ShieldCheck, ExternalLink, Package, MapPin, Send, MessageSquare, Users, Flame, AlertTriangle } from "lucide-react";
import { StockBadge, TrendBadge, DemandIndicator, MarketSignals } from "@/components/MarketSignals";
import { RFQModal } from "@/components/RFQModal";
import { RecencyCue, LiveViewersCue, PriceAnchorCue, ScarcityCue, InquiryProofCue, ReciprocityChip } from "@/components/behavioral/BehavioralCues";
import { CommodityImage } from "@/components/commodity/CommodityImage";
import { GuardedPrice } from "@/components/commodity/GuardedPrice";

const ProductPage = () => {
  const { slug } = useParams();
  const [rfqProduct, setRfqProduct] = useState<string | null>(null);
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
  const relatedListings = productListings.filter((pl) => pl.commodityId === product.id);
  const productName = product.name.split("(")[0].trim().toLowerCase();
  const relatedDiscussions = communityPosts.filter((p) =>
    p.title.toLowerCase().includes(productName) || p.title.toLowerCase().includes(product.slug)
  );

  const totalInquiries = relatedListings.reduce((sum, l) => sum + l.inquiryCount, 0);

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
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge className="bg-accent/20 text-accent border-accent/30">{product.category}</Badge>
                {totalInquiries > 10 && (
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                    <Flame className="h-3 w-3 mr-0.5" /> {totalInquiries} inquiries
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
            <div className="lg:col-span-2 space-y-6">
              {/* Overview */}
              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Product Overview</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </CardContent>
              </Card>

              {/* V2: Market Listings with controlled pricing */}
              {relatedListings.length > 0 && (
                <Card className="bg-card border-border">
                  <CardHeader><CardTitle>Market Listings</CardTitle></CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-left">
                            <th className="py-2 px-2 text-muted-foreground font-medium">Variant</th>
                            <th className="py-2 px-2 text-muted-foreground font-medium">Stock</th>
                            <th className="py-2 px-2 text-muted-foreground font-medium">Price Range</th>
                            <th className="py-2 px-2 text-muted-foreground font-medium">Trend</th>
                            <th className="py-2 px-2 text-muted-foreground font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {relatedListings.map((listing) => {
                            const seller = sampleMembers.find((m) => m.id === listing.sellerId);
                            return (
                              <tr key={listing.id} className="border-b border-border/50">
                                <td className="py-2.5 px-2">
                                  <span className="font-medium text-foreground">{listing.variant}</span>
                                  <br />
                                  <span className="text-xs text-muted-foreground">{listing.origin}</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <InquiryProofCue count={listing.inquiryCount} />
                                    <LiveViewersCue id={listing.id} base={listing.inquiryCount} />
                                  </div>
                                  <div className="mt-0.5"><RecencyCue dateStr={listing.listingDate} /></div>
                                </td>
                                <td className="py-2.5 px-2">
                                  <StockBadge band={listing.stockBand} />
                                  <div className="mt-0.5"><ScarcityCue listing={listing} /></div>
                                </td>
                                <td className="py-2.5 px-2">
                                  <GuardedPrice listing={listing} />
                                  <div className="mt-0.5"><PriceAnchorCue listing={listing} /></div>
                                </td>
                                <td className="py-2.5 px-2">
                                  <TrendBadge direction={listing.trendDirection} />
                                </td>
                                <td className="py-2.5 px-2">
                                  <Button
                                    size="sm"
                                    className="bg-accent hover:bg-accent/90 text-primary font-semibold text-xs"
                                    onClick={() => setRfqProduct(`${listing.commodity} — ${listing.variant}`)}
                                  >
                                    <Send className="h-3 w-3 mr-1" /> Request Price
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

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
                      <Link key={seller.id} to={`/store/${seller.slug}`} className="block">
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
                          <Button variant="outline" size="sm">View Store</Button>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Related Discussions */}
              {relatedDiscussions.length > 0 && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-accent" /> Discussions About This Product
                      </CardTitle>
                      <Link to="/community" className="text-sm text-accent hover:underline">View All →</Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {relatedDiscussions.map((post) => (
                        <Link key={post.id} to="/community" className="block p-3 rounded-lg border border-border hover:border-accent/50 transition-colors">
                          <h4 className="text-sm font-medium text-foreground">{post.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{post.author} · {post.replies} replies · {post.views} views</p>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* V2: Request Best Price CTA — Von Restorff */}
              <Card className="bg-accent/10 border-accent/30 ring-2 ring-accent/20">
                <CardContent className="p-5 text-center">
                  <h3 className="font-bold text-foreground mb-1 text-lg">Request Best Price</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get competitive quotes from {sellers.length} verified sellers
                  </p>
                  {totalInquiries > 10 && (
                    <p className="text-xs text-orange-600 mb-2 font-medium">
                      <Flame className="h-3 w-3 inline" /> {totalInquiries} buyers inquired this week
                    </p>
                  )}
                  <Button
                    className="w-full bg-accent hover:bg-accent/90 text-primary font-bold text-base h-12"
                    onClick={() => setRfqProduct(product.name)}
                  >
                    <Send className="mr-2 h-5 w-5" /> Request Best Price
                  </Button>
                  <div className="mt-2 flex justify-center"><ReciprocityChip /></div>
                </CardContent>
              </Card>

              {/* List Your Products CTA */}
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
            </div>
          </div>
        </div>
      </section>

      {/* Sticky CTA mobile — Fitts's Law */}
      <div className="fixed bottom-0 left-0 right-0 bg-primary/95 backdrop-blur border-t border-accent/30 p-3 z-40 lg:hidden">
        <Button
          className="w-full bg-accent hover:bg-accent/90 text-primary font-bold text-sm h-11"
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
