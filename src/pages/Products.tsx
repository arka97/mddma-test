import { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { ORIGIN_COUNTRIES } from "@/lib/originCountries";
import { AdSlot } from "@/components/home/today/AdSlot";
import { PageHeader } from "@/components/layout/PageHeader";
import { ListingsGridSkeleton } from "@/components/ui/skeletons";
import { useProducts } from "@/hooks/queries/useProducts";
import { useProductCategories } from "@/hooks/queries/useProductCategories";
import { CategoryGrid } from "@/components/products/CategoryGrid";
import { RecentListings } from "@/components/products/RecentListings";
import { ProductTile } from "@/components/products/ProductTile";

const Products = () => {
  const [params, setParams] = useSearchParams();
  const activeCat = params.get("cat") ?? "";
  const [searchTerm, setSearchTerm] = useState(params.get("q") ?? "");
  const [originFilter, setOriginFilter] = useState<string>(params.get("origin") ?? "all");
  const mode = (params.get("mode") ?? "all") as "all" | "bulk" | "branded";
  const { data: listingsData, isLoading } = useProducts();
  const { data: catsData } = useProductCategories({ activeOnly: true });
  const allListings = listingsData ?? [];
  const listings =
    mode === "bulk"
      ? allListings.filter((listing) => !listing.isBranded)
      : mode === "branded"
        ? allListings.filter((listing) => listing.isBranded)
        : allListings;
  const cats = catsData ?? [];

  const setMode = (nextMode: "all" | "bulk" | "branded") => {
    const next = new URLSearchParams(params);
    if (nextMode === "all") next.delete("mode");
    else next.set("mode", nextMode);
    setParams(next);
  };

  const ModeToggle = () => (
    <div className="inline-flex items-center rounded-md border border-border bg-background p-0.5 text-xs">
      {(["all", "bulk", "branded"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setMode(item)}
          className={`rounded px-3 py-1.5 transition ${mode === item ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          {item === "all" ? "All" : item === "bulk" ? "Bulk" : "Branded"}
        </button>
      ))}
    </div>
  );

  const activeCatRow = cats.find((category) => category.name === activeCat) ?? null;

  if (!activeCat) {
    return (
      <Layout>
        <Seo
          title="Food-Trade Product Catalogue — G-BAU-G"
          description="Browse bulk and branded food products listed by businesses across the G-BAU-G trade network."
          path="/products"
        />
        <PageHeader
          eyebrow="Business catalogues"
          title="Product Catalogue"
          subtitle="Browse bulk and branded listings from food-trade businesses. Catalogue ranges are indicative; exact commercial terms belong in private quotations."
        />

        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <ModeToggle />
          <AdSlot placement="products-banner" />
        </div>

        {isLoading ? (
          <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <ListingsGridSkeleton count={12} />
          </div>
        ) : (
          <>
            <CategoryGrid listings={listings} />
            <RecentListings listings={listings} limit={8} />
          </>
        )}
      </Layout>
    );
  }

  const inCat = listings.filter((listing) => listing.variant === activeCat);
  const liveOrigins = Array.from(
    new Set(inCat.map((listing) => (listing.origin ?? "").trim()).filter(Boolean)),
  ).sort();

  const filtered = inCat.filter((listing) => {
    const search = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !search ||
      listing.commodity.toLowerCase().includes(search) ||
      (listing.variant ?? "").toLowerCase().includes(search);
    const matchesOrigin = originFilter === "all" || listing.origin === originFilter;
    return matchesSearch && matchesOrigin;
  });

  const clearCategory = () => {
    setParams({});
    setSearchTerm("");
    setOriginFilter("all");
  };

  return (
    <Layout>
      <Seo
        title={`${activeCat} Suppliers and Products — G-BAU-G`}
        description={`Browse ${activeCat} product listings from food-trade businesses on G-BAU-G.`}
        path="/products"
      />
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

      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <AdSlot placement="products-banner" />
      </div>

      <section className="border-b border-border bg-muted/50 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={`Search within ${activeCat}…`}
                className="pl-10"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <SearchableSelect
              className="w-full sm:w-44"
              value={originFilter}
              onChange={setOriginFilter}
              allOption={{ value: "all", label: "All Origins" }}
              placeholder="All Origins"
              searchPlaceholder="Search country…"
              options={(liveOrigins.length ? liveOrigins : ORIGIN_COUNTRIES).map((origin) => ({
                value: origin,
                label: origin,
              }))}
            />
            <Button variant="outline" onClick={clearCategory} className="sm:w-auto">
              <ChevronLeft className="mr-1 h-4 w-4" /> All Categories
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
            <div className="rounded-lg border border-dashed border-border py-16 text-center">
              <p className="text-muted-foreground">
                {inCat.length === 0
                  ? `No live listings yet in ${activeCat}. Check back soon.`
                  : "No listings match your filters."}
              </p>
              <Link to="/products" className="mt-3 inline-block text-sm text-accent hover:text-accent/80">
                ← Browse other categories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {filtered.map((listing) => (
                <ProductTile key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Products;
