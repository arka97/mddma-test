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
  ShoppingBag, BarChart3, MessageSquare, Gavel, Brain, Eye
} from "lucide-react";

const NAV_ITEMS = [
  { id: "cover", label: "Cover" },
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "behavioral", label: "Behavioral Layer" },
  { id: "dataflow", label: "Data Flow" },
  { id: "modules", label: "Modules" },
  { id: "database", label: "Database" },
  { id: "api", label: "API" },
  { id: "principles", label: "Principles" },
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
            Architecture with Behavioral Intelligence Layer for the controlled negotiation marketplace
          </p>
          <div className="pt-4 text-sm text-primary-foreground/50 space-y-1">
            <p>Document Version: 3.0 · April 2026</p>
          </div>
          <div className="flex gap-2 justify-center pt-2 flex-wrap print:hidden">
            <Link to="/brd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">← BRD</Badge></Link>
            <Link to="/prd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">← PRD</Badge></Link>
            <Link to="/fsd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">← FRD</Badge></Link>
            <Link to="/tsd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">TSD →</Badge></Link>
          </div>
          <button onClick={() => scrollTo("overview")} className="mt-8 inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </button>
        </div>
      </PitchSection>

      {/* Overview */}
      <PitchSection id="overview">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Layers className="h-3 w-3 mr-1" /> Solution Overview</Badge>
            <h2 className="text-4xl font-bold text-primary">Design Philosophy</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
            <p>The MDDMA platform is a <strong className="text-foreground">Behavioral Trade Operating System</strong> — a modular SPA with a critical new layer: the <strong className="text-foreground">Behavioral Intelligence Layer</strong> that sits between the frontend and API, handling price masking, stock band calculation, market signal generation, and RFQ routing.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Box, title: "Modularity", desc: "Independent modules with own components, data, routes" },
              { icon: Brain, title: "Behavioral Intelligence", desc: "Price masking, stock bands, nudges between frontend & API" },
              { icon: Shield, title: "Security", desc: "RLS, RBAC, private RFQ responses, price data protection" },
              { icon: Globe, title: "Scalability", desc: "Supabase managed backend scales with growth" },
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

      {/* Architecture */}
      <PitchSection id="architecture" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Layers className="h-3 w-3 mr-1" /> System Architecture</Badge>
            <h2 className="text-4xl font-bold">Architecture with Behavioral Layer</h2>
          </div>
          <Card className="bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <Badge className="bg-accent/20 text-accent border-0 mb-2">Client Layer</Badge>
                  <div className="grid grid-cols-3 gap-3">
                    {["Desktop Browser", "Mobile Browser", "Print / PDF"].map((c) => (
                      <div key={c} className="p-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/15 text-xs text-center">{c}</div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center"><div className="w-0.5 h-6 bg-accent/30" /></div>
                <div className="text-center">
                  <Badge className="bg-accent/20 text-accent border-0 mb-2">Frontend — React SPA</Badge>
                  <div className="grid grid-cols-4 gap-2">
                    {["React Router", "React Context (RBAC)", "TanStack Query", "shadcn/ui + Tailwind"].map((c) => (
                      <div key={c} className="p-2 rounded bg-primary-foreground/10 border border-primary-foreground/15 text-[10px] text-center">{c}</div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center"><div className="w-0.5 h-6 bg-accent/30" /></div>
                {/* NEW: Behavioral Intelligence Layer */}
                <div className="text-center">
                  <Badge className="bg-destructive/20 text-destructive border-0 mb-2">🧠 Behavioral Intelligence Layer — NEW</Badge>
                  <div className="grid grid-cols-4 gap-2">
                    {["Price Masking Logic", "Stock Band Calc", "Market Signal Gen", "RFQ Routing Engine"].map((c) => (
                      <div key={c} className="p-2 rounded bg-destructive/10 border border-destructive/20 text-[10px] text-center font-medium">{c}</div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center"><div className="w-0.5 h-6 bg-accent/30" /></div>
                <div className="text-center">
                  <Badge className="bg-accent/20 text-accent border-0 mb-2">API Layer — Supabase</Badge>
                  <div className="grid grid-cols-4 gap-2">
                    {["REST API", "Auth (JWT)", "Storage (S3)", "Edge Functions"].map((c) => (
                      <div key={c} className="p-2 rounded bg-accent/10 border border-accent/20 text-[10px] text-center font-medium">{c}</div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center"><div className="w-0.5 h-6 bg-accent/30" /></div>
                <div className="text-center">
                  <Badge className="bg-accent/20 text-accent border-0 mb-2">Data Layer — PostgreSQL</Badge>
                  <div className="grid grid-cols-5 gap-2">
                    {["members", "products", "inquiries", "bids", "user_roles"].map((c) => (
                      <div key={c} className="p-2 rounded bg-primary-foreground/10 border border-primary-foreground/15 text-[10px] text-center font-mono">{c}</div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PitchSection>

      {/* Behavioral Intelligence Layer — NEW */}
      <PitchSection id="behavioral">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Brain className="h-3 w-3 mr-1" /> Behavioral Intelligence Layer</Badge>
            <h2 className="text-4xl font-bold text-primary">The Intelligence Between Frontend & API</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: "Price Masking Logic", desc: "Transforms exact prices into ranges based on role. Free members see ranges; paid members choose full masking. Market reference calculated from aggregated seller data.", icon: Eye },
              { title: "Stock Band Calculator", desc: "Converts exact inventory quantities into bands: High (>500kg), Medium (100-500kg), Low (<100kg), On Order. 'Fast Moving' flag added when depletion rate exceeds threshold.", icon: ShoppingBag },
              { title: "Market Signal Generator", desc: "Analyzes price history to generate trend direction (↑ ↓ →). Calculates demand score from RFQ volume. Produces supply signals from stock band distributions.", icon: BarChart3 },
              { title: "RFQ Routing Engine", desc: "Distributes buyer RFQs to selected sellers. Tracks response times. Calculates seller performance scores. Generates conversion funnel analytics for admin.", icon: Gavel },
            ].map((item) => (
              <Card key={item.title} className="border-accent/20">
                <CardContent className="p-6 space-y-3">
                  <item.icon className="h-6 w-6 text-accent" />
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Data Flow */}
      <PitchSection id="dataflow" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><GitBranch className="h-3 w-3 mr-1" /> Data Flow</Badge>
            <h2 className="text-4xl font-bold">Key Data Flows</h2>
          </div>
          <div className="space-y-6">
            {[
              { title: "RFQ Inquiry Flow (v3.0)", steps: ["Buyer browses → sees price ranges, stock bands, trends", "Clicks 'Request Best Price' on 1+ products", "Multi-step form: Product → Qty → Timeline → Message", "RFQ distributed to selected sellers simultaneously", "Behavioral layer: scores buyer, assigns priority", "Seller sees prioritized RFQ in CRM (Hot/Warm/Cold)", "Seller responds privately → buyer compares quotes"] },
              { title: "Price Masking Flow", steps: ["Seller enters exact price in storefront admin", "Behavioral layer calculates min-max range", "Market reference price computed from aggregated data", "Guest/Free see: Price Range + Market Ref", "Paid members: 'Request Best Price' only", "Exact prices never exposed to any public role"] },
            ].map((flow) => (
              <Card key={flow.title} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-accent">{flow.title}</h3>
                  <div className="flex flex-wrap gap-2 items-center">
                    {flow.steps.map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10">
                          <span className="h-5 w-5 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent flex-shrink-0">{i + 1}</span>
                          <span className="text-xs text-primary-foreground/70">{step}</span>
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
      <PitchSection id="modules">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Box className="h-3 w-3 mr-1" /> Module Design</Badge>
            <h2 className="text-4xl font-bold text-primary">Module Architecture</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Users, title: "Directory Module", components: ["Directory.tsx — Search & filter grid", "MemberProfile.tsx — Full member page", "Storefront.tsx — Seller catalog view"], data: "members, products" },
              { icon: ShoppingBag, title: "Marketplace Module", components: ["Products.tsx — Category browser", "ProductPage.tsx — Controlled product display", "Smart listing: range, band, trend, RFQ CTA"], data: "products, commodities" },
              { icon: Gavel, title: "RFQ Engine Module", components: ["RFQForm — Multi-step inquiry", "RFQRouter — Distribute to sellers", "RFQTracker — Response monitoring"], data: "inquiries, rfq_responses" },
              { icon: BarChart3, title: "Intelligence Module", components: ["Market.tsx — Signals & trends", "Dashboard.tsx — Behavioral CRM", "LeadScoring — Hot/Warm/Cold"], data: "inquiries, market_data" },
              { icon: MessageSquare, title: "Community Module", components: ["Community.tsx — Forum preview", "DiscourseEmbed — Topic cards", "ProductDiscussions — Per-product threads"], data: "Discourse API" },
              { icon: Shield, title: "Admin Module", components: ["Admin.tsx — Dashboard & tools", "RFQMonitor — Engine analytics", "MarketSignalManager — Edit signals"], data: "all tables (admin RLS)" },
            ].map((mod) => (
              <Card key={mod.title}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <mod.icon className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold">{mod.title}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {mod.components.map((c) => (
                      <li key={c} className="text-xs text-muted-foreground font-mono pl-3 border-l-2 border-accent/30">{c}</li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-muted-foreground/60">Data: {mod.data}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Database Design — UPDATED */}
      <PitchSection id="database" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Database className="h-3 w-3 mr-1" /> Database Design</Badge>
            <h2 className="text-4xl font-bold">Updated Data Model</h2>
          </div>
          <Card className="bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { table: "products (UPDATED)", fields: ["id UUID PK", "seller_id UUID FK → users", "commodity_id UUID FK", "price_min NUMERIC — NEW", "price_max NUMERIC — NEW", "stock_band ENUM (high/medium/low/on_order) — NEW", "demand_score INT — NEW", "trend_direction ENUM (rising/falling/stable) — NEW", "variant TEXT, origin TEXT", "moq INT, packaging TEXT"], color: "border-destructive" },
                  { table: "inquiries (UPDATED)", fields: ["id UUID PK", "product_id UUID FK", "sender_name TEXT", "multi_seller_flag BOOLEAN — NEW", "priority_score INT — NEW", "seller_response_time INTERVAL — NEW", "status inquiry_status", "created_at TIMESTAMPTZ"], color: "border-destructive" },
                  { table: "rfq_responses (NEW)", fields: ["id UUID PK", "inquiry_id UUID FK → inquiries", "seller_id UUID FK → users", "quoted_price NUMERIC", "message TEXT", "responded_at TIMESTAMPTZ", "status ENUM (pending/sent/viewed)"], color: "border-destructive" },
                  { table: "members", fields: ["user_id UUID FK → users", "slug TEXT UNIQUE", "description TEXT", "years_in_business INT", "certifications TEXT[]", "whatsapp_number TEXT"], color: "border-accent" },
                  { table: "user_roles", fields: ["id UUID PK", "user_id UUID FK → auth.users", "role app_role", "UNIQUE(user_id, role)"], color: "border-accent" },
                  { table: "market_signals (NEW)", fields: ["id UUID PK", "commodity_id UUID FK", "price_trend ENUM (rising/falling/stable)", "demand_level ENUM (hot/active/normal)", "supply_status TEXT", "updated_at TIMESTAMPTZ"], color: "border-destructive" },
                ].map((t) => (
                  <Card key={t.table} className={`border-l-4 ${t.color} bg-primary-foreground/5`}>
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-mono font-semibold text-sm text-accent">{t.table}</h4>
                      <div className="space-y-1">
                        {t.fields.map((f) => (
                          <p key={f} className={`text-[11px] font-mono ${f.includes("NEW") ? "text-destructive font-semibold" : "text-primary-foreground/60"}`}>{f}</p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PitchSection>

      {/* API Design */}
      <PitchSection id="api">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Code className="h-3 w-3 mr-1" /> API Design</Badge>
            <h2 className="text-4xl font-bold text-primary">API Endpoints (Updated)</h2>
          </div>
          <Table className="border rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Auth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { method: "GET", endpoint: "/rest/v1/members", desc: "List members with filters", auth: "Public" },
                { method: "GET", endpoint: "/rest/v1/products", desc: "List products (price ranges only)", auth: "Public" },
                { method: "POST", endpoint: "/rest/v1/inquiries", desc: "Submit RFQ (multi-seller)", auth: "Public" },
                { method: "POST", endpoint: "/rest/v1/rfq_responses", desc: "Seller responds to RFQ (private)", auth: "Member" },
                { method: "GET", endpoint: "/functions/v1/market-signals", desc: "Get market signals by commodity", auth: "Public" },
                { method: "GET", endpoint: "/functions/v1/rfq-analytics", desc: "RFQ engine performance metrics", auth: "Admin" },
                { method: "PATCH", endpoint: "/rest/v1/products?id=eq.{id}", desc: "Update stock band, trend direction", auth: "Member" },
              ].map((api, i) => (
                <TableRow key={i}>
                  <TableCell><Badge className={`text-xs ${api.method === "GET" ? "bg-accent/20 text-accent" : api.method === "POST" ? "bg-green-500/20 text-green-600" : "bg-blue-500/20 text-blue-600"} border-0`}>{api.method}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{api.endpoint}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{api.desc}</TableCell>
                  <TableCell><Badge variant={api.auth === "Admin" ? "destructive" : "outline"} className="text-xs">{api.auth}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PitchSection>

      {/* Design Principles */}
      <PitchSection id="principles" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Brain className="h-3 w-3 mr-1" /> Platform Design Principles</Badge>
            <h2 className="text-4xl font-bold">Behavioral Operating Principles</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Controlled Transparency", desc: "Show signals, not exact data" },
              { title: "Negotiation-First Design", desc: "Replace price display with RFQ" },
              { title: "Trust Acceleration", desc: "Verification > price" },
              { title: "Cognitive Simplicity", desc: "Reduce decision fatigue" },
              { title: "Behavioral Nudging", desc: "Guide user actions intentionally" },
              { title: "Platform Control", desc: "Structure and control market interactions" },
            ].map((item) => (
              <Card key={item.title} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <CardContent className="p-5 space-y-2">
                  <h3 className="font-semibold text-accent">{item.title}</h3>
                  <p className="text-sm text-primary-foreground/70">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="bg-accent/10 border-accent/30 text-primary-foreground">
            <CardContent className="p-6 text-center">
              <p className="text-lg font-semibold italic">"This platform does not expose the market — it structures and controls it."</p>
            </CardContent>
          </Card>
        </div>
      </PitchSection>

      {/* Security */}
      <PitchSection id="security">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Lock className="h-3 w-3 mr-1" /> Security Design</Badge>
            <h2 className="text-4xl font-bold text-primary">Security Architecture</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { title: "Price Data Protection", desc: "Exact prices stored in DB but never exposed via API to unauthorized roles. Behavioral layer transforms to ranges. RLS enforces price column visibility per role." },
              { title: "RFQ Privacy", desc: "Seller responses stored in rfq_responses table. RLS ensures only requesting buyer and responding seller can see each response. Cross-seller data never exposed." },
              { title: "Authentication & RBAC", desc: "Supabase Auth with JWT. 5-role system via user_roles table. has_role() security definer function prevents RLS recursion." },
              { title: "Input Validation", desc: "Zod schemas validate all RFQ forms. Rate limiting: 10 RFQs/day per buyer. Server-side constraints on all tables." },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-5 space-y-2">
                  <h3 className="font-semibold text-primary">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center pt-6">
            <div className="flex gap-3 justify-center flex-wrap print:hidden">
              <Link to="/brd"><Button variant="outline">← BRD</Button></Link>
              <Link to="/fsd"><Button variant="outline">← FRD</Button></Link>
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

export default SDD;
