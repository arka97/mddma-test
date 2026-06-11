import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Loader2 } from "lucide-react";
import { useMarketNews } from "@/hooks/queries/useMarketNews";

const MarketNews = () => {
  const { data: items = [], isLoading } = useMarketNews();

  return (
    <Layout>
      <Seo title="Market News — MDDMA" description="Trade news for the dry fruits and dates market." path="/market-news" noindex />
      <section className="py-10">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <header className="mb-6">
            <h1 className="t-h1 text-foreground">Market News</h1>
            <p className="mt-1 text-sm text-muted-foreground">Latest stories from the dry-fruits &amp; dates trade.</p>
          </header>

          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : items.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No news published yet.</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {items.map((n) => (
                <Card key={n.id}>
                  <CardContent className="flex gap-4 p-4">
                    {n.image_url && <img src={n.image_url} alt="" className="h-24 w-24 shrink-0 rounded-md object-cover" />}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        {n.category && <Badge variant="neutral" className="capitalize">{n.category}</Badge>}
                        {n.source_name && <span>{n.source_name}</span>}
                        {n.published_at && <span>· {new Date(n.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                      </div>
                      <h2 className="mt-1 text-base font-semibold text-foreground">{n.title}</h2>
                      {n.summary && <p className="mt-1 text-sm text-muted-foreground">{n.summary}</p>}
                      {n.body && <p className="mt-2 whitespace-pre-line text-sm text-foreground/90">{n.body}</p>}
                      {n.source_url && (
                        <a href={n.source_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
                          Read source <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MarketNews;
