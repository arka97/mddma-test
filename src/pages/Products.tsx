import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Send, MapPin, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AdBanner } from "@/components/home/AdBanner";
import { StockBadge, TrendBadge } from "@/components/MarketSignals";
import { RFQModal } from "@/components/RFQModal";
import { CommodityImage } from "@/components/commodity/CommodityImage";
import { GuardedPrice } from "@/components/commodity/GuardedPrice";
import { useProducts } from "@/hooks/queries/useProducts";
import { useProductCategories } from "@/hooks/queries/useProductCategories";

const origins = ["USA", "Iran", "Afghanistan", "India", "Vietnam", "Chile", "Turkey", "Saudi Arabia", "Jordan", "Australia", "Kashmir"];

const Products = () => {
  const [params] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(params.get("q") ?? "");
  const [categoryFilter, setCategoryFilter] = useState<string>(params.get("cat") ?? "all");
  const [originFilter, setOriginFilter] = useState<string>(params.get("origin") ?? "all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [rfqProduct, setRfqProduct] = useState<string | null>(null);

  const { data: listings, isLoading } = useProducts();
  const { data: curatedCats } = useProductCategories({ activeOnly: true });

  // Curated categories from admin take priority; fall back to derived names if empty.
  const liveCategories = curatedCats.length
    ? curatedCats.map((c) => c.name)
    : Array.from(
        new Set(listings.map((l) => (l.variant ?? "").trim()).filter(Boolean))
      ).sort();
  const liveOrigins = Array.from(
    new Set(listings.map((l) => (l.origin ?? "").trim()).filter(Boolean))
  ).sort();

  const filtered = listings.filter((pl) => {
    const s = searchTerm.toLowerCase();
    const matchSearch =
      pl.commodity.toLowerCase().includes(s) ||
      (pl.variant ?? "").toLowerCase().includes(s);
    const matchCategory = categoryFilter === "all" || pl.variant === categoryFilter;
    const matchOrigin = originFilter === "all" || pl.origin === originFilter;
    const matchStock = stockFilter === "all" || pl.stockBand === stockFilter;
    return matchSearch && matchCategory && matchOrigin && matchStock;
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

      <section className="py-6 bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search commodity, variant, origin..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {liveCategories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={originFilter} onValueChange={setOriginFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Origins" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Origins</SelectItem>
                {(liveOrigins.length ? liveOrigins : origins).map((o) => (
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
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {isLoading ? <Loader2 className="h-3 w-3 inline animate-spin mr-1" /> : null}
            Showing {filtered.length} of {listings.length} listings
          </p>
        </div>
      </section>

      <section className="py-8 pb-24 lg:pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">
                {listings.length === 0
                  ? "No live listings yet. Check back soon."
                  : "No listings match your filters."}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((listing) => (
                <Card key={listing.id} className="bg-card border-border hover:border-accent/50 card-hover h-full overflow-hidden flex flex-col">
                  <div className="relative">
                    <CommodityImage
                      commodity={listing.commodity}
                      alt={`${listing.commodity} ${listing.variant}`}
                      aspect="16/10"
                      rounded={false}
                    />
                    {listing.origin && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="outline" className="bg-background/95 backdrop-blur text-[10px]">
                          {listing.origin}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{listing.commodity}</h3>
                        <p className="text-xs text-muted-foreground truncate">{listing.variant}</p>
                      </div>
                      <GuardedPrice listing={listing} />
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap mb-3">
                      <StockBadge band={listing.stockBand} />
                      <TrendBadge direction={listing.trendDirection} />
                    </div>

                    <div className="mt-auto pt-3 border-t border-border space-y-2">
                      <Button
                        size="sm"
                        className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold"
                        onClick={() => setRfqProduct(`${listing.commodity} — ${listing.variant}`)}
                      >
                        <Send className="h-3.5 w-3.5 mr-1.5" /> Request Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {rfqProduct && <RFQModal productName={rfqProduct} onClose={() => setRfqProduct(null)} />}
    </Layout>
  );
};

export default Products;
