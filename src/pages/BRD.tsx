import { Link } from "react-router-dom";
import { PitchSection } from "@/components/pitch/PitchSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Printer, ChevronDown, CheckCircle2, ArrowRight,
  Target, Users, ShoppingBag, BarChart3, Megaphone,
  AlertTriangle, Shield, FileText, TrendingUp, Clock
} from "lucide-react";

const NAV_ITEMS = [
  { id: "cover", label: "Cover" },
  { id: "summary", label: "Summary" },
  { id: "objectives", label: "Objectives" },
  { id: "scope", label: "Scope" },
  { id: "stakeholders", label: "Stakeholders" },
  { id: "requirements", label: "Requirements" },
  { id: "success", label: "Success Criteria" },
  { id: "constraints", label: "Constraints" },
  { id: "risks", label: "Risks" },
];

const BRD = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Sticky nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur border-b border-primary-foreground/10 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
          <span className="text-primary-foreground font-bold text-sm tracking-wide">MDDMA BRD</span>
          <div className="flex gap-1 overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-xs text-primary-foreground/70 hover:text-primary-foreground px-2 py-1 rounded transition-colors whitespace-nowrap"
              >
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
          <Badge className="bg-accent text-primary font-semibold text-sm px-4 py-1">Business Requirements Document</Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            MDDMA<br />
            <span className="gold-gradient-text">Digital Platform</span>
          </h1>
          <p className="text-xl sm:text-2xl text-primary-foreground/70 max-w-2xl mx-auto">
            Business Requirements Document for the digital transformation of Mumbai's premier dry fruits & dates trade association
          </p>
          <div className="pt-4 text-sm text-primary-foreground/50 space-y-1">
            <p>Prepared for: Mumbai Dry Fruits & Dates Merchants Association</p>
            <p>Document Version: 1.0 · March 2026</p>
          </div>
          <div className="flex gap-3 justify-center pt-2 print:hidden">
            <Link to="/fsd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">FSD →</Badge></Link>
            <Link to="/tsd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">TSD →</Badge></Link>
          </div>
          <button onClick={() => scrollTo("summary")} className="mt-8 inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </button>
        </div>
      </PitchSection>

      {/* Executive Summary */}
      <PitchSection id="summary">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><FileText className="h-3 w-3 mr-1" /> Executive Summary</Badge>
            <h2 className="text-4xl font-bold text-primary">Why Digital Transformation?</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
            <p>
              The Mumbai Dry Fruits & Dates Merchants Association (MDDMA), with a 95+ year legacy, represents 350+ wholesale and retail businesses in one of India's oldest commodity markets. Despite its market prominence, the association's digital presence is outdated and non-functional.
            </p>
            <p>
              This document outlines the business requirements for a modern digital platform that will serve as the association's primary online presence — enabling member discovery, product cataloging, lead intelligence, advertising revenue, and streamlined membership management.
            </p>
            <p>
              The platform aims to transform MDDMA from a traditional trade body into a digitally empowered network, generating new revenue streams while significantly improving member services and buyer accessibility.
            </p>
          </div>
        </div>
      </PitchSection>

      {/* Business Objectives */}
      <PitchSection id="objectives" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Target className="h-3 w-3 mr-1" /> Business Objectives</Badge>
            <h2 className="text-4xl font-bold">Strategic Goals</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Users, title: "Increase Member Engagement", desc: "Provide a digital home for members to manage profiles, discover leads, and stay connected with association activities through circulars and announcements." },
              { icon: TrendingUp, title: "Generate Digital Revenue", desc: "Create four new revenue streams — membership tiers, advertising placements, lead intelligence packs, and affiliate commissions — targeting ₹42–85L annually." },
              { icon: Shield, title: "Modernize Operations", desc: "Replace paper-based membership applications, renewals, and circular distribution with online workflows, reducing administrative burden and improving efficiency." },
              { icon: BarChart3, title: "Improve Discoverability", desc: "Make 350+ verified member businesses searchable online, enabling domestic and international buyers to find MDDMA traders through search engines and direct browsing." },
            ].map((item) => (
              <Card key={item.title} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <CardContent className="p-6 space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-primary-foreground/70">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Scope */}
      <PitchSection id="scope">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm">Project Scope</Badge>
            <h2 className="text-4xl font-bold text-primary">In-Scope & Out-of-Scope</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-accent/30">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" /> In-Scope
                </h3>
                {[
                  "Verified member directory with search & filters",
                  "Product discovery catalog with 25+ categories",
                  "Lead intelligence portal (expo databases)",
                  "Advertising & banner management system",
                  "Admin dashboard for office staff",
                  "Online membership application & renewal",
                  "Circular/announcement distribution",
                  "SEO-optimized public pages",
                  "Mobile-responsive design",
                  "Print-friendly pages & PDF export",
                ].map((item) => (
                  <div key={item} className="flex gap-2 items-start">
                    <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-destructive/30">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" /> Out-of-Scope
                </h3>
                {[
                  "E-commerce / direct product sales",
                  "Payment gateway for product transactions",
                  "Native mobile applications (iOS/Android)",
                  "ERP or accounting system integration",
                  "Multi-language support (Phase 1)",
                  "Real-time chat or messaging system",
                  "Logistics or shipment tracking",
                  "Third-party marketplace integration",
                ].map((item) => (
                  <div key={item} className="flex gap-2 items-start">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </PitchSection>

      {/* Stakeholders */}
      <PitchSection id="stakeholders" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Users className="h-3 w-3 mr-1" /> Stakeholders</Badge>
            <h2 className="text-4xl font-bold">Key Stakeholders</h2>
          </div>
          <Table className="border border-primary-foreground/20 rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow className="border-primary-foreground/20 hover:bg-transparent">
                <TableHead className="text-primary-foreground/70">Stakeholder</TableHead>
                <TableHead className="text-primary-foreground/70">Role</TableHead>
                <TableHead className="text-primary-foreground/70">Interest</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { who: "MDDMA Committee", role: "Decision Maker & Sponsor", interest: "Revenue generation, member satisfaction, modernization of association" },
                { who: "Office Staff", role: "Day-to-day Operator", interest: "Simplified admin workflows, reduced manual effort, easy content management" },
                { who: "Member Businesses", role: "Primary User", interest: "Online visibility, lead access, verified profiles, buyer connections" },
                { who: "Buyers & Trade Partners", role: "External User", interest: "Finding verified suppliers, product discovery, direct contact with traders" },
                { who: "Advertisers", role: "Revenue Contributor", interest: "Targeted exposure to MDDMA's captive audience of traders and buyers" },
              ].map((row) => (
                <TableRow key={row.who} className="border-primary-foreground/10 hover:bg-primary-foreground/5">
                  <TableCell className="font-medium text-primary-foreground">{row.who}</TableCell>
                  <TableCell className="text-primary-foreground/70 text-sm">{row.role}</TableCell>
                  <TableCell className="text-primary-foreground/70 text-sm">{row.interest}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PitchSection>

      {/* Business Requirements */}
      <PitchSection id="requirements">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><FileText className="h-3 w-3 mr-1" /> Business Requirements</Badge>
            <h2 className="text-4xl font-bold text-primary">Detailed Requirements</h2>
          </div>
          <div className="space-y-6">
            {[
              { module: "Member Management", icon: Users, items: [
                { id: "BR-001", req: "System shall maintain a searchable directory of all registered MDDMA members" },
                { id: "BR-002", req: "Each member profile shall display company name, logo, contact info, products, and verification badges" },
                { id: "BR-003", req: "Members shall be categorizable as featured or sponsored with elevated visibility" },
                { id: "BR-004", req: "System shall support member search by name, product, location, and membership tier" },
              ]},
              { module: "Product Catalog", icon: ShoppingBag, items: [
                { id: "BR-005", req: "Platform shall display 25+ product categories with detailed variant information" },
                { id: "BR-006", req: "Each product page shall show verified sellers, packaging formats, and affiliate retail links" },
                { id: "BR-007", req: "Products shall be searchable and filterable by category, origin, and available variants" },
              ]},
              { module: "Lead Intelligence", icon: BarChart3, items: [
                { id: "BR-008", req: "System shall offer curated expo exhibitor databases as purchasable lead packs" },
                { id: "BR-009", req: "Lead packs shall include exhibitor count, expo details, price, and preview samples" },
                { id: "BR-010", req: "Different pricing shall apply for MDDMA members vs non-members" },
              ]},
              { module: "Advertising", icon: Megaphone, items: [
                { id: "BR-011", req: "Platform shall support banner advertisements on homepage and directory pages" },
                { id: "BR-012", req: "Ad placements shall be manageable with scheduling, rotation, and click tracking" },
                { id: "BR-013", req: "Sponsored listings shall be available in member directory and product catalog" },
              ]},
              { module: "Membership Workflows", icon: Shield, items: [
                { id: "BR-014", req: "System shall provide an online membership application form with document upload" },
                { id: "BR-015", req: "Three membership tiers (Silver, Gold, Platinum) with distinct benefits and pricing" },
                { id: "BR-016", req: "Membership renewal reminders and online renewal workflow shall be supported" },
              ]},
            ].map((group) => (
              <Card key={group.module}>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <group.icon className="h-5 w-5 text-accent" /> {group.module}
                  </h3>
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <div key={item.id} className="flex gap-3 items-start">
                        <Badge variant="outline" className="text-xs font-mono shrink-0 mt-0.5">{item.id}</Badge>
                        <span className="text-sm text-muted-foreground">{item.req}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Success Criteria */}
      <PitchSection id="success" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Target className="h-3 w-3 mr-1" /> Success Criteria</Badge>
            <h2 className="text-4xl font-bold">Key Performance Indicators</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { kpi: "Member Profiles Online", target: "350+", period: "Within 3 months of launch" },
              { kpi: "New Member Signups", target: "50+", period: "First 6 months" },
              { kpi: "Monthly Page Views", target: "10,000+", period: "By month 6" },
              { kpi: "Advertising Revenue", target: "₹10L+", period: "Year 1" },
              { kpi: "Lead Pack Sales", target: "₹5L+", period: "Year 1" },
              { kpi: "Total Digital Revenue", target: "₹42–85L", period: "Year 1 combined" },
            ].map((item) => (
              <Card key={item.kpi} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground text-center">
                <CardContent className="p-5 space-y-2">
                  <p className="text-3xl font-bold text-accent">{item.target}</p>
                  <p className="font-medium text-sm">{item.kpi}</p>
                  <p className="text-xs text-primary-foreground/50">{item.period}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Constraints & Assumptions */}
      <PitchSection id="constraints">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm">Constraints & Assumptions</Badge>
            <h2 className="text-4xl font-bold text-primary">Planning Parameters</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-primary">Constraints</h3>
                {[
                  "Total budget for Phase 1 development: ₹40–60K",
                  "Annual hosting & maintenance budget: <₹30K",
                  "Platform must launch within 3–4 months",
                  "Office staff has limited technical expertise",
                  "No existing digital member database — data entry required",
                ].map((c) => (
                  <div key={c} className="flex gap-2 items-start">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{c}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-primary">Assumptions</h3>
                {[
                  "Committee will approve digital transformation initiative",
                  "Member data (names, contacts, products) can be collected within 4 weeks",
                  "Office staff will be trained to manage admin panel",
                  "Members will adopt digital profiles when provided with support",
                  "Advertisers from the existing network will participate in digital ads",
                ].map((a) => (
                  <div key={a} className="flex gap-2 items-start">
                    <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{a}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </PitchSection>

      {/* Risks */}
      <PitchSection id="risks" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><AlertTriangle className="h-3 w-3 mr-1" /> Risk Assessment</Badge>
            <h2 className="text-4xl font-bold">Identified Risks</h2>
          </div>
          <Table className="border border-primary-foreground/20 rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow className="border-primary-foreground/20 hover:bg-transparent">
                <TableHead className="text-primary-foreground/70">Risk</TableHead>
                <TableHead className="text-primary-foreground/70">Impact</TableHead>
                <TableHead className="text-primary-foreground/70">Likelihood</TableHead>
                <TableHead className="text-primary-foreground/70">Mitigation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { risk: "Low Member Adoption", impact: "High", likelihood: "Medium", mitigation: "Provide onboarding support, showcase benefits through pilot members" },
                { risk: "Data Migration Delays", impact: "Medium", likelihood: "High", mitigation: "Start data collection early, provide Excel templates for bulk upload" },
                { risk: "Committee Buy-in Resistance", impact: "High", likelihood: "Low", mitigation: "Present ROI projections, demo working prototype, phased approach" },
                { risk: "Technical Complexity", impact: "Medium", likelihood: "Low", mitigation: "Use proven tech stack, modular architecture, phased rollout" },
                { risk: "Advertising Revenue Shortfall", impact: "Medium", likelihood: "Medium", mitigation: "Start with existing advertiser relationships, offer introductory rates" },
              ].map((row) => (
                <TableRow key={row.risk} className="border-primary-foreground/10 hover:bg-primary-foreground/5">
                  <TableCell className="font-medium text-primary-foreground">{row.risk}</TableCell>
                  <TableCell><Badge variant={row.impact === "High" ? "destructive" : "outline"} className={row.impact !== "High" ? "border-primary-foreground/30 text-primary-foreground/70" : ""}>{row.impact}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70">{row.likelihood}</Badge></TableCell>
                  <TableCell className="text-primary-foreground/70 text-sm">{row.mitigation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="text-center pt-6 space-y-4">
            <p className="text-primary-foreground/50 text-sm">Related Documents</p>
            <div className="flex gap-3 justify-center print:hidden">
              <Link to="/fsd"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">Functional Spec (FSD) <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
              <Link to="/tsd"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">Technical Spec (TSD) <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
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

export default BRD;
