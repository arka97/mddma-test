import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { committeeMembers, presidentMessage } from "@/data/sampleData";
import { Quote, Calendar, Award, Target, Users, BookOpen } from "lucide-react";

const milestones = [
  { year: "1930s", title: "Foundation", description: "MDDMA established to represent Mumbai's dry fruits & dates trade community." },
  { year: "1960s", title: "Growth Era", description: "Membership crosses 100 traders. Association gains recognition from APMC." },
  { year: "1980s", title: "Market Expansion", description: "Members expand across Vashi, Masjid Bunder, Crawford Market and Dadar." },
  { year: "2000s", title: "Government Liaison", description: "Active role in GST transition, FSSAI compliance and import policy advocacy." },
  { year: "2020s", title: "Digital Transformation", description: "Launch of digital platform, online directory and expo lead intelligence portal." },
];

const objectives = [
  "Represent and protect the interests of dry fruits and dates merchants",
  "Facilitate trade dispute resolution through fair arbitration",
  "Liaise with government bodies on trade policies and regulations",
  "Provide market intelligence and trade data to members",
  "Promote quality standards and best practices in trade",
  "Foster networking and brotherhood among merchants",
];

const About = () => {
  return (
    <Layout>
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            About MDDMA
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Mumbai Dry Fruits & Dates Merchants Association — 95 years of serving Mumbai's trade community
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-2xl font-bold text-primary mb-8 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-accent" /> Our History
          </h2>
          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                    {m.year.slice(0, 4)}
                  </div>
                  {i < milestones.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
                </div>
                <div className="pb-6">
                  <h3 className="font-semibold text-foreground">{m.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-2xl font-bold text-primary mb-8 flex items-center gap-2">
            <Target className="h-6 w-6 text-accent" /> Our Objectives
          </h2>
          <div className="space-y-3">
            {objectives.map((obj) => (
              <div key={obj} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                <Award className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Committee */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-2xl font-bold text-primary mb-8 flex items-center gap-2">
            <Users className="h-6 w-6 text-accent" /> Our Committee
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {committeeMembers.map((member) => (
              <Card key={member.id} className="bg-card border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                    {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{member.name}</div>
                    <div className="text-xs text-accent font-medium">{member.designation}</div>
                    <div className="text-xs text-muted-foreground">{member.firmName}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* President's Message */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-2xl font-bold text-primary mb-8 flex items-center gap-2">
            <Quote className="h-6 w-6 text-accent" /> President's Message
          </h2>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <blockquote className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
                {presidentMessage.message}
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  RS
                </div>
                <div>
                  <div className="font-semibold text-foreground">{presidentMessage.name}</div>
                  <div className="text-xs text-muted-foreground">{presidentMessage.designation}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default About;
