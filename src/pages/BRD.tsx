import { Link } from "react-router-dom";
import { PitchSection } from "@/components/pitch/PitchSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Printer, ChevronDown, CheckCircle2, ArrowRight,
  Target, Users, ShoppingBag, BarChart3, Megaphone,
  AlertTriangle, Shield, FileText, TrendingUp, Clock,
  Gavel, MessageSquare, Briefcase, UserCheck
} from "lucide-react";

const NAV_ITEMS = [
  { id: "cover", label: "Cover" },
  { id: "summary", label: "Summary" },
  { id: "objectives", label: "Objectives" },
  { id: "scope", label: "Scope" },
  { id: "stakeholders", label: "Stakeholders" },
  { id: "roles", label: "Roles" },
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur border-b border-primary-foreground/10 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
          <span className="text-primary-foreground font-bold text-sm tracking-wide">MDDMA BRD</span>
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
          <Badge className="bg-accent text-primary font-semibold text-sm px-4 py-1">Business Requirements Document</Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            MDDMA<br />
            <span className="gold-gradient-text">Digital Platform</span>
          </h1>
          <p className="text-xl sm:text-2xl text-primary-foreground/70 max-w-2xl mx-auto">
            Business Requirements for India's premier B2B digital trade hub for dry fruits & commodities
          </p>
          <div className="pt-4 text-sm text-primary-foreground/50 space-y-1">
            <p>Prepared for: Mumbai Dry Fruits & Dates Merchants Association</p>
            <p>Document Version: 2.0 · March 2026</p>
          </div>
          <div className="flex gap-3 justify-center pt-2 print:hidden">
            <Link to="/sow"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">← SOW</Badge></Link>
            <Link to="/prd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">PRD →</Badge></Link>
            <Link to="/fsd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">FRD →</Badge></Link>
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
              This document outlines the business requirements for a <strong className="text-foreground">comprehensive B2B digital trade platform</strong> — a hybrid of IndiaMART, Alibaba, and LinkedIn — that will enable member discovery, commodity marketplace, broker networking, lead intelligence, trade bidding, community discussions, and advertising revenue.
            </p>
            <p>
              The platform will transform MDDMA from a traditional trade body into a digitally empowered network, generating ₹42–85L in new annual revenue while modernizing member services and buyer accessibility.
            </p>
          </div>
          {/* Platform Stats Visual */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { stat: "95+", label: "Years Legacy" },
              { stat: "350+", label: "Member Businesses" },
              { stat: "₹1,000 Cr", label: "Annual Trade Volume" },
              { stat: "25+", label: "Commodity Categories" },
            ].map((s) => (
              <Card key={s.label} className="text-center border-accent/20">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold text-accent">{s.stat}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Member Engagement", desc: "Provide a digital home for members — storefronts, CRM dashboards, lead management, and community discussions." },
              { icon: TrendingUp, title: "Digital Revenue", desc: "Create 4 revenue streams: membership tiers, advertising, lead intelligence packs, and affiliate commissions — targeting ₹42–85L/yr." },
              { icon: Shield, title: "Modernize Operations", desc: "Replace paper-based workflows with online membership applications, renewals, circulars, and admin dashboards." },
              { icon: BarChart3, title: "Buyer Discoverability", desc: "Make 350+ verified businesses searchable online by domestic and international buyers through SEO and directories." },
              { icon: Gavel, title: "Enable B2B Trading", desc: "Build a commodity marketplace with product bidding, RFQ mode, and broker matching for supply-demand deals." },
              { icon: MessageSquare, title: "Structured Community", desc: "Move WhatsApp chaos to community.mddma.com — a Discourse-powered knowledge network for market intelligence." },
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
                  "Seller storefronts with product catalogs",
                  "Commodity marketplace with 25+ categories",
                  "Broker marketplace (supply/demand board)",
                  "Product bidding system across storefronts",
                  "Lead CRM with pipeline management",
                  "Market intelligence with price trends",
                  "Trade community integration (Discourse)",
                  "5-role RBAC (Guest, Free, Paid, Broker, Admin)",
                  "Admin dashboard with analytics",
                  "Advertising platform & management",
                  "Membership application, tiers & renewal",
                  "Circular/announcement distribution",
                  "SEO, mobile-responsive, print-optimized",
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
                  "E-commerce / direct product sales with cart",
                  "Payment gateway for product transactions",
                  "Native mobile applications (iOS/Android)",
                  "ERP or accounting system integration",
                  "Multi-language support (Phase 1)",
                  "Real-time chat or messaging system",
                  "Logistics or shipment tracking",
                  "Third-party marketplace integration",
                  "Automated pricing / algorithmic trading",
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
                { who: "Free Members", role: "Basic Platform User", interest: "Online visibility, storefront, basic lead management, buyer connections" },
                { who: "Paid Members", role: "Premium User", interest: "Priority listings, RFQ mode, expo lead packs, advanced CRM features" },
                { who: "Brokers", role: "Marketplace Participant", interest: "Posting supply/demand, connecting buyers & sellers, commission opportunities" },
                { who: "Buyers & Trade Partners", role: "External User", interest: "Finding verified suppliers, product discovery, bidding, direct contact" },
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

      {/* User Roles Visual */}
      <PitchSection id="roles">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><UserCheck className="h-3 w-3 mr-1" /> User Roles</Badge>
            <h2 className="text-4xl font-bold text-primary">Role-Based Access Control</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Users, role: "Guest", color: "border-muted", features: ["Browse directory", "View commodities", "Send inquiries (WhatsApp)", "View broker board", "Apply for membership"] },
              { icon: UserCheck, role: "Free Member", color: "border-accent/30", features: ["Everything Guest gets", "Seller storefront", "Product listings (with price)", "Basic CRM dashboard", "Receive circulars"] },
              { icon: Shield, role: "Paid Member", color: "border-accent", features: ["Everything Free gets", "RFQ mode (hide price)", "Priority directory listing", "Advanced CRM features", "Expo lead pack access"] },
              { icon: Briefcase, role: "Broker", color: "border-accent/50", features: ["Browse & search all", "Post supply offers", "Post buyer requirements", "Broker CRM dashboard", "Match deals & negotiate"] },
              { icon: Target, role: "Admin", color: "border-destructive/50", features: ["Full platform access", "Member approvals & moderation", "Publish circulars", "Manage ads & revenue", "Platform analytics"] },
            ].map((r) => (
              <Card key={r.role} className={`${r.color}`}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                      <r.icon className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="font-semibold">{r.role}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {r.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Business Requirements */}
      <PitchSection id="requirements" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><FileText className="h-3 w-3 mr-1" /> Business Requirements</Badge>
            <h2 className="text-4xl font-bold">Detailed Requirements</h2>
          </div>
          <div className="space-y-6">
            {[
              { module: "Member Directory & Storefronts", icon: Users, items: [
                { id: "BR-001", req: "System shall maintain a searchable directory of all registered MDDMA members with filters for product, location, tier, and business type" },
                { id: "BR-002", req: "Each member profile shall display company info, logo, contact details, products, certifications, and verification badges" },
                { id: "BR-003", req: "Free/Paid members shall have seller storefronts with product catalog tables showing price, MOQ, packaging, and origin" },
                { id: "BR-004", req: "Members shall be categorizable as featured or sponsored with elevated visibility in directory" },
              ]},
              { module: "Commodity Marketplace", icon: ShoppingBag, items: [
                { id: "BR-005", req: "Platform shall display 25+ product categories with detailed variant information and origin details" },
                { id: "BR-006", req: "Free members show prices; Paid members can hide prices and show 'Request Quote' (RFQ mode)" },
                { id: "BR-007", req: "Products shall be filterable by commodity, origin, price range, MOQ, and seller location" },
                { id: "BR-008", req: "Each product page shall show verified sellers, packaging formats, and affiliate retail links" },
              ]},
              { module: "Bidding & Trading", icon: Gavel, items: [
                { id: "BR-009", req: "Buyers shall be able to place bids on products across multiple member storefronts" },
                { id: "BR-010", req: "Bid submissions shall capture quantity, target price, and delivery timeline" },
                { id: "BR-011", req: "Sellers shall be able to accept, counter, or decline bids from their CRM dashboard" },
              ]},
              { module: "Broker Marketplace", icon: Briefcase, items: [
                { id: "BR-012", req: "Brokers shall be able to post supply offers and buyer requirements on a two-tab marketplace" },
                { id: "BR-013", req: "Each broker listing shall show commodity, quantity, location, and broker contact details" },
              ]},
              { module: "Lead Intelligence & CRM", icon: BarChart3, items: [
                { id: "BR-014", req: "System shall offer curated expo exhibitor databases as purchasable lead packs with member/non-member pricing" },
                { id: "BR-015", req: "Members shall have a CRM dashboard with pipeline stages: New → Contacted → Negotiation → Converted" },
                { id: "BR-016", req: "Market intelligence page shall display price trend charts, origin comparisons, and supply-demand signals" },
              ]},
              { module: "Community & Communication", icon: MessageSquare, items: [
                { id: "BR-017", req: "Platform shall integrate with Discourse community (community.mddma.com) for structured industry discussions" },
                { id: "BR-018", req: "Community categories: Market Intelligence, Industry News, Trade Discussions, Association Updates, Events, Social" },
                { id: "BR-019", req: "Community shall NOT allow trade offers or buy requests — all trading happens on the main platform marketplace" },
                { id: "BR-020", req: "Homepage shall show 'Latest Industry Conversations' from the community; product pages shall show related discussions" },
              ]},
              { module: "Advertising & Membership", icon: Megaphone, items: [
                { id: "BR-021", req: "Platform shall support rotating banner ads with scheduling, click tracking, and placement management" },
                { id: "BR-022", req: "Three membership tiers (Silver ₹5K, Gold ₹15K, Platinum ₹30K) with distinct benefits and pricing" },
                { id: "BR-023", req: "Online membership application with document upload, status tracking, and renewal workflow" },
              ]},
            ].map((group) => (
              <Card key={group.module} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-accent">
                    <group.icon className="h-5 w-5" /> {group.module}
                  </h3>
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <div key={item.id} className="flex gap-3 items-start">
                        <Badge variant="outline" className="text-xs font-mono shrink-0 mt-0.5 border-primary-foreground/30 text-primary-foreground/70">{item.id}</Badge>
                        <span className="text-sm text-primary-foreground/70">{item.req}</span>
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
      <PitchSection id="success">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Target className="h-3 w-3 mr-1" /> Success Criteria</Badge>
            <h2 className="text-4xl font-bold text-primary">Key Performance Indicators</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { kpi: "Member Profiles Online", target: "350+", period: "Within 3 months of launch" },
              { kpi: "New Member Signups", target: "50+", period: "First 6 months" },
              { kpi: "Monthly Page Views", target: "10,000+", period: "By month 6" },
              { kpi: "Trade Inquiries/Month", target: "200+", period: "By month 6" },
              { kpi: "Bidding Transactions", target: "50+/month", period: "By month 9" },
              { kpi: "Community Members", target: "500+", period: "By month 6" },
              { kpi: "Advertising Revenue", target: "₹10L+", period: "Year 1" },
              { kpi: "Lead Pack Sales", target: "₹5L+", period: "Year 1" },
              { kpi: "Total Digital Revenue", target: "₹42–85L", period: "Year 1 combined" },
            ].map((item) => (
              <Card key={item.kpi} className="text-center border-accent/20">
                <CardContent className="p-5 space-y-2">
                  <p className="text-3xl font-bold text-accent">{item.target}</p>
                  <p className="font-medium text-sm">{item.kpi}</p>
                  <p className="text-xs text-muted-foreground">{item.period}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Constraints & Assumptions */}
      <PitchSection id="constraints" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm">Constraints & Assumptions</Badge>
            <h2 className="text-4xl font-bold">Planning Parameters</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-accent">Constraints</h3>
                {[
                  "Total budget for Phase 1 development: ₹40–60K",
                  "Annual hosting & maintenance budget: <₹30K",
                  "Platform must launch MVP within 16 weeks",
                  "Office staff has limited technical expertise",
                  "No existing digital member database — data entry required",
                  "Community forum requires separate Discourse hosting",
                ].map((c) => (
                  <div key={c} className="flex gap-2 items-start">
                    <Clock className="h-4 w-4 text-primary-foreground/50 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-primary-foreground/70">{c}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-accent">Assumptions</h3>
                {[
                  "Committee will approve digital transformation initiative",
                  "Member data (names, contacts, products) collectible within 4 weeks",
                  "Office staff will be trained to manage admin panel",
                  "Members will adopt digital profiles with onboarding support",
                  "Existing advertiser network will participate in digital ads",
                  "Discourse community can be self-hosted or use managed hosting",
                ].map((a) => (
                  <div key={a} className="flex gap-2 items-start">
                    <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-primary-foreground/70">{a}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </PitchSection>

      {/* Risks */}
      <PitchSection id="risks">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><AlertTriangle className="h-3 w-3 mr-1" /> Risk Assessment</Badge>
            <h2 className="text-4xl font-bold text-primary">Identified Risks</h2>
          </div>
          <Table className="border rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead>Risk</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Likelihood</TableHead>
                <TableHead>Mitigation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { risk: "Low Member Adoption", impact: "High", likelihood: "Medium", mitigation: "Onboarding support, pilot members, demo benefits through storefronts" },
                { risk: "Data Migration Delays", impact: "Medium", likelihood: "High", mitigation: "Start data collection early, provide Excel templates for bulk upload" },
                { risk: "Committee Buy-in Resistance", impact: "High", likelihood: "Low", mitigation: "Present ROI projections, demo working prototype, phased approach" },
                { risk: "Bidding System Misuse", impact: "Medium", likelihood: "Medium", mitigation: "Rate limiting, verified member-only bidding, admin moderation tools" },
                { risk: "Community Moderation Burden", impact: "Medium", likelihood: "Medium", mitigation: "Clear rules (no trade offers), category moderators, automated flagging" },
                { risk: "Advertising Revenue Shortfall", impact: "Medium", likelihood: "Medium", mitigation: "Start with existing advertiser relationships, offer introductory rates" },
              ].map((row) => (
                <TableRow key={row.risk}>
                  <TableCell className="font-medium">{row.risk}</TableCell>
                  <TableCell><Badge variant={row.impact === "High" ? "destructive" : "outline"} className="text-xs">{row.impact}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{row.likelihood}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.mitigation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="text-center pt-6 space-y-4">
            <p className="text-muted-foreground text-sm">Related Documents</p>
            <div className="flex gap-3 justify-center flex-wrap print:hidden">
              <Link to="/sow"><Button variant="outline">← SOW</Button></Link>
              <Link to="/prd"><Button variant="outline">PRD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
              <Link to="/fsd"><Button variant="outline">FRD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
              <Link to="/sdd"><Button variant="outline">SDD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
              <Link to="/tsd"><Button variant="outline">TSD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
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
