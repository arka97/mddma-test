import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Package, ShieldCheck, Star, Filter } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AdBanner } from "@/components/home/AdBanner";
import { sampleMembers, tradingAreas } from "@/data/sampleData";
import { useLiveCompanies } from "@/hooks/useLiveCompanies";
import { Loader2 } from "lucide-react";

const memberTypes = ["Importer", "Wholesaler", "Retailer", "Processor"];

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const { entries: allMembers, loading } = useLiveCompanies();

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

  // Show sponsored members first
  const sorted = [...filteredMembers].sort((a, b) => {
    if (a.isSponsored && !b.isSponsored) return -1;
    if (!a.isSponsored && b.isSponsored) return 1;
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Member Directory
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Find verified dry fruits and dates merchants across Mumbai's major trading markets
          </p>
        </div>
      </section>

      {/* Filters */}
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
            Showing {sorted.length} of {sampleMembers.length} members
          </p>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            <div className="grid gap-4 sm:grid-cols-2">
              {sorted.map((member) => (
                <Link key={member.id} to={`/store/${member.slug}`}>
                  <Card className="bg-card border-border hover:border-accent/50 card-hover h-full">
                    <CardContent className="p-5">
                      {/* Sponsored label */}
                      {member.isSponsored && (
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-3 w-3 text-accent" />
                          <span className="text-xs text-accent font-medium">Sponsored</span>
                        </div>
                      )}

                      <div className="flex items-start gap-3 mb-3">
                        <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                          {member.logoPlaceholder}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-foreground truncate">{member.firmName}</h3>
                          <p className="text-xs text-muted-foreground">{member.ownerName}</p>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-3">
                        {member.verificationStatus === "Verified" && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5 gap-0.5">
                            <ShieldCheck className="h-3 w-3" />
                            {member.verificationLevel}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">{member.memberType}</Badge>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3" /> {member.area}
                      </div>

                      {/* Products */}
                      <div className="flex flex-wrap gap-1">
                        {member.commodities.slice(0, 3).map((c) => (
                          <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                        ))}
                        {member.commodities.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{member.commodities.length - 3}</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {sorted.length === 0 && (
                <div className="text-center py-12 col-span-full">
                  <p className="text-muted-foreground">No members found matching your criteria.</p>
                </div>
              )}
            </div>

            {/* Sidebar ads */}
            <div className="hidden lg:block">
              <AdBanner placement="directory-sidebar" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Directory;
