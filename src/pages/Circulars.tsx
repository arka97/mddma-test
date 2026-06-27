import { useEffect, useState } from "react";
import { Search, Calendar, FileText, Download } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/layout/PageHeader";
import { AdSlot } from "@/components/home/today/AdSlot";
import { signPrivatePath } from "@/lib/storage";

interface CircularAttachment {
  url: string;
  name: string;
  type: "pdf" | "image";
  mime: string;
  size: number;
}

interface Circular {
  id: string;
  title: string;
  body: string;
  category: string | null;
  published_at: string | null;
  created_at: string;
  attachments: CircularAttachment[];
}

function formatBytes(n: number) {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

const Circulars = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<Circular[]>([]);

  useEffect(() => {
    let alive = true;
    supabase
      .from("circulars")
      .select("id,title,body,category,published_at,created_at,attachments")
      .eq("is_published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .then(async ({ data }) => {
        if (!alive) return;
        const rows = ((data ?? []) as unknown) as Circular[];
        const resolved = await Promise.all(rows.map(async (r) => {
          const attachments = Array.isArray(r.attachments) ? r.attachments : [];
          const signed = await Promise.all(attachments.map(async (a) => ({
            ...a,
            url: (await signPrivatePath(a.url)) ?? a.url,
          })));
          return { ...r, attachments: signed };
        }));
        if (alive) setItems(resolved);
      });
    return () => { alive = false; };
  }, []);

  const filtered = items.filter((c) => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Layout>
      <Seo title='MDDMA Circulars & Announcements — Trade Notices' description='Official circulars, notices and announcements from the Mumbai Dryfruits & Dates Merchants Association.' path='/circulars' />
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-3xl">
        <AdSlot placement="circulars-banner" />
      </div>

      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-4 max-w-3xl">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No circulars yet. Check back soon.</p>
          ) : filtered.map((c) => {
            const images = c.attachments.filter((a) => a.type === "image");
            const pdfs = c.attachments.filter((a) => a.type === "pdf");
            return (
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
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm whitespace-pre-line">{c.body}</p>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {images.map((img, i) => (
                        <a key={i} href={img.url} target="_blank" rel="noopener noreferrer" className="block">
                          <img
                            src={img.url}
                            alt={img.name}
                            loading="lazy"
                            className="w-full h-32 object-cover rounded-md border border-border hover:opacity-90 transition"
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  {pdfs.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {pdfs.map((pdf, i) => (
                        <a
                          key={i}
                          href={pdf.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-md border border-border bg-muted/30 hover:bg-muted px-3 py-2 text-sm transition"
                        >
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <span className="flex-1 truncate font-medium">{pdf.name}</span>
                          <span className="text-xs text-muted-foreground">{formatBytes(pdf.size)}</span>
                          <Download className="h-3.5 w-3.5 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </Layout>
  );
};

export default Circulars;
