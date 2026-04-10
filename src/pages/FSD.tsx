import { Link } from "react-router-dom";
import { PitchSection } from "@/components/pitch/PitchSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Printer, ChevronDown, CheckCircle2, ArrowRight,
  Users, ShoppingBag, BarChart3, Megaphone, Settings,
  Shield, FileText, Eye, UserCheck, Globe, Smartphone, Zap
} from "lucide-react";

const NAV_ITEMS = [
  { id: "cover", label: "Cover" },
  { id: "intro", label: "Introduction" },
  { id: "roles", label: "User Roles" },
  { id: "directory", label: "Directory" },
  { id: "products", label: "Products" },
  { id: "leads", label: "Leads" },
  { id: "advertising", label: "Advertising" },
  { id: "admin", label: "Admin" },
  { id: "membership", label: "Membership" },
  { id: "uiux", label: "UI/UX" },
  { id: "nonfunc", label: "Non-Functional" },
  { id: "demos", label: "Demos" },
];

const FSD = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur border-b border-primary-foreground/10 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
          <span className="text-primary-foreground font-bold text-sm tracking-wide">MDDMA FSD</span>
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
          <Badge className="bg-accent text-primary font-semibold text-sm px-4 py-1">Functional Specification Document</Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            MDDMA<br />
            <span className="gold-gradient-text">Functional Spec</span>
          </h1>
          <p className="text-xl sm:text-2xl text-primary-foreground/70 max-w-2xl mx-auto">
            Detailed functional requirements for every module of the MDDMA digital platform
          </p>
          <div className="pt-4 text-sm text-primary-foreground/50 space-y-1">
            <p>Prepared for: Mumbai Dry Fruits & Dates Merchants Association</p>
            <p>Document Version: 2.0 · April 2026</p>
          </div>
          <div className="flex gap-2 justify-center pt-2 flex-wrap print:hidden">
            <Link to="/pitch"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">← Pitch</Badge></Link>
            <Link to="/sow"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">← SOW</Badge></Link>
            <Link to="/brd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">← BRD</Badge></Link>
            <Link to="/prd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">← PRD</Badge></Link>
            <Link to="/sdd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">SDD →</Badge></Link>
            <Link to="/tsd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">TSD →</Badge></Link>
            <Link to="/mvp-canvas"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">MVP Canvas →</Badge></Link>
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
            <p>This Functional Requirements Document (FRD) translates the business requirements outlined in the <Link to="/brd" className="text-accent hover:underline font-medium">BRD v2.0</Link> and product requirements from the <Link to="/prd" className="text-accent hover:underline font-medium">PRD v2.0</Link> into detailed functional requirements for the MDDMA digital platform.</p>
            <p><strong className="text-foreground">Audience:</strong> This document is intended for the MDDMA committee, development team, QA team, and project stakeholders who need to understand what the platform will do at a functional level.</p>
            <p><strong className="text-foreground">References:</strong> <Link to="/brd" className="text-accent hover:underline">BRD v2.0</Link>, <Link to="/prd" className="text-accent hover:underline">PRD v2.0</Link>, <Link to="/sow" className="text-accent hover:underline">SOW v2.0</Link>, <Link to="/mvp-canvas" className="text-accent hover:underline">MVP Canvas</Link>, existing MDDMA website analysis, committee meeting minutes.</p>
          </div>
        </div>
      </PitchSection>

      {/* User Roles */}
      <PitchSection id="roles" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><UserCheck className="h-3 w-3 mr-1" /> User Roles</Badge>
            <h2 className="text-4xl font-bold">System Users</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Eye, role: "Public Visitor", perms: ["Browse member directory", "View product catalog", "Access lead pack listings", "View association information", "Submit membership application"] },
              { icon: UserCheck, role: "Registered Member", perms: ["All public visitor permissions", "Manage company profile", "Access member-only pricing", "Download purchased lead packs", "Receive circulars & announcements"] },
              { icon: Settings, role: "Admin / Office Staff", perms: ["Full CRUD on members & products", "Manage advertisements", "Create & manage lead packs", "Process membership applications", "View analytics & reports"] },
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

      {/* Member Directory Module */}
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
              { id: "FR-D03", req: "Filter sidebar shall allow filtering by membership tier (Silver/Gold/Platinum), verification status, and product categories" },
              { id: "FR-D04", req: "Each member card shall show verification badge (GST, FSSAI) and featured/sponsored indicators" },
              { id: "FR-D05", req: "Clicking a member card navigates to a full profile page with contact details, product list, certifications, and company description" },
              { id: "FR-D06", req: "Member profile shall include Call, WhatsApp, and Email action buttons" },
              { id: "FR-D07", req: "Featured members shall appear in a highlighted section at the top of the directory" },
              { id: "FR-D08", req: "Sponsored members shall display with a 'Sponsored' badge and elevated visual treatment" },
            ].map((item) => (
              <div key={item.id} className="flex gap-3 items-start p-3 rounded-lg bg-muted/50">
                <Badge variant="outline" className="text-xs font-mono shrink-0 mt-0.5">{item.id}</Badge>
                <span className="text-sm text-muted-foreground">{item.req}</span>
              </div>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Product Catalog Module */}
      <PitchSection id="products" dark>
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><ShoppingBag className="h-3 w-3 mr-1" /> Module: Product Catalog</Badge>
            <h2 className="text-4xl font-bold">Product Discovery</h2>
          </div>
          <div className="space-y-4">
            {[
              { id: "FR-P01", req: "Products page shall display 25+ product categories in a searchable grid with images and descriptions" },
              { id: "FR-P02", req: "Each product page shall list variants (e.g., Kashmiri Mamra, Afghan Mamra) with origin details" },
              { id: "FR-P03", req: "Verified sellers section on each product page shall link to corresponding member profiles" },
              { id: "FR-P04", req: "Packaging formats (bulk, retail, custom) shall be displayed with typical quantities" },
              { id: "FR-P05", req: "Affiliate retail links (Amazon, Flipkart, BigBasket) shall open in new tabs with proper tracking" },
              { id: "FR-P06", req: "Related products section shall suggest similar categories based on product type" },
              { id: "FR-P07", req: "Product search shall support filtering by category, origin country, and variant type" },
            ].map((item) => (
              <div key={item.id} className="flex gap-3 items-start p-3 rounded-lg bg-primary-foreground/5">
                <Badge variant="outline" className="text-xs font-mono shrink-0 mt-0.5 border-primary-foreground/30 text-primary-foreground/70">{item.id}</Badge>
                <span className="text-sm text-primary-foreground/70">{item.req}</span>
              </div>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Lead Intelligence Module */}
      <PitchSection id="leads">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><BarChart3 className="h-3 w-3 mr-1" /> Module: Lead Intelligence</Badge>
            <h2 className="text-4xl font-bold text-primary">Lead Intelligence Portal</h2>
          </div>
          <div className="space-y-4">
            {[
              { id: "FR-L01", req: "Lead packs page shall display available expo databases with exhibitor count, expo name, year, and pricing" },
              { id: "FR-L02", req: "Each lead pack shall show a preview sample (first 5 entries) before purchase" },
              { id: "FR-L03", req: "Pricing shall differentiate between MDDMA member price and non-member price" },
              { id: "FR-L04", req: "Purchase flow: Select pack → Confirm details → Payment → Download Excel/CSV" },
              { id: "FR-L05", req: "Lead pack data shall include company name, contact person, email, phone, products, and country" },
              { id: "FR-L06", req: "Admin shall be able to create, edit, and deactivate lead packs" },
            ].map((item) => (
              <div key={item.id} className="flex gap-3 items-start p-3 rounded-lg bg-muted/50">
                <Badge variant="outline" className="text-xs font-mono shrink-0 mt-0.5">{item.id}</Badge>
                <span className="text-sm text-muted-foreground">{item.req}</span>
              </div>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Advertising Module */}
      <PitchSection id="advertising" dark>
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Megaphone className="h-3 w-3 mr-1" /> Module: Advertising</Badge>
            <h2 className="text-4xl font-bold">Advertising Platform</h2>
          </div>
          <div className="space-y-4">
            {[
              { id: "FR-A01", req: "Homepage shall display rotating banner advertisements with click-through URLs" },
              { id: "FR-A02", req: "Directory pages shall support sidebar ad placements" },
              { id: "FR-A03", req: "Ad scheduling: admin can set start date, end date, and rotation frequency" },
              { id: "FR-A04", req: "Click tracking and impression counting for all ad placements" },
              { id: "FR-A05", req: "Admin can upload ad creatives (image), set target URLs, and configure placement zones" },
            ].map((item) => (
              <div key={item.id} className="flex gap-3 items-start p-3 rounded-lg bg-primary-foreground/5">
                <Badge variant="outline" className="text-xs font-mono shrink-0 mt-0.5 border-primary-foreground/30 text-primary-foreground/70">{item.id}</Badge>
                <span className="text-sm text-primary-foreground/70">{item.req}</span>
              </div>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Admin Panel Module */}
      <PitchSection id="admin">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Settings className="h-3 w-3 mr-1" /> Module: Admin Panel</Badge>
            <h2 className="text-4xl font-bold text-primary">Admin Dashboard</h2>
          </div>
          <div className="space-y-4">
            {[
              { id: "FR-AD01", req: "Admin dashboard shall show summary stats: total members, pending applications, active ads, lead pack sales" },
              { id: "FR-AD02", req: "CRUD operations for member profiles: create, read, update, delete, toggle featured/sponsored" },
              { id: "FR-AD03", req: "CRUD operations for products: add categories, manage variants, link sellers" },
              { id: "FR-AD04", req: "CRUD operations for lead packs: create packs, upload data, set pricing, activate/deactivate" },
              { id: "FR-AD05", req: "Ad management: upload banners, configure placements, set schedules, view performance" },
              { id: "FR-AD06", req: "Membership application queue: review, approve, reject, with email notifications" },
              { id: "FR-AD07", req: "Circular management: create, distribute to members via email and in-app notifications" },
            ].map((item) => (
              <div key={item.id} className="flex gap-3 items-start p-3 rounded-lg bg-muted/50">
                <Badge variant="outline" className="text-xs font-mono shrink-0 mt-0.5">{item.id}</Badge>
                <span className="text-sm text-muted-foreground">{item.req}</span>
              </div>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Membership Module */}
      <PitchSection id="membership" dark>
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Shield className="h-3 w-3 mr-1" /> Module: Membership</Badge>
            <h2 className="text-4xl font-bold">Membership Workflow</h2>
          </div>
          <div className="space-y-4">
            {[
              { id: "FR-M01", req: "Public-facing membership page shall display three tiers (Silver, Gold, Platinum) with feature comparison" },
              { id: "FR-M02", req: "Online application form: company details, owner info, product categories, document uploads (GST cert, FSSAI, photos)" },
              { id: "FR-M03", req: "Application status tracking: Submitted → Under Review → Approved/Rejected" },
              { id: "FR-M04", req: "Tier selection during application with clear pricing and benefit breakdown" },
              { id: "FR-M05", req: "Renewal workflow: automated reminders 30/15/7 days before expiry, online renewal form" },
              { id: "FR-M06", req: "Admin can manually approve, reject, or request additional info on applications" },
            ].map((item) => (
              <div key={item.id} className="flex gap-3 items-start p-3 rounded-lg bg-primary-foreground/5">
                <Badge variant="outline" className="text-xs font-mono shrink-0 mt-0.5 border-primary-foreground/30 text-primary-foreground/70">{item.id}</Badge>
                <span className="text-sm text-primary-foreground/70">{item.req}</span>
              </div>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* UI/UX Requirements */}
      <PitchSection id="uiux">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Smartphone className="h-3 w-3 mr-1" /> UI/UX Requirements</Badge>
            <h2 className="text-4xl font-bold text-primary">Design & Experience</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Smartphone, title: "Responsive Design", desc: "All pages must render correctly on mobile (320px), tablet (768px), and desktop (1280px+) viewports" },
              { icon: Printer, title: "Print Support", desc: "Key pages (directory, profiles, pitch) must be print-optimized with @media print styles" },
              { icon: Eye, title: "Accessibility", desc: "WCAG 2.1 AA compliance: proper contrast ratios, alt text, keyboard navigation, semantic HTML" },
              { icon: Globe, title: "SEO Optimized", desc: "Semantic HTML, meta tags, Open Graph, JSON-LD structured data for products and organization" },
              { icon: Zap, title: "Performance", desc: "Lighthouse score 90+ on all metrics, lazy loading for images, code splitting for routes" },
              { icon: Shield, title: "Brand Consistency", desc: "Navy blue & gold design system, consistent typography, heritage badges, corporate tone" },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-5 space-y-2">
                  <item.icon className="h-6 w-6 text-accent" />
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
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
                { cat: "Security", req: "Authentication", target: "Email/password + OAuth" },
                { cat: "Security", req: "Authorization", target: "Role-based access (RLS)" },
                { cat: "Security", req: "Data encryption", target: "TLS 1.3 in transit" },
                { cat: "SEO", req: "Meta tags & Open Graph", target: "All public pages" },
                { cat: "SEO", req: "Structured data (JSON-LD)", target: "Products & Organization" },
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
        </div>
      </PitchSection>

      {/* Demo Links */}
      <PitchSection id="demos">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Globe className="h-3 w-3 mr-1" /> Live Demos</Badge>
            <h2 className="text-4xl font-bold text-primary">Working Prototypes</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Each module has a functional demo. Click to explore the live implementation.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { label: "Member Directory", path: "/directory", icon: Users, desc: "Search, filter, and browse 350+ member profiles" },
              { label: "Product Catalog", path: "/products", icon: ShoppingBag, desc: "25+ categories with variants & seller links" },
              { label: "Lead Intelligence", path: "/leads", icon: BarChart3, desc: "Expo databases with preview & purchase flow" },
              { label: "Membership Plans", path: "/membership", icon: Shield, desc: "Three-tier membership with feature comparison" },
              { label: "Admin Dashboard", path: "/admin", icon: Settings, desc: "Content management and analytics" },
              { label: "Sales Pitch", path: "/pitch", icon: Megaphone, desc: "Full presentation deck for committee" },
            ].map((item) => (
              <Link key={item.path} to={item.path} className="block print:hidden">
                <Card className="card-hover h-full">
                  <CardContent className="p-5 space-y-2">
                    <item.icon className="h-6 w-6 text-accent" />
                    <h3 className="font-semibold text-foreground">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                    <span className="inline-flex items-center gap-1 text-accent text-sm font-medium">View Demo <ArrowRight className="h-3 w-3" /></span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center pt-6 space-y-4">
            <p className="text-muted-foreground text-sm">Related Documents</p>
            <div className="flex gap-3 justify-center flex-wrap print:hidden">
              <Link to="/pitch"><Button variant="outline">← Pitch</Button></Link>
              <Link to="/sow"><Button variant="outline">← SOW</Button></Link>
              <Link to="/brd"><Button variant="outline">← BRD</Button></Link>
              <Link to="/prd"><Button variant="outline">← PRD</Button></Link>
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

export default FSD;
