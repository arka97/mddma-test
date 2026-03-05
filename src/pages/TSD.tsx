import { Link } from "react-router-dom";
import { PitchSection } from "@/components/pitch/PitchSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Printer, ChevronDown, CheckCircle2, ArrowRight,
  Code, Database, Globe, Shield, Zap, Server,
  Layers, FileText, Lock, Cpu, GitBranch, Box
} from "lucide-react";

const NAV_ITEMS = [
  { id: "cover", label: "Cover" },
  { id: "architecture", label: "Architecture" },
  { id: "stack", label: "Tech Stack" },
  { id: "components", label: "Components" },
  { id: "data", label: "Data Model" },
  { id: "routing", label: "Routing" },
  { id: "backend", label: "Backend" },
  { id: "deployment", label: "Deployment" },
  { id: "security", label: "Security" },
  { id: "performance", label: "Performance" },
];

const TSD = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur border-b border-primary-foreground/10 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
          <span className="text-primary-foreground font-bold text-sm tracking-wide">MDDMA TSD</span>
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
          <Badge className="bg-accent text-primary font-semibold text-sm px-4 py-1">Technical Specification Document</Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            MDDMA<br />
            <span className="gold-gradient-text">Technical Spec</span>
          </h1>
          <p className="text-xl sm:text-2xl text-primary-foreground/70 max-w-2xl mx-auto">
            Architecture, technology stack, data models, and implementation details
          </p>
          <div className="pt-4 text-sm text-primary-foreground/50 space-y-1">
            <p>Prepared for: Mumbai Dry Fruits & Dates Merchants Association</p>
            <p>Document Version: 1.0 · March 2026</p>
          </div>
          <div className="flex gap-3 justify-center pt-2 print:hidden">
            <Link to="/brd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">← BRD</Badge></Link>
            <Link to="/fsd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">← FSD</Badge></Link>
          </div>
          <button onClick={() => scrollTo("architecture")} className="mt-8 inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </button>
        </div>
      </PitchSection>

      {/* Architecture Overview */}
      <PitchSection id="architecture">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Layers className="h-3 w-3 mr-1" /> Architecture Overview</Badge>
            <h2 className="text-4xl font-bold text-primary">System Architecture</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
            <p>The MDDMA platform is built as a <strong className="text-foreground">Single Page Application (SPA)</strong> using React with client-side routing. The architecture follows a component-based pattern with clear separation between layout, pages, features, and UI primitives.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: Globe, label: "Frontend", desc: "React 18 SPA with Vite build system. Client-side routing via React Router. Tailwind CSS for styling." },
              { icon: Server, label: "Backend", desc: "Supabase (PostgreSQL + Auth + Storage + Edge Functions). Managed BaaS with RLS policies." },
              { icon: Cpu, label: "Infrastructure", desc: "Lovable hosting with automatic CI/CD. CDN delivery, SSL certificates, custom domain support." },
            ].map((item) => (
              <Card key={item.label}>
                <CardContent className="p-5 space-y-2">
                  <item.icon className="h-6 w-6 text-accent" />
                  <h3 className="font-semibold text-foreground">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-3">Component Hierarchy</h3>
              <pre className="text-xs text-muted-foreground font-mono overflow-x-auto whitespace-pre">{`App
├── BrowserRouter
│   ├── Layout (Header + Footer)
│   │   ├── Index (Homepage)
│   │   ├── Directory → MemberProfile
│   │   ├── Products → ProductPage
│   │   ├── LeadIntelligence
│   │   ├── MembershipPlans
│   │   ├── Admin
│   │   └── ...other pages
│   └── Standalone Pages
│       ├── SalesPitch
│       ├── BRD / FSD / TSD
│       └── Login
├── QueryClientProvider (TanStack Query)
├── TooltipProvider
└── Toaster (Notifications)`}</pre>
            </CardContent>
          </Card>
        </div>
      </PitchSection>

      {/* Technology Stack */}
      <PitchSection id="stack" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Code className="h-3 w-3 mr-1" /> Technology Stack</Badge>
            <h2 className="text-4xl font-bold">Core Technologies</h2>
          </div>
          <Table className="border border-primary-foreground/20 rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow className="border-primary-foreground/20 hover:bg-transparent">
                <TableHead className="text-primary-foreground/70">Category</TableHead>
                <TableHead className="text-primary-foreground/70">Technology</TableHead>
                <TableHead className="text-primary-foreground/70">Purpose</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { cat: "Framework", tech: "React 18", purpose: "Component-based UI library with hooks" },
                { cat: "Language", tech: "TypeScript", purpose: "Type safety, better DX, catch errors at compile time" },
                { cat: "Build Tool", tech: "Vite", purpose: "Fast HMR, optimized production builds, ESM-native" },
                { cat: "Styling", tech: "Tailwind CSS", purpose: "Utility-first CSS with design tokens" },
                { cat: "UI Components", tech: "shadcn/ui", purpose: "Accessible, customizable component primitives" },
                { cat: "Routing", tech: "React Router v6", purpose: "Client-side routing with nested routes" },
                { cat: "Data Fetching", tech: "TanStack Query v5", purpose: "Server state management, caching, mutations" },
                { cat: "Charts", tech: "Recharts", purpose: "Admin dashboard analytics and visualizations" },
                { cat: "Forms", tech: "React Hook Form + Zod", purpose: "Performant forms with schema validation" },
                { cat: "Icons", tech: "Lucide React", purpose: "Consistent, tree-shakable icon library" },
                { cat: "Notifications", tech: "Sonner + Toast", purpose: "User feedback via toast notifications" },
                { cat: "Backend", tech: "Supabase", purpose: "PostgreSQL, Auth, Storage, Edge Functions" },
              ].map((row, i) => (
                <TableRow key={i} className="border-primary-foreground/10 hover:bg-primary-foreground/5">
                  <TableCell className="font-medium text-primary-foreground">{row.cat}</TableCell>
                  <TableCell className="text-accent font-semibold">{row.tech}</TableCell>
                  <TableCell className="text-primary-foreground/70 text-sm">{row.purpose}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PitchSection>

      {/* Component Architecture */}
      <PitchSection id="components">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Box className="h-3 w-3 mr-1" /> Component Architecture</Badge>
            <h2 className="text-4xl font-bold text-primary">Component Organization</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Layout Components", items: ["Header — Global navigation with responsive mobile menu", "Footer — Site links, contact info, social media", "Layout — Wrapper combining Header + Footer + main content area"] },
              { title: "Page Components", items: ["Each route maps to a page in src/pages/", "Pages compose feature sections and UI components", "Standalone pages (Pitch, BRD, FSD, TSD) skip the Layout wrapper"] },
              { title: "Feature Components", items: ["Home sections: Hero, FeaturedCategories, FeaturedMembers, News, Sponsors", "Pitch components: PitchSection for presentation-style layouts", "NavLink: Reusable navigation link with active state"] },
              { title: "UI Primitives (shadcn/ui)", items: ["50+ accessible components: Button, Card, Dialog, Table, Badge, etc.", "Customized via Tailwind design tokens in index.css", "CVA-based variants for consistent styling"] },
            ].map((group) => (
              <Card key={group.title}>
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-semibold text-primary">{group.title}</h3>
                  <ul className="space-y-2">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
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

      {/* Data Model */}
      <PitchSection id="data" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Database className="h-3 w-3 mr-1" /> Data Model</Badge>
            <h2 className="text-4xl font-bold">Core Data Interfaces</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { name: "Member", fields: ["id, name, slug, companyName", "logo, description, address, city", "phone, email, whatsapp, website", "products: string[], memberSince", "membershipTier, isVerified, isFeatured", "isSponsored, gstNumber, fssaiNumber"] },
              { name: "Product", fields: ["id, name, slug, category", "description, image, origin", "variants: ProductVariant[]", "sellers: Member[], affiliateLinks", "packagingFormats: string[]"] },
              { name: "LeadPack", fields: ["id, name, expoName, year", "exhibitorCount, price, memberPrice", "description, previewData", "dataFields: string[], isActive"] },
              { name: "MembershipTier", fields: ["id, name, price, period", "features: string[], highlighted", "maxProducts, maxLeadPacks", "adDiscount, supportLevel"] },
            ].map((model) => (
              <Card key={model.name} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-semibold text-accent font-mono">interface {model.name}</h3>
                  <div className="space-y-1">
                    {model.fields.map((f) => (
                      <p key={f} className="text-xs text-primary-foreground/60 font-mono pl-3 border-l-2 border-accent/30">{f}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Routing */}
      <PitchSection id="routing">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><GitBranch className="h-3 w-3 mr-1" /> Routing</Badge>
            <h2 className="text-4xl font-bold text-primary">Application Routes</h2>
          </div>
          <Table className="border rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead>Path</TableHead>
                <TableHead>Component</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Auth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { path: "/", comp: "Index", desc: "Homepage with hero, categories, members, news", auth: "Public" },
                { path: "/about", comp: "About", desc: "Association history and information", auth: "Public" },
                { path: "/directory", comp: "Directory", desc: "Searchable member directory", auth: "Public" },
                { path: "/directory/:slug", comp: "MemberProfile", desc: "Individual member profile", auth: "Public" },
                { path: "/products", comp: "Products", desc: "Product category listing", auth: "Public" },
                { path: "/products/:slug", comp: "ProductPage", desc: "Product detail with variants", auth: "Public" },
                { path: "/leads", comp: "LeadIntelligence", desc: "Lead pack marketplace", auth: "Public" },
                { path: "/membership", comp: "MembershipPlans", desc: "Tier comparison & application", auth: "Public" },
                { path: "/admin", comp: "Admin", desc: "Admin dashboard", auth: "Admin" },
                { path: "/login", comp: "Login", desc: "Authentication page", auth: "Public" },
                { path: "/pitch", comp: "SalesPitch", desc: "Sales presentation deck", auth: "Public" },
                { path: "/brd", comp: "BRD", desc: "Business Requirements Document", auth: "Public" },
                { path: "/fsd", comp: "FSD", desc: "Functional Specification Document", auth: "Public" },
                { path: "/tsd", comp: "TSD", desc: "Technical Specification Document", auth: "Public" },
              ].map((r) => (
                <TableRow key={r.path}>
                  <TableCell className="font-mono text-sm text-accent">{r.path}</TableCell>
                  <TableCell className="font-medium">{r.comp}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.desc}</TableCell>
                  <TableCell><Badge variant={r.auth === "Admin" ? "destructive" : "outline"} className="text-xs">{r.auth}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PitchSection>

      {/* Backend Integration */}
      <PitchSection id="backend" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Server className="h-3 w-3 mr-1" /> Backend Integration</Badge>
            <h2 className="text-4xl font-bold">Supabase Architecture</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4 text-primary-foreground/70">
            <p>The backend is powered by <strong className="text-primary-foreground">Supabase</strong>, providing PostgreSQL database, authentication, file storage, and edge functions as a managed Backend-as-a-Service.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold text-accent">Database Tables</h3>
                <ul className="space-y-2 text-sm text-primary-foreground/70">
                  {["members — Company profiles & contact info", "products — Product catalog with variants", "lead_packs — Expo databases for sale", "advertisements — Banner ads & placements", "membership_applications — Application queue", "user_roles — Role-based access control", "circulars — Association announcements"].map((t) => (
                    <li key={t} className="flex items-start gap-2"><Database className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />{t}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold text-accent">RLS Policies</h3>
                <ul className="space-y-2 text-sm text-primary-foreground/70">
                  {["Public read access for directory & products", "Members can update their own profiles", "Admin role required for write operations", "Lead pack downloads restricted to purchasers", "user_roles checked via security definer function", "Application data visible only to applicant & admin"].map((p) => (
                    <li key={p} className="flex items-start gap-2"><Shield className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />{p}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </PitchSection>

      {/* Deployment */}
      <PitchSection id="deployment">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Globe className="h-3 w-3 mr-1" /> Deployment</Badge>
            <h2 className="text-4xl font-bold text-primary">Hosting & CI/CD</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: Globe, title: "Lovable Hosting", desc: "Automatic deployment on every commit. Global CDN delivery, SSL certificates, and custom domain support included." },
              { icon: GitBranch, title: "CI/CD Pipeline", desc: "Git-based workflow with automatic builds. Preview deployments for testing before production." },
              { icon: Server, title: "Environment Config", desc: "Supabase URL and anon key configured via environment variables. Secrets managed securely through platform settings." },
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

      {/* Security */}
      <PitchSection id="security" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Lock className="h-3 w-3 mr-1" /> Security</Badge>
            <h2 className="text-4xl font-bold">Security Considerations</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { title: "Authentication", desc: "Supabase Auth with email/password and OAuth providers. JWT-based session management with automatic token refresh." },
              { title: "Role-Based Access", desc: "Separate user_roles table with security definer function. Admin checks never rely on client-side storage." },
              { title: "Input Validation", desc: "Zod schemas validate all form inputs. Server-side validation via RLS policies and database constraints." },
              { title: "Data Protection", desc: "TLS 1.3 encryption in transit. Row-level security on all tables. No sensitive data stored in localStorage." },
            ].map((item) => (
              <Card key={item.title} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <CardContent className="p-5 space-y-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-primary-foreground/70">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Performance */}
      <PitchSection id="performance">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Zap className="h-3 w-3 mr-1" /> Performance</Badge>
            <h2 className="text-4xl font-bold text-primary">Performance Strategy</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: Code, title: "Code Splitting", desc: "Route-based lazy loading with React.lazy() and Suspense. Only load code for the current page." },
              { icon: Zap, title: "Caching Strategy", desc: "TanStack Query provides automatic caching, background refetching, and stale-while-revalidate patterns." },
              { icon: Globe, title: "Asset Optimization", desc: "Vite's tree-shaking, minification, and asset hashing. Lazy-loaded images with placeholder fallbacks." },
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
          <div className="text-center pt-6 space-y-4">
            <p className="text-muted-foreground text-sm">Related Documents</p>
            <div className="flex gap-3 justify-center print:hidden">
              <Link to="/brd"><Button variant="outline">← BRD</Button></Link>
              <Link to="/fsd"><Button variant="outline">← FSD</Button></Link>
              <Link to="/pitch"><Button variant="outline">Sales Pitch <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
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

export default TSD;
