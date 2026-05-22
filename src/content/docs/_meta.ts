// Public docs are bundled into the client. Internal docs are NEVER imported
// here — their markdown lives only in the get-internal-doc edge function and
// is fetched after server-side password verification.
import vision from "./01-vision-and-pitch.md?raw";
import business from "./02-business-and-scope.md?raw";
import product from "./03-product-and-ux.md?raw";
import functional from "./04-functional-spec.md?raw";
import architecture from "./05-architecture-and-tech.md?raw";
import ops from "./06-build-and-operations.md?raw";

export interface DocMeta {
  number: string;
  slug: string;
  title: string;
  summary: string;
  readTime: string;
  diagramCount: number;
  internal?: boolean;
}

export const DOCS: DocMeta[] = [
  {
    number: "01",
    slug: "vision-and-pitch",
    title: "Vision & Pitch",
    summary: "Why MDDMA exists, the controlled-transparency thesis, lean canvas, and committee ROI.",
    readTime: "6 min",
    diagramCount: 2,
  },
  {
    number: "02",
    slug: "business-and-scope",
    title: "Business & Scope",
    summary: "Strategic goals, monetisation, what's in and explicitly out of scope, engagement timeline.",
    readTime: "7 min",
    diagramCount: 2,
  },
  {
    number: "03",
    slug: "product-and-ux",
    title: "Product & UX",
    summary: "Personas, RBAC matrix, controlled-transparency UX rules, RFQ lifecycle, governance principles.",
    readTime: "8 min",
    diagramCount: 3,
  },
  {
    number: "04",
    slug: "functional-spec",
    title: "Functional Spec",
    summary: "Module-by-module spec for Directory, Storefront, RFQ Cart, Forum, CMS and acceptance criteria.",
    readTime: "9 min",
    diagramCount: 2,
  },
  {
    number: "05",
    slug: "architecture-and-tech",
    title: "Architecture & Tech",
    summary: "Stack, layering, data model, auth + RLS, Behavioral Intelligence Layer, edge functions.",
    readTime: "10 min",
    diagramCount: 3,
  },
  {
    number: "06",
    slug: "build-and-operations",
    title: "Build & Operations",
    summary: "Environment setup, secrets, seeding, test strategy, deploy/PWA, roadmap.",
    readTime: "6 min",
    diagramCount: 2,
  },
  {
    number: "07",
    slug: "database-reference",
    title: "Database Reference",
    summary: "Every table, column, RLS policy, function, trigger, enum, and storage bucket.",
    readTime: "12 min",
    diagramCount: 1,
    internal: true,
  },
  {
    number: "08",
    slug: "edge-functions-reference",
    title: "Edge Functions Reference",
    summary: "Each edge function: inputs, outputs, secrets, JWT, failure modes, debugging.",
    readTime: "8 min",
    diagramCount: 1,
    internal: true,
  },
  {
    number: "09",
    slug: "frontend-architecture",
    title: "Frontend Architecture",
    summary: "Routes, contexts, hooks→repos→Supabase chain, dataSource merge, role simulator.",
    readTime: "9 min",
    diagramCount: 1,
    internal: true,
  },
  {
    number: "10",
    slug: "component-and-design",
    title: "Components & Design System",
    summary: "Component inventory plus full HSL token reference, utilities, animations, breakpoints.",
    readTime: "10 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "11",
    slug: "decisions-log",
    title: "Decisions Log",
    summary: "Every locked product, technical, UX, and governance decision with permanent ID.",
    readTime: "9 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "12",
    slug: "money-and-membership",
    title: "Money & Membership",
    summary: "Pricing, end-to-end Razorpay flow, KYC ladder, the membership state machine.",
    readTime: "8 min",
    diagramCount: 2,
    internal: true,
  },
  {
    number: "13",
    slug: "operations-runbook",
    title: "Operations Runbook",
    summary: "Recipes for seeding, secrets, role grants, debugging, common psql queries.",
    readTime: "9 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "14",
    slug: "roadmap-and-glossary",
    title: "Roadmap & Glossary",
    summary: "Six-month roadmap, BIL Phase 2 contract, rejected ideas, full glossary and acronyms.",
    readTime: "7 min",
    diagramCount: 1,
    internal: true,
  },
  {
    number: "15",
    slug: "security-and-rls",
    title: "Security, RLS & Threat Model",
    summary: "Per-table RLS matrix, guard triggers, what's intentionally public, threat surfaces, audit checklist.",
    readTime: "8 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "16",
    slug: "storage-and-media",
    title: "Storage, Media & Uploads",
    summary: "Buckets, path conventions, 10/100 MB size limits, MIME allowlist, gallery cap, orphan cleanup.",
    readTime: "6 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "17",
    slug: "owner-quickstart",
    title: "Owner Quickstart & Where Do I…?",
    summary: "Single-page operator index: every common task, feature→file map, release checklist.",
    readTime: "8 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "18",
    slug: "member-data-audit-migration",
    title: "Member Data Audit & Migration Plan",
    summary: "How 350+ legacy members move from WhatsApp/spreadsheets into the DB with consent, dedupe and audit.",
    readTime: "7 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "19",
    slug: "privacy-policy",
    title: "Privacy Policy",
    summary: "DPDP-grounded notice: what we collect, why, retention, your rights, named Grievance Officer.",
    readTime: "8 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "20",
    slug: "terms-of-service",
    title: "Terms of Service",
    summary: "Governing terms for accounts, listings, RFQs, forum content, payments, liability and disputes.",
    readTime: "7 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "21",
    slug: "refund-and-cancellation-policy",
    title: "Refund & Cancellation Policy",
    summary: "Cooling-off window, pro-rata rules, non-refundable cases and the Razorpay-aligned workflow.",
    readTime: "5 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "22",
    slug: "grievance-and-redressal",
    title: "Grievance & Redressal Mechanism",
    summary: "IT Rules 2021 + DPDP §8(9) SOP: officer details, intake, timelines and escalation paths.",
    readTime: "5 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "23",
    slug: "kyc-and-verification-policy",
    title: "KYC & Verification Policy",
    summary: "What we check at each tier, document storage, access, retention and annual audit.",
    readTime: "7 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "24",
    slug: "sow-and-maintenance-sla",
    title: "Statement of Work & Maintenance SLA",
    summary: "Build scope, milestones, maintenance inclusions/exclusions, severity SLAs, IP and termination.",
    readTime: "8 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "25",
    slug: "committee-operator-guide",
    title: "Committee Operator Guide (Non-technical)",
    summary: "Zero-SQL screenshots-only guide for committee + office staff: approve, publish, moderate.",
    readTime: "6 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "26",
    slug: "data-retention-and-deletion-policy",
    title: "Data Retention & Deletion Policy",
    summary: "Retention schedule per data class, anonymisation of RFQ snapshots, erasure workflow, legal holds.",
    readTime: "6 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "27",
    slug: "pilot-plan-and-success-criteria",
    title: "Pilot Plan & Success Criteria",
    summary: "90-day cohort, must-hit metrics, hypotheses, risk register, continue/iterate/sunset decision rule.",
    readTime: "7 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "28",
    slug: "gtm-and-onboarding-playbook",
    title: "GTM & Onboarding Playbook",
    summary: "Pattern D execution: Bhuta scripts, anchor sequence, founding-window rules, anti-goals.",
    readTime: "7 min",
    diagramCount: 0,
    internal: true,
  },
];

export const SOURCES: Record<string, string> = {
  "vision-and-pitch": vision,
  "business-and-scope": business,
  "product-and-ux": product,
  "functional-spec": functional,
  "architecture-and-tech": architecture,
  "build-and-operations": ops,
};

export function getDoc(slug: string): { meta: DocMeta; source: string } | null {
  const meta = DOCS.find((d) => d.slug === slug);
  const source = SOURCES[slug];
  if (!meta || !source) return null;
  return { meta, source };
}

export function isInternalSlug(slug: string): boolean {
  return Boolean(DOCS.find((d) => d.slug === slug)?.internal);
}
