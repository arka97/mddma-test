import { useState } from "react";
import { Search, Download, Lock, Calendar } from "lucide-react";
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
import { sampleCirculars } from "@/data/sampleData";

const Circulars = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredCirculars = sampleCirculars.filter((circular) => {
    const matchesSearch = circular.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || circular.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Government":
        return "bg-blue-500/10 text-blue-700 border-blue-200";
      case "Trade":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "Internal":
        return "bg-purple-500/10 text-purple-700 border-purple-200";
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
              Circulars & Notices
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Stay updated with the latest government notifications, trade
              updates, and association announcements
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search circulars..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Government">Government</SelectItem>
                <SelectItem value="Trade">Trade</SelectItem>
                <SelectItem value="Internal">Internal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredCirculars.length} circulars
            </p>
          </div>
        </div>
      </section>

      {/* Circulars List */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {filteredCirculars.map((circular) => (
              <Card
                key={circular.id}
                className="bg-card border-border hover:border-accent/50 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getCategoryColor(circular.category)}>
                          {circular.category}
                        </Badge>
                        {!circular.isPublic && (
                          <Badge
                            variant="outline"
                            className="text-xs flex items-center gap-1"
                          >
                            <Lock className="h-3 w-3" />
                            Members Only
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        {circular.title}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(circular.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-4">
                    {circular.summary}
                  </p>
                  <div className="flex gap-2">
                    {circular.isPublic ? (
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <Lock className="mr-2 h-4 w-4" />
                        Login to access
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCirculars.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No circulars found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Circulars;
