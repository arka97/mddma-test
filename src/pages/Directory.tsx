import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MapPin, Search, ShieldCheck, X } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdSlot } from "@/components/home/today/AdSlot";
import { PageHeader } from "@/components/layout/PageHeader";
import { ListingsGridSkeleton } from "@/components/ui/skeletons";
import { useDirectory } from "@/hooks/queries/useCompanies";
import { CommodityImage } from "@/components/commodity/CommodityImage";
import { SellerSignals } from "@/components/commodity/SellerSignals";
import { FeedShell } from "@/components/layout/FeedShell";
import { SuggestedFollows } from "@/components/feed/SuggestedFollows";
import { TrendingTopics } from "@/components/feed/TrendingTopics";
import { MyBusinessesCard } from "@/components/feed/MyBusinessesCard";

const businessTypes = [
  "Importer",
  "Exporter",
  "Wholesaler",
  "Distributor",
  "Retailer",
  "Manufacturer",
  "Processor",
  "Brand",
  "Broker",
  "Service Provider",
];

const Directory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get("type");
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState(
    initialType && businessTypes.some((type) => type.toLowerCase() === initialType.toLowerCase())
      ? businessTypes.find((type) => type.toLowerCase() === initialType.toLowerCase()) ?? "all"
      : "all",
  );
  const [verificationFilter, setVerificationFilter] = useState("all");
  const { data: allBusinesses = [], isLoading: loading } = useDirectory();

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (typeFilter === "all") next.delete("type");
    else next.set("type", typeFilter.toLowerCase());
    setSearchParams(next, { replace: true });
    // URL state is intentionally driven only by the selected business type.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter]);

  const liveAreas = useMemo(
    () =>
      Array.from(
        new Set(allBusinesses.map((business) => (business.area ?? "").trim()).filter(Boolean)),
      ).sort(),
    [allBusinesses],
  );

  const sortedBusinesses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return allBusinesses
      .filter((business) => {
        const searchable = [
          business.firmName,
          business.ownerName,
          business.area,
          business.memberType,
          ...business.commodities,
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch = !term || searchable.includes(term);
        const matchesArea = areaFilter === "all" || business.area === areaFilter;
        const matchesType =
          typeFilter === "all" ||
          business.memberType === typeFilter ||
          business.commodities.some((category) => category.toLowerCase() === typeFilter.toLowerCase());
        const matchesVerification =
          verificationFilter === "all" || business.verificationStatus === verificationFilter;

        return matchesSearch && matchesArea && matchesType && matchesVerification;
      })
      .sort((a, b) => {
        if (a.verificationStatus !== b.verificationStatus) {
          return a.verificationStatus === "Verified" ? -1 : 1;
        }
        return a.firmName.localeCompare(b.firmName);
      });
  }, [allBusinesses, areaFilter, searchTerm, typeFilter, verificationFilter]);

  const hasFilters =
    Boolean(searchTerm.trim()) ||
    areaFilter !== "all" ||
    typeFilter !== "all" ||
    verificationFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setAreaFilter("all");
    setTypeFilter("all");
    setVerificationFilter("all");
  };

  return (
    <Layout>
      <Seo
        title="Verified Business Directory — G-BAU-G"
        description="Discover verified food businesses, importers, exporters, processors, brokers, brands and trade-service providers on the international G-BAU-G network."
        path="/directory"
        noindex
      />
      <PageHeader
        eyebrow="G-BAU-G Network"
        title="Business Directory"
        subtitle="Discover verified businesses across nuts, dry fruits, seeds, dates, spices and allied food trade."
      />

      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <AdSlot placement="directory-banner" />
      </div>

      <section className="border-b border-border bg-muted/30 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Find a counterparty or service partner</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Verification confirms reviewed business evidence; it does not guarantee stock, quality or fulfilment.
              </p>
            </div>
            <Button asChild size="sm">
              <Link to="/apply">Register your business</Link>
            </Button>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search business, location, product or capability…"
                aria-label="Search businesses"
                className="pl-10"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger className="w-full md:w-44" aria-label="Filter by location">
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                {liveAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48" aria-label="Filter by business type">
                <SelectValue placeholder="All business types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All business types</SelectItem>
                {businessTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={verificationFilter} onValueChange={setVerificationFilter}>
              <SelectTrigger className="w-full md:w-44" aria-label="Filter by verification status">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Verified">Business verified</SelectItem>
                <SelectItem value="Not Verified">Not yet verified</SelectItem>
              </SelectContent>
            </Select>
            {hasFilters && (
              <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="md:self-center">
                <X className="mr-1.5 h-4 w-4" /> Clear
              </Button>
            )}
          </div>
          <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
            Showing {sortedBusinesses.length} of {allBusinesses.length} businesses
          </p>
        </div>
      </section>

      <section className="py-8">
        <FeedShell
          className="max-w-[1240px] px-4 sm:px-6 lg:px-8"
          centerClassName="max-w-none flex-1"
          rightRail={
            <>
              <MyBusinessesCard />
              <SuggestedFollows limit={5} />
              <TrendingTopics />
            </>
          }
        >
          {loading ? (
            <ListingsGridSkeleton count={8} className="grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2" />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {sortedBusinesses.map((business) => {
                const heroCommodity = business.commodities[0] ?? "Food Trade";

                return (
                  <Link
                    key={business.id}
                    to={`/directory/${business.slug}`}
                    className="group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Card className="card-hover flex h-full flex-col overflow-hidden border-border bg-card group-hover:border-accent/50">
                      <div className="relative">
                        <CommodityImage commodity={heroCommodity} aspect="16/10" rounded={false} />
                        {business.verificationStatus === "Verified" && (
                          <div className="absolute right-2 top-2">
                            <Badge className="border-success bg-success text-[10px] text-success-foreground hover:bg-success/90">
                              <ShieldCheck className="mr-0.5 h-3 w-3" /> Business verified
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <div className="mb-2 flex items-start gap-3">
                          <div className="-mt-7 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border-2 border-card bg-primary text-sm font-bold text-primary-foreground shadow">
                            {business.logoPlaceholder}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-semibold text-foreground">{business.firmName}</h3>
                            <p className="truncate text-xs text-muted-foreground">
                              {business.ownerName || business.memberType}
                            </p>
                          </div>
                        </div>

                        <div className="mb-2 flex flex-wrap items-center gap-1">
                          <Badge variant="outline" className="h-5 gap-0.5 text-[10px]">
                            {business.memberType}
                          </Badge>
                        </div>

                        <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {business.area}
                        </div>

                        <div className="mb-3 flex flex-wrap gap-1">
                          {business.commodities.slice(0, 3).map((commodity) => (
                            <Badge key={commodity} variant="secondary" className="h-5 text-[10px]">
                              {commodity}
                            </Badge>
                          ))}
                          {business.commodities.length > 3 && (
                            <Badge variant="secondary" className="h-5 text-[10px]">
                              +{business.commodities.length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="mt-auto border-t border-border pt-2">
                          <SellerSignals
                            memberSince={business.memberSince}
                            verified={business.verificationStatus === "Verified"}
                          />
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}

              {sortedBusinesses.length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <p className="font-medium text-foreground">No businesses match these filters.</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Clear the filters or search for a broader product, location or capability.
                  </p>
                  {hasFilters && (
                    <Button type="button" variant="outline" size="sm" onClick={clearFilters} className="mt-4">
                      Clear filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </FeedShell>
      </section>
    </Layout>
  );
};

export default Directory;
