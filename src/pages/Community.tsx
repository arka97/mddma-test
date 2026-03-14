import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityPosts } from "@/data/productListings";
import { MessageSquare, Eye, Pin, ExternalLink, AlertTriangle } from "lucide-react";

const categories = ["Market Updates", "Trade Discussions", "Association Circulars"] as const;

const Community = () => {
  const renderPost = (post: typeof communityPosts[0]) => (
    <div key={post.id} className="flex items-start gap-3 p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
      {post.pinned && <Pin className="h-4 w-4 text-accent flex-shrink-0 mt-1" />}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground text-sm leading-tight">{post.title}</h3>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
          <span>{post.author} · {post.authorCompany}</span>
          <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{post.replies}</span>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.views}</span>
          <span>{new Date(post.lastActivity).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">Trade Community</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Market intelligence, industry discussions and association updates
          </p>
        </div>
      </section>

      {/* Rules Banner */}
      <section className="py-4 bg-accent/5 border-b border-accent/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-sm">
            <AlertTriangle className="h-4 w-4 text-accent flex-shrink-0" />
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Community Rules:</span> This is a discussion forum for market intelligence and industry news.{" "}
              <span className="text-destructive font-medium">❌ No trade offers</span> ·{" "}
              <span className="text-destructive font-medium">❌ No buy/sell requests</span>. Use the{" "}
              <a href="/broker" className="text-accent hover:underline">Broker Marketplace</a> for trade.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <div>
              <Tabs defaultValue="Market Updates">
                <TabsList className="mb-4">
                  {categories.map((cat) => (
                    <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
                  ))}
                </TabsList>
                {categories.map((cat) => (
                  <TabsContent key={cat} value={cat}>
                    <Card>
                      <CardContent className="p-0">
                        {communityPosts
                          .filter((p) => p.category === cat)
                          .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))
                          .map(renderPost)}
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="p-5 text-center">
                  <h3 className="font-semibold text-foreground mb-2">Full Community Forum</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join deeper discussions on community.mddma.com powered by Discourse.
                  </p>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-primary" asChild>
                    <a href="https://community.mddma.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Visit Forum
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader><CardTitle className="text-base">Popular Topics</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {communityPosts
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 5)
                      .map((p) => (
                        <div key={p.id} className="text-sm">
                          <p className="text-foreground line-clamp-1">{p.title}</p>
                          <p className="text-xs text-muted-foreground">{p.views} views · {p.replies} replies</p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader><CardTitle className="text-base">Forum Categories</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {["Market Intelligence", "Industry News", "Trade Discussions", "Association Updates", "Events", "Social Lounge"].map((cat) => (
                    <Badge key={cat} variant="outline" className="mr-1 mb-1 text-xs">{cat}</Badge>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Community;
