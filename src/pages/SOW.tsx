import { Link } from "react-router-dom";
import { PitchSection } from "@/components/pitch/PitchSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Printer, ChevronDown, CheckCircle2, ArrowRight,
  FileText, Calendar, DollarSign, Users, Shield,
  Layers, Clock, AlertTriangle, Target, Handshake
} from "lucide-react";

const NAV_ITEMS = [
  { id: "cover", label: "Cover" },
  { id: "overview", label: "Overview" },
  { id: "scope", label: "Scope" },
  { id: "deliverables", label: "Deliverables" },
  { id: "timeline", label: "Timeline" },
  { id: "milestones", label: "Milestones" },
  { id: "payment", label: "Payment" },
  { id: "team", label: "Team" },
  { id: "terms", label: "Terms" },
];

const SOW = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur border-b border-primary-foreground/10 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
          <span className="text-primary-foreground font-bold text-sm tracking-wide">MDDMA SOW</span>
          <div className="flex gap-1 overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)} className="text-xs text-primary-foreground/70 hover:text-primary-foreground px-2 py-1 rounded transition-colors whitespace-nowrap">
                {item.label}
              </button>
            ))}
          </div>
          <Button size="sm" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => window.print()}>
            <Printer className="h-3 w-3 mr-1" /> PDF
          </Button>
        </div>
      </nav>

      {/* Cover */}
      <PitchSection id="cover" dark>
        <div className="text-center space-y-6">
          <Badge className="bg-accent text-primary font-semibold text-sm px-4 py-1">Statement of Work</Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            MDDMA<br />
            <span className="gold-gradient-text">Statement of Work</span>
          </h1>
          <p className="text-xl sm:text-2xl text-primary-foreground/70 max-w-2xl mx-auto">
            Engagement terms for the MDDMA Behavioral Trade Operating System — a controlled negotiation marketplace
          </p>
          <div className="pt-4 text-sm text-primary-foreground/50 space-y-1">
            <p>Prepared for: Mumbai Dry Fruits & Dates Merchants Association</p>
            <p>Document Version: 3.0 · April 2026</p>
          </div>
          <div className="flex gap-2 justify-center pt-2 flex-wrap print:hidden">
            <Link to="/pitch"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">← Pitch</Badge></Link>
            <Link to="/brd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">BRD →</Badge></Link>
            <Link to="/prd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">PRD →</Badge></Link>
            <Link to="/fsd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">FRD →</Badge></Link>
            <Link to="/sdd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">SDD →</Badge></Link>
            <Link to="/tsd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">TSD →</Badge></Link>
            <Link to="/mvp-canvas"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">MVP Canvas →</Badge></Link>
          </div>
          <button onClick={() => scrollTo("overview")} className="mt-8 inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </button>
        </div>
      </PitchSection>

      {/* Project Overview */}
      <PitchSection id="overview">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><FileText className="h-3 w-3 mr-1" /> Project Overview</Badge>
            <h2 className="text-4xl font-bold text-primary">Engagement Summary</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
            <p>
              This Statement of Work (SOW) defines the engagement between the development team and the Mumbai Dry Fruits & Dates Merchants Association (MDDMA) for the design, development, and deployment of a comprehensive B2B digital trade platform.
            </p>
            <p>
              This SOW defines the engagement for a <strong className="text-foreground">Behavioral Trade Operating System</strong> — a controlled negotiation marketplace with RFQ-based trade, behavioral UX design, and market intelligence signals for the Indian dry fruits industry.
            </p>
            <p className="italic text-foreground">"This platform does not expose the market — it structures and controls it."</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Calendar, label: "Duration", value: "16 Weeks" },
              { icon: DollarSign, label: "Budget", value: "₹40–60K" },
              { icon: Users, label: "Target Users", value: "350+ Members" },
              { icon: Layers, label: "Modules", value: "12 Core" },
            ].map((item) => (
              <Card key={item.label} className="text-center">
                <CardContent className="p-5 space-y-2">
                  <item.icon className="h-6 w-6 text-accent mx-auto" />
                  <p className="text-2xl font-bold text-primary">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Scope of Work */}
      <PitchSection id="scope" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Target className="h-3 w-3 mr-1" /> Scope of Work</Badge>
            <h2 className="text-4xl font-bold">What's Included</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Public-Facing Platform", items: ["Responsive homepage with hero, stats & featured sections", "Verified member directory with search & filters", "Controlled negotiation marketplace (price ranges, stock bands, RFQ)", "Broker marketplace with supply/demand tabs", "Market intelligence dashboard with signals & trends", "Community forum preview with category structure"] },
              { title: "Member Features", items: ["Role-based access (Guest, Free, Paid, Broker, Admin)", "Seller storefront with controlled product display", "Multi-seller RFQ aggregation engine", "Behavioral CRM with lead scoring (Hot/Warm/Cold)", "Price masking system for paid members", "Membership application & renewal workflow"] },
              { title: "Behavioral Intelligence Layer", items: ["Price masking logic (exact → range transformation)", "Stock band calculator (qty → High/Medium/Low/On Order)", "Market signal generator (trend direction, demand score)", "RFQ routing engine with response tracking", "Behavioral UX nudges (anchoring, social proof, urgency)", "Broker neutralization — optional facilitator positioning"] },
              { title: "Technical Delivery", items: ["React SPA with TypeScript & Tailwind CSS", "Supabase backend (Auth, DB, Storage, Functions)", "Behavioral intelligence middleware layer", "Mobile-responsive design across all pages", "Print-optimized document pages (PDF export)", "Role simulator for demo/testing purposes"] },
            ].map((group) => (
              <Card key={group.title} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-semibold text-lg text-accent">{group.title}</h3>
                  <ul className="space-y-2">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-primary-foreground/70">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Deliverables */}
      <PitchSection id="deliverables">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Layers className="h-3 w-3 mr-1" /> Deliverables</Badge>
            <h2 className="text-4xl font-bold text-primary">Key Deliverables</h2>
          </div>
          <Table className="border rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Deliverable</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Phase</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { id: "D-01", name: "Business Requirements Document (BRD)", format: "Web page + PDF", phase: "Phase 0" },
                { id: "D-02", name: "Product Requirements Document (PRD)", format: "Web page + PDF", phase: "Phase 0" },
                { id: "D-03", name: "Functional Requirements Document (FRD)", format: "Web page + PDF", phase: "Phase 0" },
                { id: "D-04", name: "Solution Design Document (SDD)", format: "Web page + PDF", phase: "Phase 0" },
                { id: "D-05", name: "Technical Specification Document (TSD)", format: "Web page + PDF", phase: "Phase 0" },
                { id: "D-06", name: "Homepage & Navigation Layout", format: "Deployed web app", phase: "Phase 1" },
                { id: "D-07", name: "Member Directory & Storefronts", format: "Deployed web app", phase: "Phase 1" },
                { id: "D-08", name: "Commodity & Broker Marketplace", format: "Deployed web app", phase: "Phase 1" },
                { id: "D-09", name: "RFQ Engine & Price Masking System", format: "Deployed web app", phase: "Phase 2" },
                { id: "D-10", name: "Behavioral CRM & Market Intelligence", format: "Deployed web app", phase: "Phase 2" },
                { id: "D-11", name: "Admin Dashboard & RBAC", format: "Deployed web app", phase: "Phase 3" },
                { id: "D-12", name: "Community Forum Integration", format: "Deployed web app", phase: "Phase 3" },
                { id: "D-13", name: "Advertising & Revenue Modules", format: "Deployed web app", phase: "Phase 3" },
                { id: "D-14", name: "UAT Sign-Off & Production Deploy", format: "Live at mddma.com", phase: "Phase 4" },
                { id: "D-15", name: "Behavioral UX Layer (anchoring, nudges, signals)", format: "Integrated in platform", phase: "Phase 2" },
              ].map((row) => (
                <TableRow key={row.id}>
                  <TableCell><Badge variant="outline" className="text-xs font-mono">{row.id}</Badge></TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.format}</TableCell>
                  <TableCell><Badge className="text-xs">{row.phase}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PitchSection>

      {/* Timeline */}
      <PitchSection id="timeline" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Calendar className="h-3 w-3 mr-1" /> Project Timeline</Badge>
            <h2 className="text-4xl font-bold">16-Week Delivery Plan</h2>
          </div>
          {/* Visual Timeline */}
          <div className="space-y-0">
            {[
              { phase: "Phase 0", weeks: "Week 1–2", title: "Discovery & Documentation", color: "bg-accent/20", items: ["Stakeholder interviews & requirements gathering", "BRD, PRD, FRD, SDD, TSD documentation", "Design system & wireframing", "Project setup & architecture decisions"] },
              { phase: "Phase 1", weeks: "Week 3–6", title: "Foundation & Core Pages", color: "bg-accent/30", items: ["Homepage with all sections", "Member directory with search & filters", "Seller storefronts with product catalogs", "Commodity marketplace & broker listings", "Navigation & responsive layout"] },
              { phase: "Phase 2", weeks: "Week 7–10", title: "Behavioral Trade System", color: "bg-accent/40", items: ["RFQ engine & multi-seller routing", "Price masking system", "Stock band & market signal generation", "Behavioral CRM with lead scoring", "Market intelligence dashboard"] },
              { phase: "Phase 3", weeks: "Week 11–14", title: "Admin, Revenue & Community", color: "bg-accent/50", items: ["Admin dashboard with RFQ analytics", "Advertising platform & management", "Community forum integration", "Behavioral UX layer (nudges, anchoring)", "Broker neutralization features"] },
              { phase: "Phase 4", weeks: "Week 15–16", title: "Testing & Launch", color: "bg-accent/60", items: ["End-to-end testing", "Performance optimization", "SEO & meta tag setup", "Production deployment", "User training & handover"] },
            ].map((p, i) => (
              <div key={p.phase} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full ${p.color} border-2 border-accent flex items-center justify-center text-xs font-bold text-accent`}>{i}</div>
                  {i < 4 && <div className="w-0.5 h-full bg-accent/20 min-h-[80px]" />}
                </div>
                <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground flex-1 mb-4">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge className="bg-accent/20 text-accent border-0">{p.phase}</Badge>
                      <span className="text-xs text-primary-foreground/50">{p.weeks}</span>
                    </div>
                    <h3 className="font-semibold text-lg">{p.title}</h3>
                    <ul className="grid sm:grid-cols-2 gap-1.5">
                      {p.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-primary-foreground/70">
                          <CheckCircle2 className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Milestones */}
      <PitchSection id="milestones">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Target className="h-3 w-3 mr-1" /> Milestones</Badge>
            <h2 className="text-4xl font-bold text-primary">Acceptance Milestones</h2>
          </div>
          <Table className="border rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead>Milestone</TableHead>
                <TableHead>Criteria</TableHead>
                <TableHead>Target Date</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { name: "M1: Documentation Complete", criteria: "All 5 documents (BRD, PRD, FRD, SDD, TSD) reviewed & approved", date: "Week 2", payment: "20%" },
                { name: "M2: Core Platform Demo", criteria: "Homepage, directory, marketplace functional with sample data", date: "Week 6", payment: "25%" },
                { name: "M3: Member Features Live", criteria: "RBAC, CRM, bidding, inquiry system working end-to-end", date: "Week 10", payment: "25%" },
                { name: "M4: Full Platform Launch", criteria: "Admin, ads, community, all modules deployed to production", date: "Week 14", payment: "20%" },
                { name: "M5: UAT & Handover", criteria: "User acceptance testing passed, training delivered, go-live", date: "Week 16", payment: "10%" },
              ].map((m) => (
                <TableRow key={m.name}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.criteria}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{m.date}</Badge></TableCell>
                  <TableCell className="text-accent font-semibold">{m.payment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PitchSection>

      {/* Payment Terms */}
      <PitchSection id="payment" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><DollarSign className="h-3 w-3 mr-1" /> Payment Terms</Badge>
            <h2 className="text-4xl font-bold">Investment Structure</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { label: "Platform Development", value: "₹40–60K", sub: "One-time development cost", detail: "Includes all 12 modules, documentation, and deployment" },
              { label: "Annual Hosting", value: "<₹30K/yr", sub: "Infrastructure & maintenance", detail: "Supabase, CDN, SSL, domain, monitoring" },
              { label: "Projected Year-1 Revenue", value: "₹42–85L", sub: "From 4 revenue streams", detail: "Membership, ads, lead packs, affiliate commissions" },
            ].map((item) => (
              <Card key={item.label} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground text-center">
                <CardContent className="p-6 space-y-2">
                  <p className="text-3xl font-bold text-accent">{item.value}</p>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-primary-foreground/50">{item.sub}</p>
                  <p className="text-xs text-primary-foreground/40 pt-1">{item.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Payment Schedule Visual */}
          <Card className="bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-semibold text-accent mb-4">Milestone-Based Payment Schedule</h3>
              <div className="flex items-center gap-1">
                {[
                  { pct: "20%", label: "Docs", w: "w-[20%]" },
                  { pct: "25%", label: "Core", w: "w-[25%]" },
                  { pct: "25%", label: "Features", w: "w-[25%]" },
                  { pct: "20%", label: "Launch", w: "w-[20%]" },
                  { pct: "10%", label: "UAT", w: "w-[10%]" },
                ].map((seg, i) => (
                  <div key={i} className={`${seg.w} text-center`}>
                    <div className={`h-8 rounded bg-accent/${20 + i * 15} flex items-center justify-center text-xs font-bold text-accent`}>
                      {seg.pct}
                    </div>
                    <p className="text-[10px] text-primary-foreground/50 mt-1">{seg.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PitchSection>

      {/* Team & Responsibilities */}
      <PitchSection id="team">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Users className="h-3 w-3 mr-1" /> Team & Responsibilities</Badge>
            <h2 className="text-4xl font-bold text-primary">RACI Matrix</h2>
          </div>
          <Table className="border rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead>Dev Team</TableHead>
                <TableHead>MDDMA Committee</TableHead>
                <TableHead>Office Staff</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { activity: "Requirements & Documentation", dev: "R", committee: "A", staff: "C" },
                { activity: "UI/UX Design & Prototyping", dev: "R/A", committee: "C", staff: "I" },
                { activity: "Frontend Development", dev: "R/A", committee: "I", staff: "I" },
                { activity: "Backend & Database Setup", dev: "R/A", committee: "I", staff: "I" },
                { activity: "Content & Data Collection", dev: "C", committee: "A", staff: "R" },
                { activity: "Member Data Entry", dev: "C", committee: "I", staff: "R" },
                { activity: "Testing & QA", dev: "R", committee: "A", staff: "C" },
                { activity: "Admin Training", dev: "R", committee: "I", staff: "A" },
                { activity: "Go-Live & Support", dev: "R", committee: "A", staff: "C" },
              ].map((row) => (
                <TableRow key={row.activity}>
                  <TableCell className="font-medium">{row.activity}</TableCell>
                  <TableCell><Badge className="text-xs bg-accent/20 text-accent border-0">{row.dev}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{row.committee}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{row.staff}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs text-muted-foreground text-center">R = Responsible, A = Accountable, C = Consulted, I = Informed</p>
        </div>
      </PitchSection>

      {/* Terms & Conditions */}
      <PitchSection id="terms" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Handshake className="h-3 w-3 mr-1" /> Terms & Conditions</Badge>
            <h2 className="text-4xl font-bold">Engagement Terms</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Intellectual Property", items: ["All source code delivered becomes MDDMA property upon final payment", "Third-party libraries remain under their respective open-source licenses", "Design assets and content created specifically for this project transfer to MDDMA"] },
              { title: "Change Management", items: ["Scope changes require written approval from both parties", "Changes affecting timeline or budget will be documented as amendments", "Minor UI adjustments within existing scope are included at no extra cost"] },
              { title: "Warranty & Support", items: ["30-day bug-fix warranty post-launch for critical/high severity issues", "Post-warranty support available at agreed hourly/monthly rates", "Documentation and training materials provided for self-service admin"] },
              { title: "Confidentiality", items: ["Member data and business information treated as confidential", "No member data shared with third parties without written consent", "Development team signs NDA covering association business details"] },
            ].map((group) => (
              <Card key={group.title} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-semibold text-accent">{group.title}</h3>
                  <ul className="space-y-2">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-primary-foreground/70">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center pt-6 space-y-4">
            <p className="text-primary-foreground/50 text-sm">Related Documents</p>
            <div className="flex gap-3 justify-center flex-wrap print:hidden">
              <Link to="/pitch"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">← Pitch</Button></Link>
              <Link to="/brd"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">BRD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
              <Link to="/prd"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">PRD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
              <Link to="/fsd"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">FRD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
              <Link to="/sdd"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">SDD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
              <Link to="/tsd"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">TSD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
              <Link to="/mvp-canvas"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">MVP Canvas <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
            </div>
          </div>
        </div>
      </PitchSection>

      <style>{`
        @media print {
          nav, .print\\:hidden { display: none !important; }
          section { page-break-inside: avoid; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
};

export default SOW;
