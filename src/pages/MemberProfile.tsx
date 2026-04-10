import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleMembers, sampleProducts } from "@/data/sampleData";
import { productListings } from "@/data/productListings";
import { StockBadge, PriceRange } from "@/components/MarketSignals";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin, Phone, Mail, MessageCircle, ShieldCheck, Star,
  ArrowLeft, Globe, Package, Send, ExternalLink,
} from "lucide-react";

const MemberProfile = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const member = sampleMembers.find((m) => m.slug === slug);

  if (!member) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Member Not Found</h1>
          <Link to="/directory" className="text-accent hover:underline">Back to Directory</Link>
        </div>
      </Layout>
    );
  }

  const sellerListings = productListings.filter((pl) => pl.sellerId === member.id);
  const memberProducts = sampleProducts.filter((p) => p.sellerMemberIds.includes(member.id));
  const yearsInBusiness = new Date().getFullYear() - member.memberSince;

  const handleInquiry = (listing: typeof sellerListings[0]) => {
    const msg = `Hi, I'm interested in ${listing.commodity} (${listing.variant}) from ${listing.origin}. Quantity: ${listing.moq}. Please share details.`;
    window.open(`https://wa.me/${member.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
    toast({ title: "Inquiry Sent", description: `WhatsApp opened for ${listing.commodity}` });
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/directory" className="inline-flex items-center text-primary-foreground/70 hover:text-primary-foreground text-sm mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Directory
          </Link>
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-xl bg-accent flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
              {member.logoPlaceholder}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground">{member.firmName}</h1>
                {member.isSponsored && (
                  <Badge className="bg-accent/20 text-accent border-accent/30"><Star className="h-3 w-3 mr-1" /> Featured</Badge>
                )}
              </div>
              <p className="text-primary-foreground/70 mt-1">{member.ownerName} · {member.memberType}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {member.verificationStatus === "Verified" && (
                  <Badge className="bg-green-500/20 text-green-200 border-green-500/30">
                    <ShieldCheck className="h-3 w-3 mr-1" /> {member.verificationLevel} Verified
                  </Badge>
                )}
                <Badge variant="outline" className="text-primary-foreground/80 border-primary-foreground/30">
                  {yearsInBusiness}+ Years in Business
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card className="bg-card border-border">
                <CardHeader><CardTitle>About</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>

              {/* Product Listings / Catalog */}
              {sellerListings.length > 0 && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-accent" /> Products for Sale
                      </CardTitle>
                      <Link to={`/store/${member.slug}`} className="text-sm text-accent hover:underline flex items-center gap-1">
                        View Storefront <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-left">
                            <th className="py-2 px-2 text-muted-foreground font-medium">Product</th>
                            <th className="py-2 px-2 text-muted-foreground font-medium">Stock</th>
                            <th className="py-2 px-2 text-muted-foreground font-medium">Price Range</th>
                            <th className="py-2 px-2 text-muted-foreground font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sellerListings.map((listing) => (
                            <tr key={listing.id} className="border-b border-border/50">
                              <td className="py-2.5 px-2">
                                <div className="font-medium text-foreground">{listing.commodity}</div>
                                <div className="text-xs text-muted-foreground">{listing.variant} · {listing.origin}</div>
                              </td>
                              <td className="py-2.5 px-2">
                                <StockBadge band={listing.stockBand} />
                              </td>
                              <td className="py-2.5 px-2">
                                <PriceRange listing={listing} />
                              </td>
                              <td className="py-2.5 px-2">
                                <Button size="sm" variant="outline" onClick={() => handleInquiry(listing)}>
                                  <Send className="h-3 w-3 mr-1" /> Request Price
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Products Dealt */}
              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Products Dealt</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {member.commodities.map((c) => (
                      <Badge key={c} variant="secondary" className="text-sm px-3 py-1">{c}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Origin Specialization */}
              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Origin Specialization</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {member.originSpecialization.map((o) => (
                      <Badge key={o} variant="outline" className="text-sm px-3 py-1">
                        <Globe className="h-3 w-3 mr-1" /> {o}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Certifications</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">GST Number</span>
                      <span className="font-mono text-foreground">{member.gstNumber}</span>
                    </div>
                    {member.fssaiNumber && (
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">FSSAI License</span>
                        <span className="font-mono text-foreground">{member.fssaiNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground">Member Since</span>
                      <span className="text-foreground">{member.memberSince}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact */}
              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white" asChild>
                    <a href={`https://wa.me/${member.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                    </a>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <a href={`tel:${member.phone}`}><Phone className="mr-2 h-4 w-4" /> Call</a>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <a href={`mailto:${member.email}`}><Mail className="mr-2 h-4 w-4" /> Email</a>
                  </Button>
                </CardContent>
              </Card>

              {/* Address */}
              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Address</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" />
                    <span>{member.fullAddress}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Gallery Placeholder */}
              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Gallery</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-square rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs">
                        Photo {i}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MemberProfile;
