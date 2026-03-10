import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageSquare } from "lucide-react";

const communityCategories = [
  { name: "Market Intelligence", description: "Price trends, supply insights, harvest reports" },
  { name: "Industry News", description: "Regulations, trade policies, FSSAI updates" },
  { name: "Trade Discussions", description: "Best practices, logistics, quality standards" },
  { name: "Association Updates", description: "MDDMA announcements, events, meetings" },
];

export function CommunitySection() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-accent" />
              Latest Industry Conversations
            </h2>
            <p className="text-muted-foreground mt-1">
              From WhatsApp chaos → structured knowledge at community.mddma.com
            </p>
          </div>
          <Button variant="outline" className="hidden sm:flex" asChild>
            <a href="https://community.mddma.com" target="_blank" rel="noopener noreferrer">
              Visit Forum <ExternalLink className="ml-1.5 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {communityCategories.map((cat) => (
            <a
              key={cat.name}
              href={`https://community.mddma.com/c/${cat.name.toLowerCase().replace(/ /g, "-")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card className="bg-card border-border hover:border-accent/50 transition-colors h-full">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground mb-1">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground italic">
            ❌ No trade offers or buy requests — community is for discussion & intelligence only.
          </p>
          <Button variant="outline" size="sm" className="mt-3 sm:hidden" asChild>
            <a href="https://community.mddma.com" target="_blank" rel="noopener noreferrer">
              Visit Forum <ExternalLink className="ml-1.5 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
