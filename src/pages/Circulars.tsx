import { useEffect, useState } from "react";
import { Search, Calendar } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/layout/PageHeader";

interface Circular {
  id: string;
  title: string;
  body: string;
  category: string | null;
  published_at: string | null;
  created_at: string;
}

const Circulars = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<Circular[]>([]);

  useEffect(() => {
    let alive = true;
    supabase
      .from("circulars")
      .select("id,title,body,category,published_at,created_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (alive) setItems((data ?? []) as Circular[]); });
    return () => { alive = false; };
  }, []);

  const filtered = items.filter((c) => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Layout>
      <PageHeader
        title="Circulars & Notices"
        subtitle="Latest government notifications, trade updates, and association announcements."
      />

      <section className="border-b border-border bg-muted/30 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search circulars..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <p className="text-sm text-muted-foreground mt-3">Showing {filtered.length} circulars</p>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-4 max-w-3xl">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No circulars yet. Check back soon.</p>
          ) : filtered.map((c) => (
            <Card key={c.id} className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1">
                    {c.category && <Badge variant="secondary" className="mb-2">{c.category}</Badge>}
                    <CardTitle className="text-lg">{c.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(c.published_at ?? c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm whitespace-pre-line">{c.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Circulars;
