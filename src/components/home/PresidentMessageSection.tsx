import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { presidentMessage, committeeMembers } from "@/data/sampleData";

export function PresidentMessageSection() {
  const president = committeeMembers.find((m) => m.designation === "President");

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          {/* Message Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Quote className="h-4 w-4" />
              President's Message
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
              A Message from Our President
            </h2>
            <Card className="bg-muted/50 border-none">
              <CardContent className="p-6">
                <blockquote className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {presidentMessage.message}
                </blockquote>
                <div className="mt-6 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {presidentMessage.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {presidentMessage.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {presidentMessage.designation}
                    </div>
                    <div className="text-xs text-accent">
                      {presidentMessage.since}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Committee Preview */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-6">
              Our Committee
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {committeeMembers.slice(0, 6).map((member) => (
                <Card
                  key={member.id}
                  className="bg-card border-border hover:border-accent/30 transition-colors"
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                      {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-foreground text-sm truncate">
                        {member.name}
                      </div>
                      <div className="text-xs text-accent font-medium">
                        {member.designation}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {member.firmName}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {committeeMembers.length > 6 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                + {committeeMembers.length - 6} more committee members
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
