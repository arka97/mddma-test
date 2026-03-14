import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MessageSquare, Eye } from "lucide-react";
import { communityPosts } from "@/data/productListings";

export function CommunitySection() {
  const topPosts = communityPosts
    .filter((p) => p.category === "Market Updates")
    .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))
    .slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
              Latest Industry Conversations
            </h2>
            <p className="text-muted-foreground">
              Market intelligence and trade discussions from the MDDMA community
            </p>
          </div>
          <Link to="/community" className="inline-flex items-center text-accent hover:text-accent/80 font-medium text-sm whitespace-nowrap">
            Visit Community <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {topPosts.map((post) => (
            <Link key={post.id} to="/community">
              <Card className="bg-card border-border hover:border-accent/50 card-hover h-full">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2">{post.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{post.author} · {post.authorCompany}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{post.replies}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.views}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
