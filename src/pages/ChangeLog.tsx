import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2, XCircle, AlertTriangle, Clock, ArrowRight, Lock,
  Users, ShoppingBag, Shield, Database, Zap, Bell, Layers, FileText,
} from "lucide-react";

/**
 * v3.1 LOCKED DECISIONS LOG
 * Supersedes all prior documentation (Pitch v3.0, BRD v3.0, PRD v3.0,
 * FRD v3.0, SDD v3.0, TSD v3.0, MVP Canvas, SOW v3.0).
 */

const Section = ({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) => (
  <section id={id} className="space-y-4">
    <h2 className="text-2xl sm:text-3xl font-bold text-primary border-b border-border pb-2">{title}</h2>
    <div className="space-y-3">{children}</div>
  </section>
);

const Decision = ({
  id, title, status, implication, icon: Icon = CheckCircle2,
}: {
  id: string; title: string; status: "locked" | "deferred" | "open";
  implication: string; icon?: any;
}) => {
  const statusMap = {
    locked: { label: "✅ Locked", cls: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" },
    deferred: { label: "🟡 Deferred", cls: "bg-amber-500/10 text-amber-700 border-amber-500/30" },
    open: { label: "🔴 Open", cls: "bg-red-500/10 text-red-700 border-red-500/30" },
  };
  const s = statusMap[status];
  return (
    <Card className="border-border">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="font-mono text-xs">{id}</Badge>
              <Badge variant="outline" className={`text-xs ${s.cls}`}>{s.label}</Badge>
            </div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{implication}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Achievement = ({ done, label }: { done: boolean; label: string }) => (
  <div className="flex items-start gap-2 text-sm">
    {done ? (
      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
    ) : (
      <Clock className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
    )}
    <span className={done ? "text-foreground" : "text-muted-foreground"}>{label}</span>
  </div>
);

const ChangeLog = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12 print:py-6">
        <div className="max-w-5xl mx-auto px-6 space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-accent text-primary font-semibold">v3.1 · April 2026</Badge>
            <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground">
              Supersedes v3.0 docs
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Locked Decisions <span className="gold-gradient-text">Change Log</span>
          </h1>
          <p className="text-primary-foreground/70 max-w-3xl">
            All strategic, technical, and product decisions have been pressure-tested and locked.
            This log supersedes Pitch v3.0, BRD v3.0, PRD v3.0, FRD v3.0, SDD v3.0, TSD v3.0,
            MVP Canvas, and SOW v3.0.
          </p>
          <p className="text-primary-foreground/60 text-sm italic max-w-3xl">
            "We don't overwhelm traders with data — we guide them to decisions."
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Executive Summary */}
        <Section title="1. Executive Summary" id="summary">
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: Layers, t: "Ruthless MVP scope", d: "Only directory, RFQ engine, basic CRM, and buyer reputation ship in Phase 1." },
              { icon: Users, t: "Buyer-centric marketplace", d: "Buyer verification and reputation are prioritized above seller features." },
              { icon: Shield, t: "Broker co-optation", d: "Brokers become standard members with an is_broker flag; no separate marketplace." },
              { icon: Clock, t: "Deferred complexity", d: "Weighted average pricing, WhatsApp, auto-GST verification, advanced admin → post-MVP." },
            ].map((k) => (
              <Card key={k.t} className="border-border">
                <CardContent className="p-4 flex gap-3">
                  <k.icon className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">{k.t}</p>
                    <p className="text-xs text-muted-foreground mt-1">{k.d}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* What's Built */}
        <Section title="2. What's Built So Far (v3.1 Status)" id="built">
          <p className="text-sm text-muted-foreground">
            Snapshot of platform implementation as of this log. Lovable Cloud backend live;
            Auth, RFQ persistence, Product/Company CMS, Admin moderation shipped.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            <Card className="border-border">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-primary">
                  <Database className="h-4 w-4 text-accent" /> Backend & Auth
                </h3>
                <Achievement done label="Lovable Cloud (Postgres + Auth + Storage) enabled" />
                <Achievement done label="Email/Password + Google OAuth (UX-001)" />
                <Achievement done label="6-table schema with RLS: profiles, companies, products, rfqs, rfq_responses, user_roles" />
                <Achievement done label="RBAC enum: admin, broker, paid_member, free_member" />
                <Achievement done label="Auto-create profile + free_member role on signup (trigger)" />
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-primary">
                  <Users className="h-4 w-4 text-accent" /> CMS & Profiles
                </h3>
                <Achievement done label="User profile editor (/account/profile)" />
                <Achievement done label="Company profile editor with logo + cover (/account/company)" />
                <Achievement done label="Product CMS with price ranges, stock bands, demand trends (/account/products)" />
                <Achievement done label="Self-service image uploads to Supabase Storage (TECH-005)" />
                <Achievement done label="Auto-publish; admin can hide later (verification flow)" />
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-primary">
                  <ShoppingBag className="h-4 w-4 text-accent" /> RFQ Engine
                </h3>
                <Achievement done label="RFQ persistence to DB with status pipeline (UX-002 mandatory auth)" />
                <Achievement done label="Buyer + seller split inbox (/account/rfqs)" />
                <Achievement done label="Seller responses with quoted price + validity" />
                <Achievement done label="Status: new → viewed → responded → negotiating → converted/closed" />
                <Achievement done={false} label="Auto-save drafts to localStorage (UX-003) — pending" />
                <Achievement done={false} label="Email + browser push notifications (TECH-003) — pending" />
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-primary">
                  <Shield className="h-4 w-4 text-accent" /> Trust & Admin
                </h3>
                <Achievement done label="Admin moderation panel (/account/moderation)" />
                <Achievement done label="Verification badges (is_verified flag on companies)" />
                <Achievement done label="Hide/unhide companies & products" />
                <Achievement done label="Role assignment by admins" />
                <Achievement done={false} label="Buyer verification tiers + reputation score (G-01) — pending" />
                <Achievement done={false} label="is_broker flag on members (DATA-001) — pending" />
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-primary">
                  <Zap className="h-4 w-4 text-accent" /> Behavioral Intelligence
                </h3>
                <Achievement done label="Price masking via min/max range fields" />
                <Achievement done label="Stock band enum (high/medium/low/on_order)" />
                <Achievement done label="Trend direction (rising/stable/falling)" />
                <Achievement done label="Demand score field" />
                <Achievement done label="Live market ticker on every page" />
                <Achievement done={false} label="Weighted average market reference (TECH-002) — Phase 2" />
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-primary">
                  <Bell className="h-4 w-4 text-accent" /> PWA & Misc
                </h3>
                <Achievement done label="Installable PWA: manifest + icons + meta tags" />
                <Achievement done label="Lead Intelligence module fully removed (BIZ-001)" />
                <Achievement done={false} label="Service worker for offline (TECH-004) — non-blocking" />
                <Achievement done={false} label="Discourse API native rendering (TECH-007) — pending" />
                <Achievement done={false} label="Stripe membership upgrade (₹10K Paid tier) — pending" />
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Decision Log */}
        <Section title="3. Decision Log by Domain" id="decisions">
          <h3 className="text-lg font-semibold text-primary pt-4">A. Business Model & Monetization</h3>
          <Decision id="BIZ-001" status="locked" icon={XCircle}
            title="Lead Packs module deleted"
            implication="Removed from SOW, BRD, FRD, MVP Canvas, Pitch. Revenue model now 3-stream only. ✅ Implemented." />
          <Decision id="BIZ-002" status="locked" icon={XCircle}
            title="Affiliate retail links deleted"
            implication="Removed from product pages, revenue model, and Pitch deck." />
          <Decision id="BIZ-003" status="locked"
            title="Membership tiers: Freemium only (Free / ₹10,000 Paid)"
            implication="Silver/Gold/Platinum tiers killed. Update MVP Canvas, Pitch, BRD." />
          <Decision id="BIZ-004" status="locked"
            title="Broker fee: ₹5,000/yr"
            implication="Brokers pay reduced fee but get standard business profile. Broker supply/demand board is a feature tab, not a separate module." />
          <Decision id="BIZ-005" status="locked"
            title="Revenue streams: Membership + Ads + Broker Fees"
            implication="Year 1 projection recalibrated to ₹10–15L conservative. Original ₹42–85L target invalidated." />
          <Decision id="BIZ-006" status="deferred"
            title="Buyer Premium tier"
            implication="Once liquidity builds, consider charging buyers for bulk RFQ privileges or advanced market intelligence. Not in MVP." />

          <h3 className="text-lg font-semibold text-primary pt-6">B. Technical Architecture</h3>
          <Decision id="TECH-001" status="locked"
            title="Behavioral Intelligence Layer → Lightweight API route"
            implication="Separate service (Fastify/Express on Render/Railway). Supabase Edge Functions rejected for BI aggregations." />
          <Decision id="TECH-002" status="locked"
            title="Weighted Average Market Reference Price → Deferred to Phase 2"
            implication="MVP price masking uses admin-managed manual input or simple median as placeholder. Full algorithm moves to Month 5–7." />
          <Decision id="TECH-003" status="locked" icon={XCircle}
            title="WhatsApp Business API → Removed from platform scope"
            implication="No WhatsApp in MVP. RFQ notifications route via email alerts + browser push notifications." />
          <Decision id="TECH-004" status="locked"
            title="PWA service worker architecture → Non-blocking"
            implication="Scaffold with Vite PWA plugin. Offline browsing of directory and queued RFQs supported architecturally but not polished in MVP." />
          <Decision id="TECH-005" status="locked"
            title="Image upload: Member self-service"
            implication="Supabase Storage with RLS (members write only to own folder). Client-side compression before upload. ✅ Implemented." />
          <Decision id="TECH-006" status="locked"
            title="Commodity ontology: Available and confirmed"
            implication="Ingest into commodities table before any product creation. Search taxonomy is pre-defined." />
          <Decision id="TECH-007" status="locked"
            title="Discourse integration: Native API rendering"
            implication="Use Discourse API to render topic cards natively in /community. No iframe. Public indexing enabled for SEO." />

          <h3 className="text-lg font-semibold text-primary pt-6">C. Data Model & Backend</h3>
          <Decision id="DATA-001" status="locked"
            title="Broker-Seller profile conflict resolved via is_broker flag"
            implication="Add is_broker BOOLEAN DEFAULT FALSE to members. Brokers use same schema as sellers. Supply/demand board filters by this flag." />
          <Decision id="DATA-002" status="locked"
            title="Buyer reputation score added to schema"
            implication="New field on buyer profiles. Gates RFQ volume, visibility, and seller trust. Higher priority than seller ratings in MVP." />
          <Decision id="DATA-003" status="locked"
            title="RFQ draft state added to schema"
            implication="inquiries table supports draft status. Auto-save persists to localStorage + optimistic TanStack Query cache." />
          <Decision id="DATA-004" status="locked" icon={XCircle}
            title="No legacy data migration"
            implication="Clean slate. Office staff role shifts from 'data entry' to 'verification & approval.' Remove ₹15,000 data entry budget from MVP Canvas." />

          <h3 className="text-lg font-semibold text-primary pt-6">D. User Experience & Workflows</h3>
          <Decision id="UX-001" status="locked"
            title="Signup methods: Email/Password + Google OAuth"
            implication="Supabase Auth supports both. No magic-link-only flow. ✅ Implemented." />
          <Decision id="UX-002" status="locked"
            title="RFQ requires authentication (mandatory sign-in)"
            implication="Guest users cannot send RFQs. Guest persona is browse-only. ✅ Implemented." />
          <Decision id="UX-003" status="locked"
            title="RFQ form: Auto-save drafts"
            implication="Multi-step form persists via localStorage + TanStack Query cache. Pending implementation." />
          <Decision id="UX-004" status="locked"
            title="Seller onboarding: Self-service, no seed profiles"
            implication="Members sign up and build profiles independently. Office staff verifies post-signup. ✅ Implemented." />
          <Decision id="UX-005" status="locked"
            title="Price Masking Algorithm: Transparent to sellers"
            implication="Seller preview mode shows exactly what buyers see. MVP uses manual/admin reference price; weighted average deferred." />
          <Decision id="UX-006" status="locked"
            title="Trust signals: GST/FSSAI certificates viewable on profiles"
            implication="Upload and display enabled. Auto-verification via GSTN API deferred to post-MVP." />

          <h3 className="text-lg font-semibold text-primary pt-6">E. Trust, Verification & Governance</h3>
          <Decision id="GOV-001" status="locked"
            title="Buyer verification & reputation > Seller reputation"
            implication="Sellers see buyer trust score before responding. Buyers must verify to unlock RFQs. This inverts IndiaMART logic." />
          <Decision id="GOV-002" status="open"
            title="Buyer verification tiers: To be defined"
            implication="Minimum viable verification flow (email → company name → GST optional) must be designed. Gates entire RFQ engine." />
          <Decision id="GOV-003" status="locked"
            title="Broker marketplace governance"
            implication="'Report Listing' feature + T&Cs disclaimer. Platform disclaims liability for broker-posted supply/demand." />

          <h3 className="text-lg font-semibold text-primary pt-6">F. Go-to-Market & Operations</h3>
          <Decision id="GTM-001" status="locked"
            title="Pilot 30: Committee nomination"
            implication="MDDMA committee selects 30 tech-curious, diverse members. At least 5 brokers. Free Paid tier for 3 months in exchange for product feedback and 5+ listings within 48 hours." />
          <Decision id="GTM-002" status="locked"
            title="Member Onboarding Webinar template"
            implication="Add to SOW Phase 4. 1-hour repeatable session + printable QR standee for APMC office." />
          <Decision id="GTM-003" status="locked"
            title="SEO strategy: Discourse public indexing drives organic SEO"
            implication="No dedicated content strategy in MVP. Discourse categories must use SEO-friendly slugs and meta descriptions." />
          <Decision id="GTM-004" status="open"
            title="Buyer acquisition: Unbudgeted gap identified"
            implication="No buyer acquisition budget or channels defined. Must allocate ₹50K–₹1L for Google Ads (buyer keywords) and MDDMA office-led buyer email invites." />
        </Section>

        {/* Gap Register */}
        <Section title="4. Updated Gap Register" id="gaps">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-semibold">ID</th>
                  <th className="text-left p-3 font-semibold">Gap</th>
                  <th className="text-left p-3 font-semibold">Priority</th>
                  <th className="text-left p-3 font-semibold">Owner</th>
                  <th className="text-left p-3 font-semibold">Resolution Target</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["G-01", "Buyer verification flow definition", "🔴 P0", "Product", "Before RFQ engine build"],
                  ["G-02", "Buyer acquisition plan & budget", "🔴 P0", "Business", "Before D30 launch"],
                  ["G-03", "Weighted average algorithm spec", "🟡 P1", "Data/Engineering", "Month 5 (Phase 2)"],
                  ["G-04", "Email notification service provider", "🟡 P1", "Engineering", "Before RFQ launch"],
                  ["G-05", "Browser push notification service", "🟡 P1", "Engineering", "Before RFQ launch"],
                  ["G-06", "Pilot 30 nomination list", "🔴 P0", "MDDMA Committee", "Week 1"],
                  ["G-07", "Revised financial model", "🟡 P1", "Business", "Week 2"],
                  ["G-08", "Legal T&Cs for broker disclaimer", "🟡 P1", "Legal/Admin", "Before broker onboarding"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border">
                    <td className="p-3 font-mono text-xs">{row[0]}</td>
                    <td className="p-3">{row[1]}</td>
                    <td className="p-3">{row[2]}</td>
                    <td className="p-3 text-muted-foreground">{row[3]}</td>
                    <td className="p-3 text-muted-foreground">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Behavioral Layer */}
        <Section title="5. Behavioral Design Principles (Surgical Top-10)" id="behavioral">
          <p className="text-sm text-muted-foreground">
            Applied across RFQ flow, product page, and directory. Quality over quantity —
            honoring Cognitive Load and Choice Overload by NOT applying every concept.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { p: "Anchoring Bias", a: "Show market reference price as anchor next to seller's price range. Buyer perceives seller as fair." },
              { p: "Scarcity Principle", a: "Stock band 'Low' / 'On Order' badges create urgency without revealing exact quantities." },
              { p: "Social Proof", a: "'12 RFQs sent in last hour' on ticker + 'X buyers viewed today' on product card." },
              { p: "Default Bias", a: "Pre-select common quantity (1 MT), packaging (10kg cartons), and timeline (15 days) in RFQ form." },
              { p: "Zeigarnik Effect", a: "Multi-step RFQ progress bar + draft auto-save. Incomplete RFQs prompt return via toast." },
              { p: "Von Restorff Effect", a: "One standout primary CTA per screen ('Request Best Price' in gold, everything else muted)." },
              { p: "Peak-End Rule", a: "RFQ success screen with confetti micro-animation + clear next-step ('Sellers respond in ~6 hrs avg')." },
              { p: "Endowment Effect", a: "'Saved sellers' and 'Watchlist products' make users feel ownership over their shortlist." },
              { p: "Trust Acceleration", a: "GST/FSSAI badges, Verified ribbon, response-time indicator on every seller card." },
              { p: "Progressive Disclosure", a: "Product card shows essentials; click reveals certifications, packaging, origin. RFQ form steps gate complexity." },
            ].map((b, i) => (
              <Card key={b.p} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-primary">{b.p}</p>
                      <p className="text-xs text-muted-foreground mt-1">{b.a}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="border-accent/40 bg-accent/5 mt-4">
            <CardContent className="p-5">
              <p className="text-sm font-semibold text-primary mb-2">⚖️ The Sweet Spot</p>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-foreground">Too Transparent</p>
                  <p className="text-muted-foreground text-xs">Price wars · Margin loss</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Too Opaque</p>
                  <p className="text-muted-foreground text-xs">No trust · Low conversion</p>
                </div>
              </div>
              <p className="text-sm mt-3 text-foreground">
                <strong>Our model:</strong> Show signals · Hide exact data · Control interaction.
              </p>
            </CardContent>
          </Card>
        </Section>

        {/* Document Impact */}
        <Section title="6. Superseded Documents" id="superseded">
          <p className="text-sm text-muted-foreground">
            The following v3.0 documents remain accessible for historical context but are
            superseded by this change log. Consult this log for the source of truth.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { to: "/pitch", label: "Sales Pitch v3.0", note: "5 modules → 4 modules; revenue model recalibrated" },
              { to: "/brd", label: "BRD v3.0", note: "Tier system simplified; Lead Intelligence removed" },
              { to: "/prd", label: "PRD v3.0", note: "US-03 guest RFQ removed; buyer reputation added" },
              { to: "/fsd", label: "FRD v3.0", note: "RFQ auth-required; auto-save drafts; broker report listing" },
              { to: "/sdd", label: "SDD v3.0", note: "BI as external API; is_broker, buyer_rep, draft schema" },
              { to: "/tsd", label: "TSD v3.0", note: "BI API route; Discourse API; PWA scaffold" },
              { to: "/sow", label: "SOW v3.0", note: "Lead Packs deliverable removed; webinar template added" },
              { to: "/mvp-canvas", label: "MVP Canvas v3.0", note: "Data entry budget removed; tier pricing updated" },
            ].map((d) => (
              <Link key={d.to} to={d.to}>
                <Card className="border-border hover:border-accent/50 card-hover">
                  <CardContent className="p-4 flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-foreground">{d.label}</p>
                        <Badge variant="outline" className="text-xs">superseded</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{d.note}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>MDDMA Behavioral Trade OS · Change Log v3.1 · Lock Date: April 2026</p>
          <Link to="/documents" className="inline-flex items-center gap-1 text-accent hover:underline mt-2">
            <Lock className="h-3 w-3" /> Back to Document Suite
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChangeLog;
