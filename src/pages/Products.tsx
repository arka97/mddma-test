import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Send, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { ORIGIN_COUNTRIES } from "@/lib/originCountries";
import { AdBanner } from "@/components/home/AdBanner";
import { PageHeader } from "@/components/layout/PageHeader";
import { ListingsGridSkeleton } from "@/components/ui/skeletons";

import { RFQModal } from "@/components/RFQModal";
import { ProductMediaCarousel } from "@/components/commodity/ProductMediaCarousel";
import { GuardedPrice } from "@/components/commodity/GuardedPrice";
import { useProducts } from "@/hooks/queries/useProducts";
import { useProductCategories } from "@/hooks/queries/useProductCategories";
import { CategoryGrid } from "@/components/products/CategoryGrid";
import { RecentListings } from "@/components/products/RecentListings";

const Products = () => {
  const [params, setParams] = useSearchParams();
  const activeCat = params.get("cat") ?? "";

  const [searchTerm, setSearchTerm] = useState(params.get("q") ?? "");
  const [originFilter, setOriginFilter] = useState<string>(params.get("origin") ?? "all");
  const [rfqProduct, setRfqProduct] = useState<string | null>(null);
  const mode = (params.get("mode") ?? "all") as "all" | "bulk" | "branded";

  const { data: listingsData, isLoading } = useProducts();
  const { data: catsData } = useProductCategories({ activeOnly: true });
  const allListings = listingsData ?? [];
  const listings = mode === "bulk"
    ? allListings.filter((l) => !l.isBranded)
    : mode === "branded"
      ? allListings.filter((l) => l.isBranded)
      : allListings;
  const cats = catsData ?? [];

  const setMode = (m: "all" | "bulk" | "branded") => {
    const next = new URLSearchParams(params);
    if (m === "all") next.delete("mode"); else next.set("mode", m);
    setParams(next);
  };

  const ModeToggle = () => (
    <div className="inline-flex items-center rounded-md border border-border bg-background p-0.5 text-xs">
      {(["all", "bulk", "branded"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => setMode(m)}
          className={`px-3 py-1.5 rounded transition ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          {m === "all" ? "All" : m === "bulk" ? "Bulk" : "Branded"}
        </button>
      ))}
    </div>
  );

  const activeCatRow = cats.find((c) => c.name === activeCat) ?? null;

  // Mode A: browse (no category selected)
  if (!activeCat) {
    return (
      <Layout>
        <PageHeader
          title="Verified Marketplace"
          subtitle="Browse commodity categories from KYC-verified MDDMA sellers. Pick a category to view listings."
        />

        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <AdBanner placement="category-banner" />
        </div>

        {isLoading ? (
          <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <ListingsGridSkeleton count={12} />
          </div>
        ) : (
          <>
            <CategoryGrid listings={listings} />
            <RecentListings
              listings={listings}
              limit={8}
              onRequestQuote={(name) => setRfqProduct(name)}
            />
          </>
        )}

        {rfqProduct && <RFQModal productName={rfqProduct} onClose={() => setRfqProduct(null)} />}
      </Layout>
    );
  }

  // Mode B: category detail
  const inCat = listings.filter((l) => l.variant === activeCat);
  const liveOrigins = Array.from(
    new Set(inCat.map((l) => (l.origin ?? "").trim()).filter(Boolean)),
  ).sort();

  const filtered = inCat.filter((pl) => {
    const s = searchTerm.toLowerCase().trim();
    const matchSearch =
      !s || pl.commodity.toLowerCase().includes(s) || (pl.variant ?? "").toLowerCase().includes(s);
    const matchOrigin = originFilter === "all" || pl.origin === originFilter;
    return matchSearch && matchOrigin;
  });

  const clearCategory = () => {
    setParams({});
    setSearchTerm("");
    setOriginFilter("all");
  };

  return (
    <Layout>
      <section className="border-b border-border bg-muted/30 py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
            <button onClick={clearCategory} className="inline-flex items-center hover:text-accent">
              <ChevronLeft className="h-4 w-4" /> Categories
            </button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{activeCat}</span>
          </nav>
          <div className="flex items-center gap-4">
            {activeCatRow?.image_url && (
              <img
                src={activeCatRow.image_url}
                alt={activeCat}
                className="h-16 w-16 rounded-lg border border-border object-cover"
                loading="lazy"
              />
            )}
            <div className="min-w-0">
              <h1 className="t-h1 text-foreground">{activeCat}</h1>
              {activeCatRow?.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {activeCatRow.description}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                {inCat.length} {inCat.length === 1 ? "listing" : "listings"}
              </p>
            </div>
          </div>
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
                placeholder={`Search within ${activeCat}…`}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <SearchableSelect
              className="w-full sm:w-44"
              value={originFilter}
              onChange={setOriginFilter}
              allOption={{ value: "all", label: "All Origins" }}
              placeholder="All Origins"
              searchPlaceholder="Search country…"
              options={(liveOrigins.length ? liveOrigins : ORIGIN_COUNTRIES).map((o) => ({
                value: o,
                label: o,
              }))}
            />
            <Button variant="outline" onClick={clearCategory} className="sm:w-auto">
              <ChevronLeft className="h-4 w-4 mr-1" /> All Categories
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Showing {filtered.length} of {inCat.length} listings in {activeCat}
          </p>
        </div>
      </section>

      <section className="py-8 pb-24 lg:pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <ListingsGridSkeleton count={9} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">
                {inCat.length === 0
                  ? `No live listings yet in ${activeCat}. Check back soon.`
                  : "No listings match your filters."}
              </p>
              <Link
                to="/products"
                className="inline-block mt-3 text-sm text-accent hover:text-accent/80"
              >
                ← Browse other categories
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((listing) => (
                <Card
                  key={listing.id}
                  className="bg-card border-border hover:border-accent/50 card-hover h-full overflow-hidden flex flex-col"
                >
                  <div className="relative">
                    <ProductMediaCarousel
                      commodity={listing.commodity}
                      alt={`${listing.commodity} ${listing.variant}`}
                      images={[listing.imageUrl, ...(listing.gallery ?? [])]}
                      videoUrl={listing.videoUrl}
                      aspect="16/10"
                      rounded={false}
                    />
                    {listing.origin && (
                      <div className="absolute top-2 left-2 z-10">
                        <Badge
                          variant="outline"
                          className="bg-background/95 backdrop-blur text-[10px]"
                        >
                          {listing.origin}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {listing.commodity}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">{listing.variant}</p>
                      </div>
                      <GuardedPrice listing={listing} />
                    </div>

                    <div className="mt-auto pt-3 border-t border-border space-y-2">
                      <Button
                        size="sm"
                        className="w-full text-accent-foreground"
                        onClick={() =>
                          setRfqProduct(`${listing.commodity} — ${listing.variant}`)
                        }
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
