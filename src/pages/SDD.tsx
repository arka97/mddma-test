import { Link } from "react-router-dom";
import { PitchSection } from "@/components/pitch/PitchSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Printer, ChevronDown, CheckCircle2, ArrowRight,
  Layers, Database, Globe, Shield, Server,
  Code, GitBranch, Box, Lock, Zap, Users,
  ShoppingBag, BarChart3, MessageSquare, Gavel
} from "lucide-react";

const NAV_ITEMS = [
  { id: "cover", label: "Cover" },
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "dataflow", label: "Data Flow" },
  { id: "modules", label: "Modules" },
  { id: "database", label: "Database" },
  { id: "api", label: "API Design" },
  { id: "integration", label: "Integrations" },
  { id: "security", label: "Security" },
];

const SDD = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur border-b border-primary-foreground/10 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
          <span className="text-primary-foreground font-bold text-sm tracking-wide">MDDMA SDD</span>
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
          <Badge className="bg-accent text-primary font-semibold text-sm px-4 py-1">Solution Design Document</Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            MDDMA<br />
            <span className="gold-gradient-text">Solution Design</span>
          </h1>
          <p className="text-xl sm:text-2xl text-primary-foreground/70 max-w-2xl mx-auto">
            System architecture, data flows, module design, and integration patterns for the MDDMA B2B Trade Platform
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
            <Link to="/fsd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">← FRD</Badge></Link>
            <Link to="/tsd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">TSD →</Badge></Link>
            <Link to="/mvp-canvas"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">MVP Canvas →</Badge></Link>
          </div>
          <button onClick={() => scrollTo("overview")} className="mt-8 inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </button>
        </div>
      </PitchSection>

      {/* Solution Overview */}
      <PitchSection id="overview">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Layers className="h-3 w-3 mr-1" /> Solution Overview</Badge>
            <h2 className="text-4xl font-bold text-primary">Design Philosophy</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
            <p>The MDDMA platform is designed as a <strong className="text-foreground">modular, component-driven SPA</strong> with clear separation between presentation, business logic, and data layers. The solution prioritizes:</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Box, title: "Modularity", desc: "Each feature is an independent module with its own components, data, and routes" },
              { icon: Zap, title: "Performance", desc: "Route-based code splitting, lazy loading, and optimistic UI updates" },
              { icon: Shield, title: "Security", desc: "Row-level security, role-based access, and server-side validation" },
              { icon: Globe, title: "Scalability", desc: "Supabase managed backend scales automatically with user growth" },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-5 space-y-2">
                  <item.icon className="h-6 w-6 text-accent" />
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* System Architecture */}
      <PitchSection id="architecture" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Layers className="h-3 w-3 mr-1" /> System Architecture</Badge>
            <h2 className="text-4xl font-bold">Architecture Diagram</h2>
          </div>
          {/* Visual Architecture Diagram */}
          <Card className="bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Client Layer */}
                <div className="text-center">
                  <Badge className="bg-accent/20 text-accent border-0 mb-2">Client Layer</Badge>
                  <div className="grid grid-cols-3 gap-3">
                    {["Desktop Browser", "Mobile Browser", "Print / PDF"].map((c) => (
                      <div key={c} className="p-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/15 text-xs text-center">{c}</div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center"><div className="w-0.5 h-6 bg-accent/30" /></div>
                {/* Frontend Layer */}
                <div className="text-center">
                  <Badge className="bg-accent/20 text-accent border-0 mb-2">Frontend — React SPA</Badge>
                  <div className="grid grid-cols-4 gap-2">
                    {["React Router", "React Context (RBAC)", "TanStack Query", "shadcn/ui + Tailwind"].map((c) => (
                      <div key={c} className="p-2 rounded bg-primary-foreground/10 border border-primary-foreground/15 text-[10px] text-center">{c}</div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center"><div className="w-0.5 h-6 bg-accent/30" /></div>
                {/* API Layer */}
                <div className="text-center">
                  <Badge className="bg-accent/20 text-accent border-0 mb-2">API Layer — Supabase</Badge>
                  <div className="grid grid-cols-4 gap-2">
                    {["REST API", "Auth (JWT)", "Storage (S3)", "Edge Functions"].map((c) => (
                      <div key={c} className="p-2 rounded bg-accent/10 border border-accent/20 text-[10px] text-center font-medium">{c}</div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center"><div className="w-0.5 h-6 bg-accent/30" /></div>
                {/* Data Layer */}
                <div className="text-center">
                  <Badge className="bg-accent/20 text-accent border-0 mb-2">Data Layer — PostgreSQL</Badge>
                  <div className="grid grid-cols-5 gap-2">
                    {["members", "products", "inquiries", "bids", "user_roles"].map((c) => (
                      <div key={c} className="p-2 rounded bg-primary-foreground/10 border border-primary-foreground/15 text-[10px] text-center font-mono">{c}</div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center"><div className="w-0.5 h-6 bg-accent/30" /></div>
                {/* External Layer */}
                <div className="text-center">
                  <Badge className="bg-accent/20 text-accent border-0 mb-2">External Integrations</Badge>
                  <div className="grid grid-cols-3 gap-3">
                    {["WhatsApp API (wa.me)", "Discourse Forum", "Affiliate Links"].map((c) => (
                      <div key={c} className="p-2 rounded bg-primary-foreground/10 border border-primary-foreground/15 text-[10px] text-center">{c}</div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PitchSection>

      {/* Data Flow */}
      <PitchSection id="dataflow">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><GitBranch className="h-3 w-3 mr-1" /> Data Flow</Badge>
            <h2 className="text-4xl font-bold text-primary">Key Data Flows</h2>
          </div>
          <div className="space-y-6">
            {[
              { title: "Trade Inquiry Flow", steps: ["Buyer browses directory or marketplace", "Clicks 'Send Inquiry' or 'Bid' on product", "Form captures: product, quantity, message, contact", "Inquiry saved to Supabase `inquiries` table", "Seller sees new lead in CRM dashboard", "WhatsApp notification sent to seller", "Seller updates status: New → Contacted → Negotiation → Converted"] },
              { title: "Member Registration Flow", steps: ["Visitor clicks 'Apply for Membership'", "Fills application form with company details", "Uploads documents: GST cert, FSSAI, photos", "Application saved with status 'Pending'", "Admin reviews in approval queue", "Admin approves → member profile created", "Member receives credentials & can manage storefront"] },
              { title: "Product Bidding Flow", steps: ["Buyer views product on storefront or marketplace", "Clicks 'Place Bid' button", "Enters: quantity, target price, delivery timeline", "Bid saved to `bids` table linked to product & seller", "Seller reviews bids in CRM dashboard", "Seller accepts, counters, or declines bid", "Accepted bid converts to inquiry for fulfillment"] },
            ].map((flow) => (
              <Card key={flow.title}>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-primary">{flow.title}</h3>
                  <div className="flex flex-wrap gap-2 items-center">
                    {flow.steps.map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border/50">
                          <span className="h-5 w-5 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent flex-shrink-0">{i + 1}</span>
                          <span className="text-xs text-muted-foreground">{step}</span>
                        </div>
                        {i < flow.steps.length - 1 && <ArrowRight className="h-3 w-3 text-accent flex-shrink-0 hidden sm:block" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Module Design */}
      <PitchSection id="modules" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Box className="h-3 w-3 mr-1" /> Module Design</Badge>
            <h2 className="text-4xl font-bold">Module Architecture</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Users, title: "Directory Module", components: ["Directory.tsx — Search & filter grid", "MemberProfile.tsx — Full member page", "Storefront.tsx — Seller catalog view"], data: "members, products" },
              { icon: ShoppingBag, title: "Marketplace Module", components: ["Products.tsx — Category browser", "ProductPage.tsx — Product detail", "Broker.tsx — Supply/demand board"], data: "products, commodities, broker_listings" },
              { icon: Gavel, title: "Bidding Module", components: ["BidForm component — Quantity, price, timeline", "BidList in CRM — Seller bid review", "BidStatus — Accept/counter/decline"], data: "bids, products, inquiries" },
              { icon: BarChart3, title: "Intelligence Module", components: ["Market.tsx — Price charts & signals", "LeadIntelligence.tsx — Expo packs", "Dashboard.tsx — CRM pipeline"], data: "inquiries, lead_packs, market_data" },
              { icon: MessageSquare, title: "Community Module", components: ["Community.tsx — Forum preview", "DiscourseEmbed — Topic cards", "ProductDiscussions — Per-product threads"], data: "Discourse API (external)" },
              { icon: Shield, title: "Admin Module", components: ["Admin.tsx — Dashboard & tools", "MemberApprovals — Application queue", "CircularManager — Publish & distribute"], data: "all tables (admin RLS)" },
            ].map((mod) => (
              <Card key={mod.title} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <mod.icon className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold">{mod.title}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {mod.components.map((c) => (
                      <li key={c} className="text-xs text-primary-foreground/60 font-mono pl-3 border-l-2 border-accent/30">{c}</li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-primary-foreground/40">Data: {mod.data}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Database Design */}
      <PitchSection id="database">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Database className="h-3 w-3 mr-1" /> Database Design</Badge>
            <h2 className="text-4xl font-bold text-primary">Entity Relationship</h2>
          </div>
          {/* ER Diagram Visual */}
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { table: "users", fields: ["id UUID PK", "email TEXT UNIQUE", "role app_role", "company_name TEXT", "location TEXT", "verified BOOLEAN", "created_at TIMESTAMPTZ"], color: "border-accent" },
                  { table: "members", fields: ["user_id UUID FK → users", "slug TEXT UNIQUE", "description TEXT", "years_in_business INT", "certifications TEXT[]", "markets_served TEXT[]", "whatsapp_number TEXT"], color: "border-accent" },
                  { table: "commodities", fields: ["id UUID PK", "name TEXT", "category TEXT", "variants JSONB", "origins TEXT[]"], color: "border-accent" },
                  { table: "products", fields: ["id UUID PK", "seller_id UUID FK → users", "commodity_id UUID FK", "variant TEXT", "origin TEXT", "packaging TEXT", "moq INT", "price NUMERIC", "stock_available BOOLEAN", "location TEXT"], color: "border-accent" },
                  { table: "inquiries", fields: ["id UUID PK", "product_id UUID FK", "sender_name TEXT", "sender_email TEXT", "message TEXT", "quantity INT", "status inquiry_status", "created_at TIMESTAMPTZ"], color: "border-accent" },
                  { table: "bids", fields: ["id UUID PK", "product_id UUID FK", "bidder_name TEXT", "bidder_email TEXT", "quantity INT", "target_price NUMERIC", "delivery_timeline TEXT", "status bid_status", "created_at TIMESTAMPTZ"], color: "border-accent" },
                  { table: "circulars", fields: ["id UUID PK", "title TEXT", "content TEXT", "published_at TIMESTAMPTZ", "audience TEXT"], color: "border-accent" },
                  { table: "advertisements", fields: ["id UUID PK", "title TEXT", "image_url TEXT", "target_url TEXT", "placement TEXT", "start_date DATE", "end_date DATE", "clicks INT", "impressions INT"], color: "border-accent" },
                  { table: "user_roles", fields: ["id UUID PK", "user_id UUID FK → auth.users", "role app_role", "UNIQUE(user_id, role)"], color: "border-destructive" },
                ].map((t) => (
                  <Card key={t.table} className={`border-l-4 ${t.color}`}>
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-mono font-semibold text-sm text-accent">{t.table}</h4>
                      <div className="space-y-1">
                        {t.fields.map((f) => (
                          <p key={f} className="text-[11px] text-muted-foreground font-mono">{f}</p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Relationships */}
              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold text-sm mb-2">Key Relationships</h4>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    "users 1 ←→ 1 members (profile extension)",
                    "users 1 ←→ N products (seller listings)",
                    "products N ←→ 1 commodities (product type)",
                    "products 1 ←→ N inquiries (trade leads)",
                    "products 1 ←→ N bids (buyer offers)",
                    "users 1 ←→ N user_roles (RBAC)",
                  ].map((rel) => (
                    <p key={rel} className="text-xs text-muted-foreground font-mono">{rel}</p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PitchSection>

      {/* API Design */}
      <PitchSection id="api" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Code className="h-3 w-3 mr-1" /> API Design</Badge>
            <h2 className="text-4xl font-bold">API Endpoints</h2>
          </div>
          <Table className="border border-primary-foreground/20 rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow className="border-primary-foreground/20 hover:bg-transparent">
                <TableHead className="text-primary-foreground/70">Method</TableHead>
                <TableHead className="text-primary-foreground/70">Endpoint</TableHead>
                <TableHead className="text-primary-foreground/70">Description</TableHead>
                <TableHead className="text-primary-foreground/70">Auth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { method: "GET", endpoint: "/rest/v1/members", desc: "List all members with filters", auth: "Public" },
                { method: "GET", endpoint: "/rest/v1/members?slug=eq.{slug}", desc: "Get member by slug", auth: "Public" },
                { method: "GET", endpoint: "/rest/v1/products", desc: "List marketplace products", auth: "Public" },
                { method: "POST", endpoint: "/rest/v1/inquiries", desc: "Submit trade inquiry", auth: "Public" },
                { method: "POST", endpoint: "/rest/v1/bids", desc: "Place bid on product", auth: "Public" },
                { method: "PATCH", endpoint: "/rest/v1/inquiries?id=eq.{id}", desc: "Update inquiry status", auth: "Member" },
                { method: "PATCH", endpoint: "/rest/v1/bids?id=eq.{id}", desc: "Accept/decline bid", auth: "Member" },
                { method: "GET", endpoint: "/rest/v1/products?seller_id=eq.{id}", desc: "Get seller's products", auth: "Public" },
                { method: "POST", endpoint: "/rest/v1/members", desc: "Create member profile", auth: "Admin" },
                { method: "POST", endpoint: "/rest/v1/circulars", desc: "Publish circular", auth: "Admin" },
                { method: "GET", endpoint: "/functions/v1/discourse-topics", desc: "Fetch community topics", auth: "Public" },
              ].map((api, i) => (
                <TableRow key={i} className="border-primary-foreground/10 hover:bg-primary-foreground/5">
                  <TableCell><Badge className={`text-xs ${api.method === "GET" ? "bg-accent/20 text-accent" : api.method === "POST" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"} border-0`}>{api.method}</Badge></TableCell>
                  <TableCell className="font-mono text-xs text-primary-foreground/80">{api.endpoint}</TableCell>
                  <TableCell className="text-sm text-primary-foreground/70">{api.desc}</TableCell>
                  <TableCell><Badge variant={api.auth === "Admin" ? "destructive" : "outline"} className={api.auth !== "Admin" ? "border-primary-foreground/30 text-primary-foreground/70" : ""} >{api.auth}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PitchSection>

      {/* Integration Design */}
      <PitchSection id="integration">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Globe className="h-3 w-3 mr-1" /> Integration Design</Badge>
            <h2 className="text-4xl font-bold text-primary">External Integrations</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "WhatsApp Integration", desc: "Pre-filled inquiry messages via wa.me deep links", details: ["Format: wa.me/{number}?text={encoded_message}", "Message includes: product, quantity, buyer info", "Used on: storefronts, product pages, directory", "No API key required — browser-based redirect"] },
              { title: "Discourse Community", desc: "Structured forum at community.mddma.com", details: ["Embed latest topics on homepage via Discourse Embed API", "Per-product discussion threads via topic tags", "SSO with main platform authentication", "Categories: Market Intel, News, Trade, Events, Social"] },
              { title: "Affiliate Links", desc: "Retail purchase links for consumer buyers", details: ["Amazon, Flipkart, BigBasket product links", "Affiliate tracking parameters appended", "Displayed on product detail pages", "Commission tracked via affiliate dashboards"] },
              { title: "Email Notifications", desc: "Transactional emails via Supabase Edge Functions", details: ["New inquiry notification to sellers", "Bid received/accepted alerts", "Membership approval confirmations", "Circular distribution to member emails"] },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-semibold text-lg text-primary">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                  <ul className="space-y-1.5">
                    {item.details.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />{d}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Security Design */}
      <PitchSection id="security" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Lock className="h-3 w-3 mr-1" /> Security Design</Badge>
            <h2 className="text-4xl font-bold">Security Architecture</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { title: "Authentication", desc: "Supabase Auth with email/password and OAuth (Google). JWT tokens with automatic refresh. Session management via httpOnly cookies." },
              { title: "Authorization (RBAC)", desc: "5-role system: Guest, Free Member, Paid Member, Broker, Admin. Roles stored in separate user_roles table. has_role() security definer function prevents RLS recursion." },
              { title: "Row-Level Security", desc: "All tables have RLS enabled. Public read for directory/products. Members can only update their own data. Admin required for write operations on most tables." },
              { title: "Input Validation", desc: "Client-side: Zod schemas validate all form inputs. Server-side: PostgreSQL constraints and check functions. XSS prevention via React's built-in escaping." },
            ].map((item) => (
              <Card key={item.title} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <CardContent className="p-5 space-y-2">
                  <h3 className="font-semibold text-accent">{item.title}</h3>
                  <p className="text-sm text-primary-foreground/70">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* RBAC Visual */}
          <Card className="bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-semibold text-accent mb-4">Role Hierarchy & Permissions</h3>
              <div className="space-y-2">
                {[
                  { role: "Admin", level: "100%", perms: "Full CRUD, approvals, analytics, moderation" },
                  { role: "Paid Member", level: "70%", perms: "RFQ mode, priority listing, advanced CRM, lead packs" },
                  { role: "Broker", level: "55%", perms: "Supply/demand posting, CRM, broker marketplace" },
                  { role: "Free Member", level: "40%", perms: "Storefront, basic CRM, product listings" },
                  { role: "Guest", level: "20%", perms: "Browse directory, view products, send inquiries" },
                ].map((r) => (
                  <div key={r.role} className="flex items-center gap-3">
                    <span className="text-xs font-mono w-28 text-primary-foreground/60">{r.role}</span>
                    <div className="flex-1 h-6 bg-primary-foreground/10 rounded overflow-hidden">
                      <div className="h-full bg-accent/40 rounded flex items-center px-2" style={{ width: r.level }}>
                        <span className="text-[10px] text-primary-foreground/80 truncate">{r.perms}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="text-center pt-6 space-y-4">
            <p className="text-primary-foreground/50 text-sm">Related Documents</p>
            <div className="flex gap-3 justify-center flex-wrap print:hidden">
              <Link to="/pitch"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">← Pitch</Button></Link>
              <Link to="/sow"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">← SOW</Button></Link>
              <Link to="/brd"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">← BRD</Button></Link>
              <Link to="/prd"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">← PRD</Button></Link>
              <Link to="/fsd"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">← FRD</Button></Link>
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

export default SDD;
