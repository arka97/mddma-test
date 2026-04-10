import { Link } from "react-router-dom";
import { PitchSection } from "@/components/pitch/PitchSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Printer, ChevronDown, CheckCircle2, ArrowRight,
  Users, ShoppingBag, BarChart3, Megaphone, Settings,
  Shield, FileText, Eye, UserCheck, Globe, Smartphone, Zap, Brain, Gavel, Lock
} from "lucide-react";

const NAV_ITEMS = [
  { id: "cover", label: "Cover" },
  { id: "intro", label: "Introduction" },
  { id: "roles", label: "User Roles" },
  { id: "directory", label: "Directory" },
  { id: "products", label: "Products" },
  { id: "rfq", label: "RFQ Engine" },
  { id: "crm", label: "CRM" },
  { id: "leads", label: "Leads" },
  { id: "admin", label: "Admin" },
  { id: "principles", label: "Principles" },
  { id: "nonfunc", label: "Non-Functional" },
];

const FSD = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur border-b border-primary-foreground/10 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
          <span className="text-primary-foreground font-bold text-sm tracking-wide">MDDMA FRD</span>
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
          <Badge className="bg-accent text-primary font-semibold text-sm px-4 py-1">Functional Requirements Document</Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            MDDMA<br />
            <span className="gold-gradient-text">Functional Spec</span>
          </h1>
          <p className="text-xl sm:text-2xl text-primary-foreground/70 max-w-2xl mx-auto">
            Detailed functional requirements for the Behavioral Trade Operating System
          </p>
          <div className="pt-4 text-sm text-primary-foreground/50 space-y-1">
            <p>Prepared for: Mumbai Dry Fruits & Dates Merchants Association</p>
            <p>Document Version: 3.0 · April 2026</p>
          </div>
          <div className="flex gap-2 justify-center pt-2 flex-wrap print:hidden">
            <Link to="/brd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">← BRD</Badge></Link>
            <Link to="/prd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">← PRD</Badge></Link>
            <Link to="/sdd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">SDD →</Badge></Link>
            <Link to="/tsd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">TSD →</Badge></Link>
          </div>
          <button onClick={() => scrollTo("intro")} className="mt-8 inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </button>
        </div>
      </PitchSection>

      {/* Introduction */}
      <PitchSection id="intro">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><FileText className="h-3 w-3 mr-1" /> Introduction</Badge>
            <h2 className="text-4xl font-bold text-primary">Purpose & Audience</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
            <p>This FRD translates the business requirements from <Link to="/brd" className="text-accent hover:underline font-medium">BRD v3.0</Link> and product requirements from <Link to="/prd" className="text-accent hover:underline font-medium">PRD v3.0</Link> into detailed functional specifications for the MDDMA Behavioral Trade Operating System.</p>
            <Card className="bg-accent/5 border-accent/30">
              <CardContent className="p-4 text-center">
                <p className="text-sm font-semibold text-primary italic">"This platform does not expose the market — it structures and controls it."</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </PitchSection>

      {/* User Roles */}
      <PitchSection id="roles" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><UserCheck className="h-3 w-3 mr-1" /> User Roles</Badge>
            <h2 className="text-4xl font-bold">System Users (5-Role RBAC)</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Eye, role: "Guest / Buyer", perms: ["Browse directory", "View price ranges & stock bands", "Send RFQs to sellers", "View market signals", "Submit membership application"] },
              { icon: UserCheck, role: "Free / Paid Member", perms: ["Manage storefront & products", "Receive & respond to RFQs", "CRM dashboard with lead scoring", "Market intelligence access (Paid)", "RFQ mode — hide prices (Paid)"] },
              { icon: Settings, role: "Admin / Broker", perms: ["Admin: Full CRUD, approvals, analytics", "Admin: RFQ engine monitoring", "Admin: Market signal management", "Broker: Post supply/demand listings", "Broker: Optional deal facilitation"] },
            ].map((item) => (
              <Card key={item.role} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <CardContent className="p-6 space-y-4">
                  <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg">{item.role}</h3>
                  <ul className="space-y-2">
                    {item.perms.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-primary-foreground/70">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />{p}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Directory Module */}
      <PitchSection id="directory">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Users className="h-3 w-3 mr-1" /> Module: Member Directory</Badge>
            <h2 className="text-4xl font-bold text-primary">Member Directory</h2>
          </div>
          <div className="space-y-4">
            {[
              { id: "FR-D01", req: "Directory page shall display members in a responsive card grid with company name, logo, location, and product tags" },
              { id: "FR-D02", req: "Search bar shall support real-time filtering by company name, owner name, or product keywords" },
              { id: "FR-D03", req: "Filter sidebar shall allow filtering by membership tier, verification status, and product categories" },
              { id: "FR-D04", req: "Each member card shall show verification badge (GST, FSSAI) and featured/sponsored indicators" },
              { id: "FR-D05", req: "Member profile page shall include contact actions: Call, WhatsApp, Email, and 'Send RFQ' button" },
              { id: "FR-D06", req: "Featured members shall appear in highlighted section at top of directory" },
              { id: "FR-D07", req: "Sponsored members shall display with 'Sponsored' badge and elevated visual treatment" },
            ].map((item) => (
              <div key={item.id} className="flex gap-3 items-start p-3 rounded-lg bg-muted/50">
                <Badge variant="outline" className="text-xs font-mono shrink-0 mt-0.5">{item.id}</Badge>
                <span className="text-sm text-muted-foreground">{item.req}</span>
              </div>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Product Discovery Module — UPDATED */}
      <PitchSection id="products" dark>
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><ShoppingBag className="h-3 w-3 mr-1" /> Module: Product Discovery</Badge>
            <h2 className="text-4xl font-bold">Controlled Product Display</h2>
          </div>
          <div className="space-y-4">
            {[
              { id: "FR-P01", req: "Products page shall display 25+ categories in a searchable grid with images and descriptions" },
              { id: "FR-P02", req: "Each product page shall list variants with origin details and market reference price" },
              { id: "FR-P03", req: "Verified sellers section on each product page shall link to member profiles" },
              { id: "FR-P04", req: "Packaging formats (bulk, retail, custom) shall be displayed with quantities" },
              { id: "FR-P05", req: "Affiliate retail links (Amazon, Flipkart) shall open in new tabs" },
              { id: "FR-P06", req: "Related products section shall suggest similar categories" },
              { id: "FR-P07", req: "Product search shall support filtering by category, origin, stock band, and seller location" },
              { id: "FR-P08", req: "System shall display: Price Range (min–max), Market Reference Price, and Trend indicator (↑ ↓ →) — never exact prices" },
              { id: "FR-P09", req: "Stock visibility shall show: High / Medium / Low band with optional 'Fast Moving' indicator" },
              { id: "FR-P10", req: "Each product must include 'Request Best Price' CTA that opens multi-step RFQ inquiry form" },
            ].map((item) => (
              <div key={item.id} className="flex gap-3 items-start p-3 rounded-lg bg-primary-foreground/5">
                <Badge variant="outline" className="text-xs font-mono shrink-0 mt-0.5 border-primary-foreground/30 text-primary-foreground/70">{item.id}</Badge>
                <span className="text-sm text-primary-foreground/70">{item.req}</span>
              </div>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* RFQ System — NEW MODULE */}
      <PitchSection id="rfq">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Gavel className="h-3 w-3 mr-1" /> Module: RFQ Engine</Badge>
            <h2 className="text-4xl font-bold text-primary">Request for Quote System</h2>
            <p className="text-muted-foreground">Core negotiation-first module — replaces public pricing with private RFQ flow</p>
          </div>
          <div className="space-y-4">
            {[
              { id: "FR-RFQ01", req: "Buyer can send inquiry to multiple sellers simultaneously from product pages or storefronts" },
              { id: "FR-RFQ02", req: "RFQ form shall be multi-step: Product Selection → Quantity & Timeline → Message & Contact Details" },
              { id: "FR-RFQ03", req: "Seller receives RFQ notification in CRM dashboard with buyer details and product interests" },
              { id: "FR-RFQ04", req: "Seller responds privately — response visible only to that specific buyer" },
              { id: "FR-RFQ05", req: "Platform tracks all RFQ interactions: sent, viewed, responded, response time, conversion" },
              { id: "FR-RFQ06", req: "Buyer can view all received quotes in a comparison view (without revealing seller-to-seller)" },
              { id: "FR-RFQ07", req: "Rate limiting: max 10 RFQs per buyer per day to prevent spam" },
              { id: "FR-RFQ08", req: "RFQ analytics dashboard for admin: total RFQs, response rates, conversion funnel" },
            ].map((item) => (
              <div key={item.id} className="flex gap-3 items-start p-3 rounded-lg bg-muted/50">
                <Badge variant="outline" className="text-xs font-mono shrink-0 mt-0.5">{item.id}</Badge>
                <span className="text-sm text-muted-foreground">{item.req}</span>
              </div>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* CRM Module — UPDATED */}
      <PitchSection id="crm" dark>
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><BarChart3 className="h-3 w-3 mr-1" /> Module: Behavioral CRM</Badge>
            <h2 className="text-4xl font-bold">Lead CRM with Behavioral Scoring</h2>
          </div>
          <div className="space-y-4">
            {[
              { id: "FR-CRM01", req: "CRM dashboard shall show all incoming RFQs with buyer info, product, quantity, and status" },
              { id: "FR-CRM02", req: "Pipeline stages: New → Responded → Negotiation → Converted → Lost" },
              { id: "FR-CRM03", req: "Status update dropdown for each lead with timestamp tracking" },
              { id: "FR-CRM04", req: "Filter leads by date, product, status, and priority score" },
              { id: "FR-CRM05", req: "Export leads to CSV for offline analysis" },
              { id: "FR-CRM06", req: "Response time tracking per seller — displayed in admin analytics" },
              { id: "FR-CRM07", req: "Seller performance metrics: response rate, avg response time, conversion rate" },
              { id: "FR-CRM08", req: "Lead prioritization scoring: Hot (high qty + repeat buyer) / Warm (new buyer) / Cold (low engagement)" },
              { id: "FR-CRM09", req: "Push notifications: 'New RFQ received', 'High-value buyer inquiry', 'Follow-up reminder'" },
            ].map((item) => (
              <div key={item.id} className="flex gap-3 items-start p-3 rounded-lg bg-primary-foreground/5">
                <Badge variant="outline" className="text-xs font-mono shrink-0 mt-0.5 border-primary-foreground/30 text-primary-foreground/70">{item.id}</Badge>
                <span className="text-sm text-primary-foreground/70">{item.req}</span>
              </div>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Lead Intelligence */}
      <PitchSection id="leads">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><BarChart3 className="h-3 w-3 mr-1" /> Module: Lead Intelligence</Badge>
            <h2 className="text-4xl font-bold text-primary">Lead Intelligence Portal</h2>
          </div>
          <div className="space-y-4">
            {[
              { id: "FR-L01", req: "Lead packs page shall display expo databases with exhibitor count, expo name, year, and pricing" },
              { id: "FR-L02", req: "Each lead pack shall show a preview sample (first 5 entries) before purchase" },
              { id: "FR-L03", req: "Pricing differentiation between MDDMA member and non-member" },
              { id: "FR-L04", req: "Purchase flow: Select → Confirm → Payment → Download Excel/CSV" },
              { id: "FR-L05", req: "Admin can create, edit, and deactivate lead packs" },
            ].map((item) => (
              <div key={item.id} className="flex gap-3 items-start p-3 rounded-lg bg-muted/50">
                <Badge variant="outline" className="text-xs font-mono shrink-0 mt-0.5">{item.id}</Badge>
                <span className="text-sm text-muted-foreground">{item.req}</span>
              </div>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Admin Module */}
      <PitchSection id="admin" dark>
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Settings className="h-3 w-3 mr-1" /> Module: Admin Panel</Badge>
            <h2 className="text-4xl font-bold">Admin Dashboard</h2>
          </div>
          <div className="space-y-4">
            {[
              { id: "FR-AD01", req: "Admin dashboard: total members, pending applications, active ads, RFQ volume, response rates" },
              { id: "FR-AD02", req: "CRUD operations for member profiles with featured/sponsored toggle" },
              { id: "FR-AD03", req: "CRUD for products: categories, variants, seller links, price ranges" },
              { id: "FR-AD04", req: "RFQ engine monitoring: total RFQs, response rates, conversion funnel" },
              { id: "FR-AD05", req: "Market signal management: update price trends, stock bands, demand indicators" },
              { id: "FR-AD06", req: "Membership application queue with approve/reject/request-more-info workflow" },
              { id: "FR-AD07", req: "Circular management: create, distribute via email and in-app" },
              { id: "FR-AD08", req: "Ad management: upload banners, set schedules, view click performance" },
            ].map((item) => (
              <div key={item.id} className="flex gap-3 items-start p-3 rounded-lg bg-primary-foreground/5">
                <Badge variant="outline" className="text-xs font-mono shrink-0 mt-0.5 border-primary-foreground/30 text-primary-foreground/70">{item.id}</Badge>
                <span className="text-sm text-primary-foreground/70">{item.req}</span>
              </div>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Design Principles */}
      <PitchSection id="principles">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Brain className="h-3 w-3 mr-1" /> Platform Design Principles</Badge>
            <h2 className="text-4xl font-bold text-primary">Behavioral Operating Principles</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Controlled Transparency", desc: "Show signals, not exact data", icon: Eye },
              { title: "Negotiation-First Design", desc: "Replace price display with RFQ", icon: Gavel },
              { title: "Trust Acceleration", desc: "Verification > price", icon: Shield },
              { title: "Cognitive Simplicity", desc: "Reduce decision fatigue", icon: Brain },
              { title: "Behavioral Nudging", desc: "Guide user actions intentionally", icon: Zap },
              { title: "Platform Control", desc: "Structure and control market interactions", icon: Lock },
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

      {/* Non-Functional Requirements */}
      <PitchSection id="nonfunc" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Zap className="h-3 w-3 mr-1" /> Non-Functional Requirements</Badge>
            <h2 className="text-4xl font-bold">Performance & Security</h2>
          </div>
          <Table className="border border-primary-foreground/20 rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow className="border-primary-foreground/20 hover:bg-transparent">
                <TableHead className="text-primary-foreground/70">Category</TableHead>
                <TableHead className="text-primary-foreground/70">Requirement</TableHead>
                <TableHead className="text-primary-foreground/70">Target</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { cat: "Performance", req: "Initial page load time", target: "< 3 seconds on 4G" },
                { cat: "Performance", req: "Lighthouse performance score", target: "90+" },
                { cat: "Security", req: "Price data protection", target: "RLS — never expose exact prices to unauthorized roles" },
                { cat: "Security", req: "RFQ privacy", target: "Seller responses visible only to requesting buyer" },
                { cat: "Security", req: "Authentication", target: "Email/password + OAuth" },
                { cat: "SEO", req: "Meta tags & Open Graph", target: "All public pages" },
                { cat: "Availability", req: "Uptime SLA", target: "99.9%" },
              ].map((row, i) => (
                <TableRow key={i} className="border-primary-foreground/10 hover:bg-primary-foreground/5">
                  <TableCell className="font-medium text-primary-foreground">{row.cat}</TableCell>
                  <TableCell className="text-primary-foreground/70 text-sm">{row.req}</TableCell>
                  <TableCell className="text-accent font-semibold">{row.target}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="text-center pt-6 space-y-4">
            <div className="flex gap-3 justify-center flex-wrap print:hidden">
              <Link to="/brd"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">← BRD</Button></Link>
              <Link to="/prd"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">← PRD</Button></Link>
              <Link to="/sdd"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">SDD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
              <Link to="/tsd"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">TSD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
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

export default FSD;
