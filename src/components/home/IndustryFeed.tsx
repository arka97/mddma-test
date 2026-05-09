import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Eye, MessageSquare } from "lucide-react";
import { TableRowSkeleton } from "@/components/ui/skeletons";
import { useCirculars, usePosts } from "@/hooks/queries/useContent";

export function IndustryFeed() {
  const { data: circulars, isLoading: newsLoading } = useCirculars();
  const { data: posts, isLoading: postsLoading } = usePosts();

  const newsItems = (circulars ?? []).slice(0, 4);
  const postItems = (posts ?? []).slice(0, 4);

  return (
    <section className="bg-background py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="t-h2 text-foreground">Industry feed</h2>
          <p className="text-sm text-muted-foreground">
            Trade news, association circulars, and member discussions in one place.
          </p>
        </div>

        <Card className="mx-auto max-w-4xl">
          <Tabs defaultValue="news" className="w-full">
            <div className="flex items-center justify-between border-b border-border/60 px-4 pt-3 sm:px-6">
              <TabsList className="bg-transparent p-0">
                <TabsTrigger value="news" className="data-[state=active]:bg-secondary">
                  News & Circulars
                </TabsTrigger>
                <TabsTrigger value="community" className="data-[state=active]:bg-secondary">
                  Community
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="news" className="m-0">
              <div className="px-4 sm:px-6">
                {newsLoading ? (
                  <TableRowSkeleton rows={4} />
                ) : newsItems.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No circulars published yet.
                  </p>
                ) : (
                  <ul className="divide-y divide-border/60">
                    {newsItems.map((item) => {
                      const date = item.published_at ?? item.created_at;
                      return (
                        <li key={item.id}>
                          <Link
                            to="/circulars"
                            className="group flex flex-col gap-1 py-4 transition-colors hover:bg-muted/40"
                          >
                            <div className="flex items-center gap-2 text-xs">
                              {item.category && (
                                <Badge variant="neutral" className="capitalize">
                                  {item.category}
                                </Badge>
                              )}
                              <span className="inline-flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {new Date(date).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <h3 className="text-sm font-semibold text-foreground group-hover:text-accent">
                              {item.title}
                            </h3>
                            {item.body && (
                              <p className="line-clamp-1 text-xs text-muted-foreground">{item.body}</p>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <div className="border-t border-border/60 px-4 py-3 text-right sm:px-6">
                <Link
                  to="/circulars"
                  className="inline-flex items-center text-sm font-medium text-accent hover:text-accent/80"
                >
                  All circulars <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="community" className="m-0">
              <div className="px-4 sm:px-6">
                {postsLoading ? (
                  <TableRowSkeleton rows={4} />
                ) : postItems.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No discussions yet. Be the first to start a conversation.
                  </p>
                ) : (
                  <ul className="divide-y divide-border/60">
                    {postItems.map((post) => (
                      <li key={post.id}>
                        <Link
                          to="/community"
                          className="group flex flex-col gap-1 py-4 transition-colors hover:bg-muted/40"
                        >
                          <div className="flex items-center gap-2 text-xs">
                            <Badge variant="neutral">{post.category}</Badge>
                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                              <Eye className="h-3 w-3" />
                              {post.view_count}
                            </span>
                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                              <MessageSquare className="h-3 w-3" />
                              {new Date(post.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-accent">
                            {post.title}
                          </h3>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="border-t border-border/60 px-4 py-3 text-right sm:px-6">
                <Link
                  to="/community"
                  className="inline-flex items-center text-sm font-medium text-accent hover:text-accent/80"
                >
                  Visit community <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </section>
  );
}
