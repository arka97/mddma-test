import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useHumor } from "@/hooks/queries/useHumor";

const Humor = () => {
  const { data: items = [], isLoading } = useHumor();

  return (
    <Layout>
      <Seo title="Humor — MDDMA" description="A lighter side of the dry fruits trade." path="/humor" noindex />
      <section className="py-10">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <header className="mb-6">
            <h1 className="t-h1 text-foreground">Humor</h1>
            <p className="mt-1 text-sm text-muted-foreground">Anecdotes, jokes and lighter moments from the market.</p>
          </header>

          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : items.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No humor posts published yet.</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {items.map((h) => (
                <Card key={h.id}>
                  <CardContent className="p-4">
                    {h.image_url && <img src={h.image_url} alt="" className="mb-3 max-h-72 w-full rounded-md object-cover" />}
                    <h2 className="text-base font-semibold text-foreground">{h.title}</h2>
                    <p className="mt-2 whitespace-pre-line text-sm text-foreground/90">{h.body}</p>
                    {h.attribution && <p className="mt-3 text-[11px] uppercase tracking-wide text-muted-foreground">— {h.attribution}</p>}
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

export default Humor;
