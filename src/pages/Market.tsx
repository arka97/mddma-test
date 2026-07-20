import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, LogIn, Plus, ShieldCheck } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TopicChips } from "@/components/market/TopicChips";
import { PostCard } from "@/components/market/PostCard";
import { PinnedRatesCard } from "@/components/market/PinnedRatesCard";
import { ComposeSheet } from "@/components/market/ComposeSheet";
import { CircularsSection } from "@/components/home/today/CircularsSection";
import { useAuth } from "@/contexts/AuthContext";
import { useCommunityFeed } from "@/hooks/queries/useCommunityFeed";
import type { TopicTag } from "@/repositories/communityPosts";

const Market = () => {
  const { user, company, hasRole, loading: authLoading } = useAuth();
  const [topic, setTopic] = useState<TopicTag | "all">("all");
  const [composeOpen, setComposeOpen] = useState(false);
  const feedQuery = useCommunityFeed(topic);

  const canEngage = Boolean(
    user &&
    company &&
    company.is_verified &&
    !company.is_hidden &&
    company.review_status === "approved",
  );
  const isAdmin = hasRole("admin");
  const posts = feedQuery.data?.posts ?? [];
  const businesses = feedQuery.data?.businesses ?? {};
  const engagement = feedQuery.data?.engagement ?? {};
  const rateUpdates = posts.filter((post) => post.post_type === "admin_rate_update");
  const communityPosts = posts.filter((post) => post.post_type !== "admin_rate_update");

  return (
    <Layout>
      <Seo
        title="Business Community — G-BAU-G"
        description="Public food-trade discussions, market signals, alerts, business updates and polls from verified businesses."
        path="/market"
        noindex
      />

      <section className="border-b border-border bg-card py-7">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 h-0.5 w-12 rounded-full bg-[hsl(var(--gold))]" aria-hidden="true" />
              <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Business Community</h1>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Public market discussion from identified businesses. Exact requirements and commercial terms belong in RFQs, quotations and private deal rooms.
              </p>
            </div>
            {canEngage && (
              <Button onClick={() => setComposeOpen(true)} className="shrink-0">
                <Plus className="mr-1 h-4 w-4" /> Publish
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-3xl px-4 pb-24 pt-4 sm:px-6 lg:px-8">
        <div className="sticky top-0 z-10 -mx-4 bg-background/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6">
          <TopicChips active={topic} onChange={setTopic} />
        </div>

        <div className="mt-4 space-y-4">
          <CircularsSection />

          {!authLoading && !canEngage && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {!user ? <LogIn className="h-5 w-5" /> : company ? <ShieldCheck className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">
                      {!user
                        ? "Read publicly, participate as a verified business"
                        : !company
                          ? "Register your business to participate"
                          : "Business review is required to participate"}
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {!user
                        ? "Anyone can read the community. Posting, comments, reactions and votes require a signed-in approved business."
                        : !company
                          ? "Community activity is attributed to a business identity rather than a personal profile."
                          : "Your business can read the feed while verification or visibility review is pending."}
                    </p>
                  </div>
                </div>
                <Button variant="outline" asChild className="shrink-0">
                  <Link to={!user ? "/login?next=%2Fmarket" : !company ? "/apply" : "/account/company"}>
                    {!user ? "Sign in" : !company ? "Register business" : "Review business status"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {rateUpdates.map((post) => {
            const metrics = engagement[post.id];
            return (
              <PinnedRatesCard
                key={post.id}
                post={post}
                likeCount={metrics?.likeCount ?? 0}
                commentCount={metrics?.commentCount ?? 0}
                viewCount={metrics?.viewCount ?? 0}
              />
            );
          })}

          {feedQuery.isLoading ? (
            Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-48 rounded-xl" />)
          ) : feedQuery.isError ? (
            <Card className="border-destructive/30">
              <CardContent className="p-8 text-center">
                <h2 className="font-semibold text-foreground">Community feed could not be loaded</h2>
                <p className="mt-1 text-sm text-muted-foreground">The new migration or generated types may still be syncing.</p>
                <Button variant="outline" className="mt-4" onClick={() => feedQuery.refetch()}>Try again</Button>
              </CardContent>
            </Card>
          ) : communityPosts.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-10 text-center">
                <Building2 className="mx-auto h-10 w-10 text-muted-foreground" />
                <h2 className="mt-3 font-semibold text-foreground">No business posts in this topic yet</h2>
                <p className="mt-1 text-sm text-muted-foreground">Verified businesses can publish useful market observations, alerts, updates and polls.</p>
              </CardContent>
            </Card>
          ) : (
            communityPosts.map((post) => {
              const metrics = engagement[post.id];
              return (
                <PostCard
                  key={post.id}
                  post={post}
                  business={businesses[post.author_id]}
                  liked={metrics?.liked ?? false}
                  likeCount={metrics?.likeCount ?? 0}
                  commentCount={metrics?.commentCount ?? 0}
                  viewCount={metrics?.viewCount ?? 0}
                  canEngage={canEngage}
                  isAdmin={isAdmin}
                />
              );
            })
          )}
        </div>
      </div>

      {canEngage && (
        <>
          <Button
            onClick={() => setComposeOpen(true)}
            className="fixed bottom-24 right-4 z-50 h-12 px-5 shadow-[0_10px_28px_-8px_hsl(var(--primary)/0.65)] sm:hidden"
          >
            <Plus className="h-5 w-5" /> Publish
          </Button>
          <ComposeSheet open={composeOpen} onOpenChange={setComposeOpen} />
        </>
      )}
    </Layout>
  );
};

export default Market;
