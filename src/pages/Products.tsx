import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Filter } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdBanner } from "@/components/home/AdBanner";
import { sampleProducts, productCategories, sampleMembers } from "@/data/sampleData";
import { productListings } from "@/data/productListings";
import { useRole } from "@/contexts/RoleContext";
import { MapPin } from "lucide-react";

const origins = ["USA", "Iran", "Afghanistan", "India", "Vietnam", "Chile", "Turkey", "Saudi Arabia", "Jordan", "Australia", "Kashmir"];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [originFilter, setOriginFilter] = useState<string>("all");
  const [view, setView] = useState<"catalog" | "marketplace">("catalog");
  const { canAccess } = useRole();

  // Catalog view filters
  const filteredProducts = sampleProducts.filter((p) => {
    const s = searchTerm.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s);
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  // Marketplace view filters
  const filteredListings = productListings.filter((pl) => {
    const s = searchTerm.toLowerCase();
    const matchSearch = pl.commodity.toLowerCase().includes(s) || pl.variant.toLowerCase().includes(s);
    const matchOrigin = originFilter === "all" || pl.origin === originFilter;
    return matchSearch && matchOrigin;
  });

  return (
    <Layout>
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Commodity Marketplace
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Discover dry fruits, dates, seeds and spices. Browse the catalog or view live marketplace listings with pricing.
          </p>
        </div>
      </section>

      {/* Category Banner Ad */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdBanner placement="category-banner" />
      </div>

      {/* View Toggle + Filters */}
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
              <Input placeholder="Search products..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            {view === "catalog" ? (
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {productCategories.map((c) => (
                    <SelectItem key={c.slug} value={c.name}>{c.icon} {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Select value={originFilter} onValueChange={setOriginFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Origins" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Origins</SelectItem>
                  {origins.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Showing {view === "catalog" ? filteredProducts.length : filteredListings.length} results
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {view === "catalog" ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.slug}`}>
                  <Card className="bg-card border-border hover:border-accent/50 card-hover h-full">
                    <CardContent className="p-5 text-center">
                      <div className="text-4xl mb-3">{product.image}</div>
                      <h3 className="font-semibold text-foreground text-sm mb-1">{product.name}</h3>
                      <Badge variant="secondary" className="text-xs mb-2">{product.category}</Badge>
                      <p className="text-xs text-muted-foreground line-clamp-2">{product.description.slice(0, 80)}...</p>
                      <div className="mt-3 text-xs text-accent font-medium">
                        {product.sellerMemberIds.length} verified sellers
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing) => {
                const seller = sampleMembers.find((m) => m.id === listing.sellerId);
                return (
                  <Link key={listing.id} to={seller ? `/store/${seller.slug}` : "#"}>
                    <Card className="bg-card border-border hover:border-accent/50 card-hover h-full">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{listing.commodity}</h3>
                            <p className="text-xs text-muted-foreground">{listing.variant}</p>
                          </div>
                          {listing.hidePrice || listing.price === null ? (
                            <Badge variant="secondary" className="text-xs">RFQ</Badge>
                          ) : (
                            <span className="text-sm font-bold text-accent whitespace-nowrap">{listing.price.toLocaleString()} {listing.priceUnit}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <Badge variant="outline" className="text-xs">{listing.origin}</Badge>
                          <span>MOQ: {listing.moq}</span>
                          <span>{listing.packaging}</span>
                        </div>
                        {seller && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t border-border">
                            <MapPin className="h-3 w-3" /> {seller.firmName} · {listing.location}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Products;
