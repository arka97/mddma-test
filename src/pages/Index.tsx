import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { FeedTabs, type FeedTab } from "@/components/shell/FeedTabs";
import { FeedRow, usePostMeta } from "@/components/shell/FeedRow";
import { useUnifiedFeed } from "@/hooks/queries/useUnifiedFeed";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [tab, setTab] = useState<FeedTab>("for_you");
  const { items, loading } = useUnifiedFeed(tab);
  const meta = usePostMeta(items);

  return (
    <Layout>
      <Seo
        title="G-BAU-G — Verified Global Food Trade Network by MDDMA"
        description="Live feed of verified merchants, new products, RFQs, bulletin notices and market signals across nuts, dry fruits, dates, seeds and spices."
        path="/"
      />

      <div className="mx-auto w-full max-w-[720px]">
        <div className="hidden border-b border-border px-4 py-3 lg:block">
          <h1 className="text-xl font-bold">Home</h1>
        </div>
        <FeedTabs active={tab} onChange={setTab} />

        {loading ? (
          <div className="space-y-4 p-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Nothing here yet. Follow members, wait for new posts, or switch tabs.
          </div>
        ) : (
          <div>
            {items.map((item, i) => (
              <FeedRow
                key={`${item.kind}-${item.kind === "ad" ? `${item.data.id}-${i}` : item.data.id}`}
                item={item}
                authors={meta.authors}
                likes={meta.likes}
                comments={meta.comments}
                views={meta.views}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
