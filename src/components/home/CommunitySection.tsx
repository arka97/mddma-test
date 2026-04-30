import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MessageSquare, Eye, Loader2 } from "lucide-react";
import { listPosts, type PostRow } from "@/repositories/posts";

export function CommunitySection() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    listPosts()
      .then((rows) => {
        if (!alive) return;
        setPosts(rows.slice(0, 4));
      })
      .catch(() => {
        if (alive) setPosts([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

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

        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-accent" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground text-sm mb-3">
              No discussions yet. Be the first to start a conversation.
            </p>
            <Link to="/community" className="text-accent hover:text-accent/80 text-sm font-medium">
              Open Community →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <Link key={post.id} to="/community">
                <Card className="bg-card border-border hover:border-accent/50 card-hover h-full">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2">{post.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{post.category}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.view_count}</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {new Date(post.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
