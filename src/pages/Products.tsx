import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Send, MapPin } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdBanner } from "@/components/home/AdBanner";
import { sampleProducts, productCategories, sampleMembers } from "@/data/sampleData";
import { productListings } from "@/data/productListings";
import { StockBadge, TrendBadge } from "@/components/MarketSignals";
import { RFQModal } from "@/components/RFQModal";
import { ScarcityCue } from "@/components/behavioral/BehavioralCues";
import { CommodityImage } from "@/components/commodity/CommodityImage";
import { GuardedPrice } from "@/components/commodity/GuardedPrice";
import { SellerSignals } from "@/components/commodity/SellerSignals";
import { AddToRfqButton } from "@/components/rfq/AddToRfqButton";

const origins = ["USA", "Iran", "Afghanistan", "India", "Vietnam", "Chile", "Turkey", "Saudi Arabia", "Jordan", "Australia", "Kashmir"];

const Products = () => {
  const [params] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(params.get("q") ?? "");
  const [categoryFilter, setCategoryFilter] = useState<string>(params.get("cat") ?? "all");
  const [originFilter, setOriginFilter] = useState<string>(params.get("origin") ?? "all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [view, setView] = useState<"catalog" | "marketplace">(
    params.get("view") === "marketplace" ? "marketplace" : "catalog",
  );
  const [rfqProduct, setRfqProduct] = useState<string | null>(null);

  const filteredProducts = sampleProducts.filter((p) => {
    const s = searchTerm.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s);
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const filteredListings = productListings.filter((pl) => {
    const s = searchTerm.toLowerCase();
    const matchSearch = pl.commodity.toLowerCase().includes(s) || pl.variant.toLowerCase().includes(s);
    const matchOrigin = originFilter === "all" || pl.origin === originFilter;
    const matchStock = stockFilter === "all" || pl.stockBand === stockFilter;
    return matchSearch && matchOrigin && matchStock;
  });

  return (
    <Layout>
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Verified Marketplace
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Browse commodities from KYC-verified MDDMA sellers. Send a quote request — no obligation.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdBanner placement="category-banner" />
      </div>

      {/* Filters */}
      <section className="py-6 bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={view} onValueChange={(v) => setView(v as typeof view)} className="mb-4">
            <TabsList>
              <TabsTrigger value="catalog">Product Catalog</TabsTrigger>
              <TabsTrigger value="marketplace">Live Listings</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search commodity, variant, origin..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            {view === "catalog" ? (
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {productCategories.map((c) => (
                    <SelectItem key={c.slug} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <>
                <Select value={originFilter} onValueChange={setOriginFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Origins" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Origins</SelectItem>
                    {origins.map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Stock Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stock Levels</SelectItem>
                    <SelectItem value="high">High Availability</SelectItem>
                    <SelectItem value="medium">Medium Stock</SelectItem>
                    <SelectItem value="low">Limited Stock</SelectItem>
                    <SelectItem value="on_order">On Order</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Showing {view === "catalog" ? filteredProducts.length : filteredListings.length} results
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 pb-24 lg:pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {view === "catalog" ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.slug}`} className="group">
                  <Card className="bg-card border-border hover:border-accent/50 card-hover h-full overflow-hidden">
                    <CommodityImage commodity={product.name} aspect="4/3" rounded={false} />
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground text-sm">{product.name}</h3>
                      <Badge variant="secondary" className="text-[10px] mt-1">{product.category}</Badge>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                        {product.description.slice(0, 80)}…
                      </p>
                      <div className="mt-3 text-xs text-accent font-medium">
                        {product.sellerMemberIds.length} verified sellers
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing) => {
                const seller = sampleMembers.find((m) => m.id === listing.sellerId);
                return (
                  <Card key={listing.id} className="bg-card border-border hover:border-accent/50 card-hover h-full overflow-hidden flex flex-col">
                    {/* Photo header */}
                    <div className="relative">
                      <CommodityImage
                        commodity={listing.commodity}
                        alt={`${listing.commodity} ${listing.variant}`}
                        aspect="16/10"
                        rounded={false}
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="outline" className="bg-background/95 backdrop-blur text-[10px]">
                          {listing.origin}
                        </Badge>
                      </div>
                      {listing.stockBand === "low" && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-red-600 text-white border-red-700 text-[10px]">Limited stock</Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4 flex flex-col flex-1">
                      {/* Title row */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{listing.commodity}</h3>
                          <p className="text-xs text-muted-foreground truncate">{listing.variant}</p>
                        </div>
                        <GuardedPrice listing={listing} />
                      </div>

                      {/* Spec line */}
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
                        <span>MOQ: {listing.moq}</span>
                        <span>·</span>
                        <span>{listing.packaging}</span>
                      </div>

                      {/* Single composite cue: stock + trend (kept), one nudge max */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-2">
                        <StockBadge band={listing.stockBand} />
                        <TrendBadge direction={listing.trendDirection} />
                      </div>

                      {/* Most important nudge — scarcity > demand > rising */}
                      <div className="mb-3 min-h-[1rem]">
                        <ScarcityCue listing={listing} />
                      </div>

                      {/* Footer: seller + CTA */}
                      {seller && (
                        <div className="mt-auto pt-3 border-t border-border space-y-2">
                          <Link
                            to={`/store/${seller.slug}`}
                            className="block text-xs hover:text-accent"
                          >
                            <div className="flex items-center gap-1.5 font-medium text-foreground truncate">
                              <MapPin className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                              <span className="truncate">{seller.firmName}</span>
                            </div>
                            <SellerSignals
                              memberSince={seller.memberSince}
                              verified={seller.verificationStatus === "Verified"}
                            />
                          </Link>
                          <div className="flex gap-1.5">
                            <Button
                              size="sm"
                              className="flex-1 bg-accent hover:bg-accent/90 text-primary font-semibold"
                              onClick={() => setRfqProduct(`${listing.commodity} — ${listing.variant}`)}
                            >
                              <Send className="h-3.5 w-3.5 mr-1.5" /> Request Quote
                            </Button>
                            <AddToRfqButton
                              productName={`${listing.commodity} — ${listing.variant}`}
                              productId={listing.id}
                              sellerName={seller.firmName}
                              sellerSlug={seller.slug}
                              origin={listing.origin}
                              moq={listing.moq}
                              variant={listing.variant}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {rfqProduct && <RFQModal productName={rfqProduct} onClose={() => setRfqProduct(null)} />}
    </Layout>
  );
};

export default Products;
