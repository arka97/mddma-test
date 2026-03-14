import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleMembers } from "@/data/sampleData";
import { productListings } from "@/data/productListings";
import { useRole } from "@/contexts/RoleContext";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin, Phone, Mail, MessageCircle, ShieldCheck, Star,
  ArrowLeft, Globe, Calendar, Package, Send,
} from "lucide-react";

const Storefront = () => {
  const { slug } = useParams();
  const { canAccess } = useRole();
  const { toast } = useToast();
  const member = sampleMembers.find((m) => m.slug === slug);

  if (!member) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Storefront Not Found</h1>
          <Link to="/directory" className="text-accent hover:underline">Back to Directory</Link>
        </div>
      </Layout>
    );
  }

  const sellerListings = productListings.filter((pl) => pl.sellerId === member.id);
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
                  <Calendar className="h-3 w-3 mr-1" /> {yearsInBusiness}+ Years
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card className="bg-card border-border">
                <CardHeader><CardTitle>About the Company</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{member.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">{yearsInBusiness}+</div>
                      <div className="text-xs text-muted-foreground">Years in Business</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">{member.commodities.length}</div>
                      <div className="text-xs text-muted-foreground">Products</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">{member.originSpecialization.length}</div>
                      <div className="text-xs text-muted-foreground">Source Countries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">{sellerListings.length}</div>
                      <div className="text-xs text-muted-foreground">Active Listings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Certifications & Markets</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border text-sm">
                      <span className="text-muted-foreground">GST Number</span>
                      <span className="font-mono text-foreground">{member.gstNumber}</span>
                    </div>
                    {member.fssaiNumber && (
                      <div className="flex items-center justify-between py-2 border-b border-border text-sm">
                        <span className="text-muted-foreground">FSSAI License</span>
                        <span className="font-mono text-foreground">{member.fssaiNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-2 text-sm">
                      <span className="text-muted-foreground">Markets Served</span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {member.originSpecialization.map((o) => (
                          <Badge key={o} variant="outline" className="text-xs"><Globe className="h-3 w-3 mr-0.5" />{o}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Catalog */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-accent" /> Product Catalog
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sellerListings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-left">
                            <th className="py-2 px-2 text-muted-foreground font-medium">Product</th>
                            <th className="py-2 px-2 text-muted-foreground font-medium">Origin</th>
                            <th className="py-2 px-2 text-muted-foreground font-medium">MOQ</th>
                            <th className="py-2 px-2 text-muted-foreground font-medium">Price</th>
                            <th className="py-2 px-2 text-muted-foreground font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sellerListings.map((listing) => (
                            <tr key={listing.id} className="border-b border-border/50">
                              <td className="py-2.5 px-2">
                                <div className="font-medium text-foreground">{listing.commodity}</div>
                                <div className="text-xs text-muted-foreground">{listing.variant}</div>
                              </td>
                              <td className="py-2.5 px-2 text-muted-foreground">{listing.origin}</td>
                              <td className="py-2.5 px-2 text-muted-foreground">{listing.moq}</td>
                              <td className="py-2.5 px-2">
                                {listing.hidePrice || listing.price === null ? (
                                  <Badge variant="secondary" className="text-xs">RFQ</Badge>
                                ) : (
                                  <span className="font-semibold text-accent">
                                    {listing.price.toLocaleString()} {listing.priceUnit}
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-2">
                                <Button size="sm" variant="outline" onClick={() => handleInquiry(listing)}>
                                  <Send className="h-3 w-3 mr-1" /> Inquire
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-6">No active listings. Contact this seller directly.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
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

              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Location</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" />
                    <span>{member.fullAddress}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Specializations</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {member.commodities.map((c) => (
                      <Badge key={c} variant="secondary" className="text-sm">{c}</Badge>
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

export default Storefront;
