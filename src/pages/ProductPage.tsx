import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sampleProducts, sampleMembers } from "@/data/sampleData";
import { productListings } from "@/data/productListings";
import { communityPosts } from "@/data/productListings";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ShieldCheck, ExternalLink, Package, MapPin, Send, MessageSquare } from "lucide-react";

const ProductPage = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [showInquiryForm, setShowInquiryForm] = useState(false);
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
  // Find community discussions mentioning this product
  const productName = product.name.split("(")[0].trim().toLowerCase();
  const relatedDiscussions = communityPosts.filter((p) =>
    p.title.toLowerCase().includes(productName) ||
    p.title.toLowerCase().includes(product.slug)
  );

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Inquiry Submitted!", description: `Your inquiry for ${product.name} has been sent to the seller.` });
    setShowInquiryForm(false);
  };

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

              {/* Recent Listings with prices */}
              {relatedListings.length > 0 && (
                <Card className="bg-card border-border">
                  <CardHeader><CardTitle>Current Market Listings</CardTitle></CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-left">
                            <th className="py-2 px-2 text-muted-foreground font-medium">Variant</th>
                            <th className="py-2 px-2 text-muted-foreground font-medium">Origin</th>
                            <th className="py-2 px-2 text-muted-foreground font-medium">Price</th>
                            <th className="py-2 px-2 text-muted-foreground font-medium">Seller</th>
                            <th className="py-2 px-2 text-muted-foreground font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {relatedListings.map((listing) => {
                            const seller = sampleMembers.find((m) => m.id === listing.sellerId);
                            return (
                              <tr key={listing.id} className="border-b border-border/50">
                                <td className="py-2.5 px-2 font-medium text-foreground">{listing.variant}</td>
                                <td className="py-2.5 px-2 text-muted-foreground">{listing.origin}</td>
                                <td className="py-2.5 px-2">
                                  {listing.hidePrice || listing.price === null ? (
                                    <Badge variant="secondary" className="text-xs">RFQ</Badge>
                                  ) : (
                                    <span className="font-semibold text-accent">{listing.price.toLocaleString()} {listing.priceUnit}</span>
                                  )}
                                </td>
                                <td className="py-2.5 px-2">
                                  {seller && (
                                    <Link to={`/store/${seller.slug}`} className="text-accent hover:underline text-xs">
                                      {seller.firmName}
                                    </Link>
                                  )}
                                </td>
                                <td className="py-2.5 px-2">
                                  <Button size="sm" variant="outline" onClick={() => setShowInquiryForm(true)}>
                                    <Send className="h-3 w-3 mr-1" /> Inquire
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
              {/* Send Inquiry CTA */}
              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="p-5 text-center">
                  <h3 className="font-semibold text-foreground mb-2">Send Inquiry</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Interested in {product.name}? Send an inquiry to verified sellers.
                  </p>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-primary" onClick={() => setShowInquiryForm(true)}>
                    <Send className="mr-2 h-4 w-4" /> Send Inquiry
                  </Button>
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

      {/* Inquiry Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md bg-card">
            <CardHeader>
              <CardTitle>Send Inquiry — {product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInquiry} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inq-name">Full Name</Label>
                  <Input id="inq-name" required placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inq-email">Email</Label>
                  <Input id="inq-email" type="email" required placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inq-qty">Quantity Required</Label>
                  <Input id="inq-qty" required placeholder="e.g., 500 kg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inq-msg">Message</Label>
                  <Textarea id="inq-msg" placeholder="Describe your requirements..." rows={3} />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90 text-primary">Submit Inquiry</Button>
                  <Button type="button" variant="outline" onClick={() => setShowInquiryForm(false)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default ProductPage;
