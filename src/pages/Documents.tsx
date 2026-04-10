import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, FileText, ArrowRight, ShieldCheck } from "lucide-react";

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

const CORRECT_PASSWORD = "27/11/95";

const Documents = () => {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-6">
        <Card className="w-full max-w-md bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
          <CardContent className="p-8 space-y-6 text-center">
            <Lock className="h-12 w-12 text-accent mx-auto" />
            <div>
              <h1 className="text-2xl font-bold">Document Vault</h1>
              <p className="text-sm text-primary-foreground/60 mt-1">Enter password to access project documents</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 text-center text-lg"
              />
              {error && <p className="text-destructive text-sm">Incorrect password. Try again.</p>}
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold">
                <ShieldCheck className="h-4 w-4 mr-2" /> Unlock Documents
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-6 py-20 space-y-10">
        <div className="text-center space-y-4">
          <Badge className="bg-accent text-primary font-semibold text-sm px-4 py-1">v3.0 · April 2026</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            MDDMA <span className="gold-gradient-text">Document Suite</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-xl mx-auto">
            "This platform does not expose the market — it structures and controls it."
          </p>
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
  );
};

export default Documents;
