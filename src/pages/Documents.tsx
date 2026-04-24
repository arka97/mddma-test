import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight, Sparkles } from "lucide-react";

const DOCS = [
  { label: "Sales Pitch", to: "/pitch", desc: "Committee presentation deck with ROI projections and platform overview" },
  { label: "Statement of Work", to: "/sow", desc: "Engagement terms, deliverables, timeline, and payment schedule" },
  { label: "Business Requirements", to: "/brd", desc: "Strategic goals, market control strategy, and business requirements" },
  { label: "Product Requirements", to: "/prd", desc: "User personas, stories, behavioral UX layer, and feature specifications" },
  { label: "Functional Requirements", to: "/fsd", desc: "Detailed functional specs for every module including RFQ engine" },
  { label: "Solution Design", to: "/sdd", desc: "System architecture, behavioral intelligence layer, and data models" },
  { label: "Technical Specification", to: "/tsd", desc: "Tech stack, component hierarchy, routing, and deployment details" },
  { label: "MVP Canvas", to: "/mvp-canvas", desc: "Lean canvas defining problem, solution, metrics, and unfair advantage" },
];

const Documents = () => {
  return (
    <div className="min-h-screen bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-6 py-20 space-y-10">
        <div className="text-center space-y-4">
          <Badge className="bg-accent text-primary font-semibold text-sm px-4 py-1">v3.1 · April 2026</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            MDDMA <span className="gold-gradient-text">Document Suite</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-xl mx-auto">
            "This platform does not expose the market — it structures and controls it."
          </p>
        </div>

        {/* Featured: Change Log v3.1 */}
        <Link to="/changelog">
          <Card className="bg-accent/15 border-accent text-primary-foreground card-hover">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-accent text-primary flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-lg">Locked Decisions Change Log</h3>
                  <Badge className="bg-accent text-primary text-xs">v3.1 · supersedes v3.0</Badge>
                </div>
                <p className="text-sm text-primary-foreground/70">
                  Source of truth: locked strategic, technical, and product decisions. Read this first.
                  Includes implementation status, gap register, and behavioral design layer.
                </p>
                <span className="inline-flex items-center gap-1 text-accent text-sm font-medium pt-1">
                  Open change log <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
              Historical v3.0 Documents
            </h2>
            <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 text-xs">
              superseded
            </Badge>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {DOCS.map((doc) => (
              <Link key={doc.to} to={doc.to}>
                <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground card-hover h-full">
                  <CardContent className="p-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-accent" />
                      <h3 className="font-semibold">{doc.label}</h3>
                    </div>
                    <p className="text-sm text-primary-foreground/60">{doc.desc}</p>
                    <span className="inline-flex items-center gap-1 text-accent text-sm font-medium">
                      Open <ArrowRight className="h-3 w-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;

