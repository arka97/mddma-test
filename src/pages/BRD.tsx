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
  Gavel, MessageSquare, Briefcase, UserCheck, Brain, Eye, Lock
} from "lucide-react";

const NAV_ITEMS = [
  { id: "cover", label: "Cover" },
  { id: "summary", label: "Summary" },
  { id: "philosophy", label: "Philosophy" },
  { id: "objectives", label: "Objectives" },
  { id: "control", label: "Market Control" },
  { id: "scope", label: "Scope" },
  { id: "stakeholders", label: "Stakeholders" },
  { id: "roles", label: "Roles" },
  { id: "requirements", label: "Requirements" },
  { id: "principles", label: "Principles" },
  { id: "success", label: "Success" },
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
            <span className="gold-gradient-text">Behavioral Trade OS</span>
          </h1>
          <p className="text-xl sm:text-2xl text-primary-foreground/70 max-w-2xl mx-auto">
            A controlled transparency marketplace that protects sellers, empowers buyers, and shifts market power from brokers to the platform.
          </p>
          <div className="pt-4 text-sm text-primary-foreground/50 space-y-1">
            <p>Prepared for: Mumbai Dry Fruits & Dates Merchants Association</p>
            <p>Document Version: 3.0 · April 2026</p>
          </div>
          <div className="flex gap-2 justify-center pt-2 flex-wrap print:hidden">
            <Link to="/pitch"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">← Pitch</Badge></Link>
            <Link to="/sow"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">← SOW</Badge></Link>
            <Link to="/prd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">PRD →</Badge></Link>
            <Link to="/fsd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">FRD →</Badge></Link>
            <Link to="/sdd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">SDD →</Badge></Link>
            <Link to="/tsd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">TSD →</Badge></Link>
            <Link to="/mvp-canvas"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">MVP Canvas →</Badge></Link>
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
            <h2 className="text-4xl font-bold text-primary">Why This Platform?</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
            <p>
              The Mumbai Dry Fruits & Dates Merchants Association (MDDMA), with a 95+ year legacy and 350+ member businesses, operates in one of India's most opaque commodity markets. Price discovery, supplier evaluation, and deal flow are dominated by informal broker networks — creating information asymmetry that hurts both buyers and sellers.
            </p>
            <p>
              This BRD defines requirements for a <strong className="text-foreground">Behavioral Trade Operating System</strong> — not merely a marketplace, but a controlled negotiation platform that uses behavioral design to protect seller margins, empower buyer decision-making, and systematically shift deal flow from brokers to the platform.
            </p>
            <Card className="bg-accent/5 border-accent/30">
              <CardContent className="p-6 text-center">
                <p className="text-lg font-semibold text-primary italic">"This platform does not expose the market — it structures and controls it."</p>
              </CardContent>
            </Card>
          </div>
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

      {/* Core Philosophy */}
      <PitchSection id="philosophy" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Brain className="h-3 w-3 mr-1" /> Core Philosophy</Badge>
            <h2 className="text-4xl font-bold">From Marketplace to Trade OS</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-destructive/10 border-destructive/30 text-primary-foreground">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold text-lg text-destructive">❌ What We Are NOT Building</h3>
                <ul className="space-y-2 text-sm text-primary-foreground/70">
                  <li>• A basic commodity marketplace with public pricing</li>
                  <li>• An IndiaMART clone with product listings</li>
                  <li>• A directory with "Call Now" buttons</li>
                  <li>• A platform that empowers brokers further</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-accent/10 border-accent/30 text-primary-foreground">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold text-lg text-accent">✓ What We ARE Building</h3>
                <ul className="space-y-2 text-sm text-primary-foreground/70">
                  <li>• A controlled negotiation marketplace with RFQ-based trade</li>
                  <li>• A behavioral intelligence system with strategic nudges</li>
                  <li>• A platform that protects seller margins through price masking</li>
                  <li>• A system that makes brokers optional, not mandatory</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </PitchSection>

      {/* Strategic Goals */}
      <PitchSection id="objectives">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Target className="h-3 w-3 mr-1" /> Business Objectives</Badge>
            <h2 className="text-4xl font-bold text-primary">Strategic Goals</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Member Empowerment", desc: "Provide verified storefronts, CRM dashboards, and controlled product visibility that protects margins." },
              { icon: TrendingUp, title: "Digital Revenue", desc: "4 revenue streams — membership, ads, lead packs, affiliate — targeting ₹42–85L/yr." },
              { icon: Shield, title: "Seller Protection", desc: "Price masking, RFQ-based negotiation, and stock band display to prevent margin erosion." },
              { icon: BarChart3, title: "Market Intelligence", desc: "Controlled signals — price trends, demand indicators, supply status — replacing broker information monopoly." },
              { icon: Gavel, title: "RFQ-First Trading", desc: "Replace public pricing with negotiation-first design. Buyers request; sellers respond privately." },
              { icon: MessageSquare, title: "Broker Neutralization", desc: "Position brokers as optional facilitators, not mandatory intermediaries. Shift deal flow to the platform." },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-6 space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Market Control Strategy — NEW */}
      <PitchSection id="control" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Lock className="h-3 w-3 mr-1" /> Market Control Strategy</Badge>
            <h2 className="text-4xl font-bold">Controlling Discovery, Pricing & Deal Flow</h2>
            <p className="text-primary-foreground/60 max-w-2xl mx-auto">Shift control of discovery, pricing perception, and deal flow from brokers to the MDDMA platform.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Price Masking", desc: "Show price ranges and market reference prices — never exact prices. Enable private RFQ-based negotiation.", icon: Eye },
              { title: "Stock Band System", desc: "Display stock as High / Medium / Low / On Order. Never reveal exact inventory quantities.", icon: ShoppingBag },
              { title: "Market Signals", desc: "Show price trends (↑ ↓ →), demand indicators, and supply signals. Show the weather, not the forecast.", icon: BarChart3 },
              { title: "RFQ Aggregation", desc: "Buyers send inquiries to multiple sellers simultaneously. Sellers respond privately. Platform tracks everything.", icon: Gavel },
              { title: "Broker Positioning", desc: "Brokers exist as optional facilitators — not mandatory gatekeepers. Direct trade paths bypass brokerage.", icon: Briefcase },
              { title: "Behavioral Nudges", desc: "Anchoring, loss aversion, social proof, and variable rewards guide user actions intentionally.", icon: Brain },
            ].map((item) => (
              <Card key={item.title} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <CardContent className="p-5 space-y-2">
                  <item.icon className="h-6 w-6 text-accent" />
                  <h3 className="font-semibold">{item.title}</h3>
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
                  "Controlled negotiation marketplace with RFQ engine",
                  "Price masking with range-based display",
                  "Stock band visibility system (High/Medium/Low)",
                  "Market intelligence signals and trend indicators",
                  "Behavioral UX layer (anchoring, social proof, nudges)",
                  "Verified member directory with search & filters",
                  "Seller storefronts with product catalogs",
                  "Multi-seller RFQ aggregation system",
                  "Lead CRM with behavioral prioritization",
                  "5-role RBAC (Guest, Free, Paid, Broker, Admin)",
                  "Admin dashboard with analytics",
                  "Trade community integration (Discourse)",
                  "Advertising & membership management",
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
                  "E-commerce / direct cart-based product sales",
                  "Payment gateway for product transactions",
                  "Native mobile applications (iOS/Android)",
                  "ERP or accounting system integration",
                  "Multi-language support (Phase 1)",
                  "Real-time chat or messaging system",
                  "Logistics or shipment tracking",
                  "Automated pricing / algorithmic trading",
                  "Exact price exposure to public",
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
                { who: "MDDMA Committee", role: "Decision Maker & Sponsor", interest: "Revenue generation, member satisfaction, platform control over deal flow" },
                { who: "Office Staff", role: "Day-to-day Operator", interest: "Simplified admin workflows, easy content management" },
                { who: "Paid Members", role: "Premium User", interest: "Price protection via RFQ mode, priority listings, market intelligence access" },
                { who: "Free Members", role: "Basic User", interest: "Online visibility, storefront, basic lead management" },
                { who: "Brokers", role: "Optional Facilitator", interest: "Posting supply/demand, connecting deals — as facilitators, not gatekeepers" },
                { who: "Buyers", role: "External User", interest: "Finding verified suppliers, sending RFQs, comparing market signals" },
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

      {/* User Roles */}
      <PitchSection id="roles">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><UserCheck className="h-3 w-3 mr-1" /> User Roles</Badge>
            <h2 className="text-4xl font-bold text-primary">Role-Based Access Control</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Users, role: "Guest", color: "border-muted", features: ["Browse directory", "View commodities (price ranges only)", "Send RFQs via form", "View market signals", "Apply for membership"] },
              { icon: UserCheck, role: "Free Member", color: "border-accent/30", features: ["Everything Guest gets", "Seller storefront", "Product listings (price range)", "Basic CRM dashboard", "Receive circulars"] },
              { icon: Shield, role: "Paid Member", color: "border-accent", features: ["Everything Free gets", "Full RFQ mode (hide price)", "Priority directory listing", "Advanced CRM with lead scoring", "Market intelligence access"] },
              { icon: Briefcase, role: "Broker", color: "border-accent/50", features: ["Browse & search all", "Post supply offers", "Post buyer requirements", "Broker CRM dashboard", "Optional facilitator role"] },
              { icon: Target, role: "Admin", color: "border-destructive/50", features: ["Full platform access", "Member approvals & moderation", "RFQ engine monitoring", "Market signal management", "Platform analytics"] },
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
                { id: "BR-003", req: "Free/Paid members shall have seller storefronts with product catalog showing price ranges, MOQ, packaging, and origin" },
                { id: "BR-004", req: "Members shall be categorizable as featured or sponsored with elevated visibility in directory" },
              ]},
              { module: "Controlled Negotiation Marketplace", icon: ShoppingBag, items: [
                { id: "BR-005", req: "Platform shall display 25+ product categories with variant information, origin details, and market reference prices" },
                { id: "BR-006", req: "Platform shall NOT display exact product prices publicly — show price ranges and market reference price instead" },
                { id: "BR-007", req: "Every product listing shall include a 'Request Best Price' CTA that opens multi-step RFQ form" },
                { id: "BR-008", req: "Products shall be filterable by commodity, origin, stock status, price range, and seller location" },
              ]},
              { module: "Controlled Price Visibility (BR-023)", icon: Eye, items: [
                { id: "BR-023", req: "Platform shall show price ranges (min–max) and market reference prices — never exact seller prices" },
                { id: "BR-024", req: "Stock visibility shall display band-based status: High / Medium / Low / On Order — never exact quantities" },
                { id: "BR-025", req: "Market intelligence signals shall display: price trends (rising/falling/stable), demand indicators, and supply signals" },
              ]},
              { module: "RFQ Aggregation Engine (BR-026)", icon: Gavel, items: [
                { id: "BR-026", req: "Buyers can send inquiry to multiple sellers simultaneously via multi-step RFQ form" },
                { id: "BR-027", req: "Sellers respond privately through CRM dashboard — responses are never visible to other sellers" },
                { id: "BR-028", req: "Platform tracks all RFQ interactions: sent, viewed, responded, conversion rate" },
              ]},
              { module: "Broker Neutralization (BR-029)", icon: Briefcase, items: [
                { id: "BR-029", req: "Brokers shall exist as optional facilitators — NOT mandatory intermediaries" },
                { id: "BR-030", req: "Direct buyer-seller trade paths shall bypass brokerage with full platform support" },
                { id: "BR-031", req: "Broker marketplace shall operate as a two-tab supply/demand board for deal matching" },
              ]},
              { module: "Lead Intelligence & CRM", icon: BarChart3, items: [
                { id: "BR-014", req: "System shall offer curated expo exhibitor databases as purchasable lead packs" },
                { id: "BR-015", req: "CRM dashboard shall include behavioral lead prioritization: Hot / Warm / Cold scoring" },
                { id: "BR-016", req: "Market intelligence page shall display price trend charts, demand indicators, and supply signals" },
              ]},
              { module: "Community & Communication", icon: MessageSquare, items: [
                { id: "BR-017", req: "Platform shall integrate with Discourse community (community.mddma.com) for structured industry discussions" },
                { id: "BR-018", req: "Community categories: Market Intelligence, Industry News, Trade Discussions, Association Updates, Events, Social" },
                { id: "BR-019", req: "Community shall NOT allow trade offers or buy requests — all trading happens via the RFQ marketplace" },
                { id: "BR-020", req: "Homepage shall show 'Latest Industry Conversations'; product pages shall show related discussions" },
              ]},
              { module: "Advertising & Membership", icon: Megaphone, items: [
                { id: "BR-021", req: "Platform shall support rotating banner ads with scheduling, click tracking, and placement management" },
                { id: "BR-022", req: "Three membership tiers (Silver ₹5K, Gold ₹15K, Platinum ₹30K) with distinct benefits and pricing" },
                { id: "BR-032", req: "Online membership application with document upload, status tracking, and renewal workflow" },
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

      {/* Platform Design Principles */}
      <PitchSection id="principles">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Brain className="h-3 w-3 mr-1" /> Platform Design Principles</Badge>
            <h2 className="text-4xl font-bold text-primary">Behavioral Operating Principles</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Controlled Transparency", desc: "Show signals, not exact data. Price ranges, stock bands, trend arrows — never raw numbers that competitors can exploit.", icon: Eye },
              { title: "Negotiation-First Design", desc: "Replace price display with RFQ. Every interaction funnels toward a private negotiation, not a public price comparison.", icon: Gavel },
              { title: "Trust Acceleration", desc: "Verification > price. GST badges, FSSAI certificates, and MDDMA membership carry more weight than the lowest quote.", icon: Shield },
              { title: "Cognitive Simplicity", desc: "Reduce decision fatigue. Stock bands, trend arrows, and 'Request Best Price' CTAs simplify complex trade decisions.", icon: Brain },
              { title: "Behavioral Nudging", desc: "Guide user actions intentionally. Anchoring (market reference price), loss aversion (limited stock), social proof (inquiry counts).", icon: TrendingUp },
              { title: "Platform Control", desc: "The platform structures and controls market interactions. It does not passively expose data — it actively shapes trade behavior.", icon: Lock },
            ].map((item) => (
              <Card key={item.title} className="border-accent/20">
                <CardContent className="p-5 space-y-2">
                  <item.icon className="h-6 w-6 text-accent" />
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
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
              { kpi: "Member Profiles Online", target: "350+", period: "Within 3 months" },
              { kpi: "RFQs Sent / Month", target: "200+", period: "By month 6" },
              { kpi: "Seller Response Rate", target: "80%+", period: "Within 24 hours" },
              { kpi: "Broker-Free Trades", target: "40%+", period: "By month 9" },
              { kpi: "Community Members", target: "500+", period: "By month 6" },
              { kpi: "Total Digital Revenue", target: "₹42–85L", period: "Year 1" },
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
                { risk: "Low Member Adoption", impact: "High", likelihood: "Medium", mitigation: "Onboarding support, pilot members, demo RFQ benefits" },
                { risk: "Broker Resistance", impact: "High", likelihood: "High", mitigation: "Position as 'additional channel' initially, show broker CRM benefits" },
                { risk: "Price Masking Confusion", impact: "Medium", likelihood: "Medium", mitigation: "Clear UX showing 'Request Best Price' flow, market reference anchoring" },
                { risk: "RFQ Spam", impact: "Medium", likelihood: "Medium", mitigation: "Rate limiting, verified buyer info, quality scoring" },
                { risk: "Data Migration Delays", impact: "Medium", likelihood: "High", mitigation: "Start data collection early, Excel templates for bulk upload" },
                { risk: "Community Moderation Burden", impact: "Medium", likelihood: "Medium", mitigation: "Clear rules, category moderators, automated flagging" },
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
              <Link to="/pitch"><Button variant="outline">← Pitch</Button></Link>
              <Link to="/sow"><Button variant="outline">← SOW</Button></Link>
              <Link to="/prd"><Button variant="outline">PRD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
              <Link to="/fsd"><Button variant="outline">FRD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
              <Link to="/sdd"><Button variant="outline">SDD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
              <Link to="/tsd"><Button variant="outline">TSD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
              <Link to="/mvp-canvas"><Button variant="outline">MVP Canvas <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
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
