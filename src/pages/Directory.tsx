import { useState } from "react";
import { Search, Filter, Lock, MapPin, Package } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sampleMembers, tradingAreas, commodityCategories } from "@/data/sampleData";

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [commodityFilter, setCommodityFilter] = useState<string>("all");

  const filteredMembers = sampleMembers.filter((member) => {
    const matchesSearch =
      member.firmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = areaFilter === "all" || member.area === areaFilter;
    const matchesCommodity =
      commodityFilter === "all" ||
      member.commodities.some((c) =>
        c.toLowerCase().includes(commodityFilter.toLowerCase())
      );
    return matchesSearch && matchesArea && matchesCommodity;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "Pending Renewal":
        return "bg-amber-500/10 text-amber-700 border-amber-200";
      case "Expired":
        return "bg-red-500/10 text-red-700 border-red-200";
      default:
        return "";
    }
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Member Directory
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Find verified dry fruits and dates merchants across Mumbai's major
              trading markets. Login for full contact details.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by firm name or owner..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Area Filter */}
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {tradingAreas.map((area) => (
                  <SelectItem key={area.name} value={area.name.split(" ")[0]}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Commodity Filter */}
            <Select value={commodityFilter} onValueChange={setCommodityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Commodities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Commodities</SelectItem>
                {commodityCategories.map((cat) => (
                  <SelectItem key={cat.name} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredMembers.length} of {sampleMembers.length} members
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Login to view contact details</span>
            </div>
          </div>
        </div>
      </section>

      {/* Member List */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((member) => (
              <Card
                key={member.id}
                className="bg-card border-border hover:border-accent/50 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg leading-tight">
                        {member.firmName}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {member.ownerName}
                      </p>
                    </div>
                    <Badge className={getStatusColor(member.membershipStatus)}>
                      {member.membershipStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Area */}
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span className="text-foreground">{member.area}</span>
                    </div>

                    {/* Commodities */}
                    <div className="flex items-start gap-2 text-sm">
                      <Package className="h-4 w-4 text-accent mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {member.commodities.map((commodity) => (
                          <Badge
                            key={commodity}
                            variant="secondary"
                            className="text-xs"
                          >
                            {commodity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Member Since */}
                    <div className="text-xs text-muted-foreground">
                      Member since {member.memberSince}
                    </div>

                    {/* Locked Content */}
                    <div className="pt-3 border-t border-border">
                      <Button
                        variant="ghost"
                        className="w-full text-muted-foreground hover:text-primary"
                        size="sm"
                      >
                        <Lock className="mr-2 h-3 w-3" />
                        Login to view contact details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No members found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Directory;
