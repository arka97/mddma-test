import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AdBanner } from "@/components/home/AdBanner";
import { sampleProducts, productCategories } from "@/data/sampleData";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = sampleProducts.filter((p) => {
    const s = searchTerm.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s);
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <Layout>
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Products Catalog
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Discover dry fruits, dates, seeds and spices traded by MDDMA members. Find verified sellers for each product.
          </p>
        </div>
      </section>

      {/* Category Banner Ad */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdBanner placement="category-banner" />
      </div>

      {/* Filters */}
      <section className="py-6 bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
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
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Showing {filtered.length} of {sampleProducts.length} products
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((product) => (
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
        </div>
      </section>
    </Layout>
  );
};

export default Products;
