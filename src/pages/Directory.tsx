import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MapPin, ShieldCheck, Star, Loader2, BadgeCheck } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AdBanner } from "@/components/home/AdBanner";
import { tradingAreas } from "@/data/sampleData";
import { useLiveCompanies } from "@/hooks/useLiveCompanies";
import { CommodityImage } from "@/components/commodity/CommodityImage";
import { SellerSignals } from "@/components/commodity/SellerSignals";
import { useSellerTradeSignalsBatch } from "@/lib/tradeSignals";

const memberTypes = ["Importer", "Wholesaler", "Retailer", "Processor", "Broker"];

const Directory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get("type");
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>(
    initialType && memberTypes.map((t) => t.toLowerCase()).includes(initialType.toLowerCase())
      ? memberTypes.find((t) => t.toLowerCase() === initialType.toLowerCase())!
      : "all"
  );
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const { entries: allMembers, loading } = useLiveCompanies();

  // Keep URL in sync with the type filter for shareable deep links.
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (typeFilter === "all") next.delete("type");
    else next.set("type", typeFilter.toLowerCase());
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter]);

  const filteredMembers = allMembers.filter((member) => {
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      member.firmName.toLowerCase().includes(s) ||
      member.ownerName.toLowerCase().includes(s) ||
      member.commodities.some((c) => c.toLowerCase().includes(s));
    const matchesArea = areaFilter === "all" || member.area === areaFilter;
    const matchesType = typeFilter === "all" || member.memberType === typeFilter;
    const matchesVerification =
      verificationFilter === "all" || member.verificationStatus === verificationFilter;
    return matchesSearch && matchesArea && matchesType && matchesVerification;
  });

  const sorted = [...filteredMembers].sort((a, b) => {
    if (a.isSponsored && !b.isSponsored) return -1;
    if (!a.isSponsored && b.isSponsored) return 1;
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  // Phase C: batch-fetch trade signals for the live companies on screen.
  // Demo entries don't have a Supabase row, so we just show the placeholder
  // for them — the SellerSignals component handles signals=null gracefully.
  const liveIds = sorted.filter((m) => m.source === "live").map((m) => m.id);
  const { map: signalsMap } = useSellerTradeSignalsBatch(liveIds);

  return (
    <Layout>
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Member Directory
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Find KYC-verified dry fruits and dates merchants across Mumbai&apos;s major trading markets
          </p>
        </div>
      </section>

      <section className="py-6 bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search company, owner, or product..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="All Areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {tradingAreas.map((a) => (
                  <SelectItem key={a.name} value={a.name}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {memberTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={verificationFilter} onValueChange={setVerificationFilter}>
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Not Verified">Not Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {loading ? <Loader2 className="h-3 w-3 inline animate-spin mr-1" /> : null}
            Showing {sorted.length} of {allMembers.length} members
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2">
              {sorted.map((member) => {
                const heroCommodity = member.commodities[0] ?? "Mixed Dry Fruits";
                const hasGst = member.gstNumber && member.gstNumber.length >= 5;
                const hasFssai = !!member.fssaiNumber;
                return (
                  <Link key={member.id} to={`/store/${member.slug}`} className="group">
                    <Card className="bg-card border-border hover:border-accent/50 card-hover h-full overflow-hidden flex flex-col">
                      {/* Hero photo of primary commodity */}
                      <div className="relative">
                        <CommodityImage commodity={heroCommodity} aspect="16/10" rounded={false} />
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          {member.source === "live" && (
                            <span className="text-[9px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded bg-accent text-primary">
                              Live
                            </span>
                          )}
                          {member.isSponsored && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded bg-background/95 text-accent backdrop-blur">
                              <Star className="h-2.5 w-2.5" /> Sponsored
                            </span>
                          )}
                        </div>
                        {member.verificationStatus === "Verified" && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white border-emerald-700 text-[10px]">
                              <ShieldCheck className="h-3 w-3 mr-0.5" /> Verified
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        {/* Logo + firm name */}
                        <div className="flex items-start gap-3 mb-2">
                          <div className="h-11 w-11 -mt-7 rounded-lg bg-primary border-2 border-card flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0 shadow">
                            {member.logoPlaceholder}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-foreground truncate">{member.firmName}</h3>
                            <p className="text-xs text-muted-foreground truncate">{member.ownerName || member.memberType}</p>
                          </div>
                        </div>

                        {/* KYC trust pills */}
                        <div className="flex items-center gap-1 flex-wrap mb-2">
                          <Badge variant="outline" className="text-[10px] h-5 gap-0.5">{member.memberType}</Badge>
                          {hasGst && (
                            <Badge variant="outline" className="text-[10px] h-5 gap-0.5 border-emerald-200 text-emerald-700 bg-emerald-50">
                              <BadgeCheck className="h-2.5 w-2.5" /> GST
                            </Badge>
                          )}
                          {hasFssai && (
                            <Badge variant="outline" className="text-[10px] h-5 gap-0.5 border-emerald-200 text-emerald-700 bg-emerald-50">
                              <BadgeCheck className="h-2.5 w-2.5" /> FSSAI
                            </Badge>
                          )}
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3" /> {member.area}
                        </div>

                        {/* Commodities */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {member.commodities.slice(0, 3).map((c) => (
                            <Badge key={c} variant="secondary" className="text-[10px] h-5">{c}</Badge>
                          ))}
                          {member.commodities.length > 3 && (
                            <Badge variant="secondary" className="text-[10px] h-5">+{member.commodities.length - 3}</Badge>
                          )}
                        </div>

                        {/* Trade signals — live for Supabase entries, placeholder for demo */}
                        <div className="mt-auto pt-2 border-t border-border">
                          <SellerSignals
                            memberSince={member.memberSince}
                            verified={member.verificationStatus === "Verified"}
                            signals={member.source === "live" ? signalsMap.get(member.id) ?? null : null}
                          />
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}

              {sorted.length === 0 && (
                <div className="text-center py-12 col-span-full">
                  <p className="text-muted-foreground">No members found matching your criteria.</p>
                </div>
          </div>

          <div className="mt-8">
            <AdBanner placement="directory-sidebar" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Directory;
