import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


import { useRole } from "@/contexts/RoleContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { liveCompanyToEntry, type DirectoryEntry, type LiveCompanyRow } from "@/lib/directoryAdapter";
import {
  MapPin, Phone, Mail, MessageCircle, ShieldCheck, Star,
  ArrowLeft, Globe, Calendar, Package, Send, Pencil, Eye, Loader2,
} from "lucide-react";
import { StockBadge } from "@/components/MarketSignals";
import { RFQModal } from "@/components/RFQModal";
import { GuardedPrice, GuardedPublicPriceLine } from "@/components/commodity/GuardedPrice";
import { TradeSignalsCard } from "@/components/commodity/SellerScoreboard";
import { useSellerTradeSignals } from "@/lib/tradeSignals";
import { useCart } from "@/contexts/CartContext";

interface LiveProduct {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  origin: string | null;
  image_url: string | null;
  price_min: number | null;
  price_max: number | null;
  unit: string | null;
  stock_band: string | null;
  description: string | null;
}

const Storefront = () => {
  const { slug } = useParams();
  const { canAccess } = useRole();
  const { company: ownCompany, hasRole } = useAuth();
  const { addItem } = useCart();
  const [rfqProduct, setRfqProduct] = useState<{ name: string; productId?: string; companyId?: string } | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [liveMember, setLiveMember] = useState<DirectoryEntry | null>(null);
  const [liveCompanyId, setLiveCompanyId] = useState<string | null>(null);
  const [liveProducts, setLiveProducts] = useState<LiveProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let alive = true;
    setLoading(true);
    supabase
      .from("companies")
      .select("id,owner_id,slug,name,tagline,description,logo_url,city,state,address,email,phone,website,gstin,established_year,categories,certifications,is_verified,is_hidden,membership_tier")
      .eq("slug", slug)
      .maybeSingle()
      .then(async ({ data }) => {
        if (!alive) return;
        if (data) {
          setLiveMember(liveCompanyToEntry(data as unknown as LiveCompanyRow));
          setLiveCompanyId(data.id);
          const { data: prods } = await supabase
            .from("products")
            .select("id,name,slug,category,origin,image_url,price_min,price_max,unit,stock_band,description")
            .eq("company_id", data.id)
            .eq("is_hidden", false)
            .order("is_featured", { ascending: false });
          if (alive) setLiveProducts((prods ?? []) as LiveProduct[]);
        }
        if (alive) setLoading(false);
      });
    return () => { alive = false; };
  }, [slug]);

  const member = liveMember;
  const isOwner = !!ownCompany && ownCompany.slug === slug;
  const canManage = isOwner || hasRole("admin");

  // Phase C — live trade signals + KYC checklist. Hooks no-op when ids are null
  // (demo storefronts), so the scoreboard tile renders the placeholder instead.
  const { signals, loading: signalsLoading } = useSellerTradeSignals(liveCompanyId);
  const { checklist: kyc } = useSellerKyc(liveOwnerId);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-accent" />
        </div>
      </Layout>
    );
  }

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

  const sellerListings: import("@/data/productListings").ProductListing[] = [];
  const yearsInBusiness = new Date().getFullYear() - member.memberSince;

  return (
    <Layout>
      {/* Owner / Admin toolbar */}
      {canManage && !previewMode && (
        <div className="bg-accent/10 border-b border-accent/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              <span className="font-medium text-foreground">
                {isOwner ? "You're viewing your own storefront" : "Admin moderation view"}
              </span>
              <span className="text-muted-foreground">— prices are gated to signed-in members.</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setPreviewMode(true)}>
                <Eye className="h-3 w-3 mr-1" /> View as buyer
              </Button>
              <Button size="sm" asChild>
                <Link to="/account/company"><Pencil className="h-3 w-3 mr-1" /> Edit company</Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link to="/account/products"><Package className="h-3 w-3 mr-1" /> Edit catalog</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
      {previewMode && canManage && (
        <div className="bg-muted border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Buyer preview mode</span>
            <Button size="sm" variant="ghost" className="h-7" onClick={() => setPreviewMode(false)}>Exit preview</Button>
          </div>
        </div>
      )}

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

      {/* Phase C: scoreboard + KYC checklist tile */}
      <section className="py-6 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SellerScoreboard signals={signals} kyc={kyc} loading={signalsLoading} />
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

              {/* V2: Product Catalog with controlled pricing */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-accent" /> Product Catalog
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {liveMember && liveProducts.length > 0 ? (
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
                          {liveProducts.map((p) => (
                            <tr key={p.id} className="border-b border-border/50">
                              <td className="py-2.5 px-2">
                                <div className="font-medium text-foreground">{p.name}</div>
                                <div className="text-xs text-muted-foreground">{p.category ?? "—"}{p.origin ? ` · ${p.origin}` : ""}</div>
                              </td>
                              <td className="py-2.5 px-2">
                                <Badge variant="outline" className="text-xs capitalize">{p.stock_band ?? "medium"}</Badge>
                              </td>
                              <td className="py-2.5 px-2 text-xs">
                                <GuardedPublicPriceLine listing={{
                                  id: p.id,
                                  sellerId: liveCompanyId ?? "",
                                  commodityId: p.id,
                                  commodity: p.name,
                                  variant: "",
                                  origin: p.origin ?? "",
                                  packaging: "",
                                  moq: "",
                                  priceMin: p.price_min,
                                  priceMax: p.price_max,
                                  marketAvgPrice: null,
                                  priceUnit: `₹/${p.unit ?? "kg"}`,
                                  stockBand: (p.stock_band as "high" | "medium" | "low" | "on_order" | null) ?? "medium",
                                  trendDirection: "stable",
                                  demandScore: "medium",
                                  inquiryCount: 0,
                                  location: "",
                                  listingDate: new Date().toISOString(),
                                  hidePrice: false,
                                  isFastMoving: false,
                                }} />
                              </td>
                              <td className="py-2.5 px-2">
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    className="bg-accent hover:bg-accent/90 text-primary font-semibold text-xs"
                                    onClick={() => setRfqProduct({ name: p.name, productId: p.id, companyId: liveCompanyId ?? undefined })}
                                  >
                                    <Send className="h-3 w-3 mr-1" /> Request Price
                                  </Button>
                                  {liveCompanyId && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs"
                                      onClick={() => addItem({
                                        productId: p.id,
                                        productName: p.name,
                                        companyId: liveCompanyId,
                                        companyName: member.firmName,
                                        companySlug: slug,
                                        imageUrl: p.image_url,
                                        quantity: "",
                                      })}
                                    >
                                      + Cart
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : sellerListings.length > 0 ? (
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
                              <td className="py-2.5 px-2"><StockBadge band={listing.stockBand} /></td>
                              <td className="py-2.5 px-2"><GuardedPrice listing={listing} /></td>
                              <td className="py-2.5 px-2">
                                <Button
                                  size="sm"
                                  className="bg-accent hover:bg-accent/90 text-primary font-semibold text-xs"
                                  onClick={() => setRfqProduct({ name: `${listing.commodity} — ${listing.variant}` })}
                                >
                                  <Send className="h-3 w-3 mr-1" /> Request Price
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-6">No active listings yet.</p>
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

      {rfqProduct && (
        <RFQModal
          productName={rfqProduct.name}
          productId={rfqProduct.productId}
          companyId={rfqProduct.companyId}
          onClose={() => setRfqProduct(null)}
        />
      )}
    </Layout>
  );
};

export default Storefront;
