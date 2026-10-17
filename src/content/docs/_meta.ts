// Public docs are bundled into the client. Internal docs are NEVER imported
// here — their markdown lives only in the get-internal-doc edge function and
// is fetched after server-side password verification.
import startHere from "./00-start-here.md?raw";
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
    number: "00",
    slug: "start-here",
    title: "Start Here",
    summary: "Orientation to MDDMA, current business network, feed and trade tools, access limitations, draft policies and reading paths.",
    readTime: "5 min",
    diagramCount: 0,
  },
  {
    number: "01",
    slug: "vision-and-pitch",
    title: "Vision & Pitch",
    summary: "Controlled-transparency thesis, MDDMA ownership, discovery/community/private trade, and historical revenue assumptions.",
    readTime: "6 min",
    diagramCount: 2,
  },
  {
    number: "02",
    slug: "business-and-scope",
    title: "Business & Scope",
    summary: "Current business onboarding, retained commercial baseline, scope, approval gates and draft contractual context.",
    readTime: "7 min",
    diagramCount: 0,
  },
  {
    number: "03",
    slug: "product-and-ux",
    title: "Product & UX",
    summary: "Current mobile navigation, Updates/Buzz/Following, posting/replies, business identities, installation and checked access matrix.",
    readTime: "8 min",
    diagramCount: 0,
  },
  {
    number: "04",
    slug: "functional-spec",
    title: "Functional Spec",
    summary: "Current modules and acceptance checks: social, business/team, RFQ/quotes/chat, Bulletin/ads, notifications and known gaps.",
    readTime: "9 min",
    diagramCount: 1,
  },
  {
    number: "05",
    slug: "architecture-and-tech",
    title: "Architecture & Tech",
    summary: "Stack/providers, current entities, safe reads/RPCs, private media, PWA delivery, disabled payments and SEO parity limitations.",
    readTime: "10 min",
    diagramCount: 1,
  },
  {
    number: "06",
    slug: "build-and-operations",
    title: "Build & Operations",
    summary: "Developer setup, docs regeneration/deployment, focused tests, device QA, secrets, recovery and approval-first roadmap.",
    readTime: "6 min",
    diagramCount: 0,
  },
  {
    number: "07",
    slug: "database-reference",
    title: "Database Reference",
    summary: "Checked hosted schema map: business teams, feed interactions, RFQ quotations/deals, notifications, helpers and absent legacy tables.",
    readTime: "12 min",
    diagramCount: 1,
    internal: true,
  },
  {
    number: "08",
    slug: "edge-functions-reference",
    title: "Edge Functions Reference",
    summary: "Seven function sources, server-only docs delivery, VAPID/server hook, retained disabled payment dependencies and deployment checks.",
    readTime: "8 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "09",
    slug: "frontend-architecture",
    title: "Frontend Architecture",
    summary: "Current routes/providers, identity and business context, query/repository flows, coordinated chrome, PWA and vault state.",
    readTime: "9 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "10",
    slug: "component-and-design",
    title: "Components & Design System",
    summary: "White/ink Burgundy & Gold tokens, current component inventory, mobile geometry, media/ad guidance and retired UI patterns.",
    readTime: "10 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "11",
    slug: "decisions-log",
    title: "Decisions Log",
    summary: "Permanent decision IDs, historical supersessions, retained commercial constraints, current evolution and override-policy conflict.",
    readTime: "9 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "12",
    slug: "money-and-membership",
    title: "Money & Membership",
    summary: "Account versus business verification, historical ₹10K baseline, disabled payment helpers and prerequisites for restored checkout.",
    readTime: "8 min",
    diagramCount: 1,
    internal: true,
  },
  {
    number: "13",
    slug: "operations-runbook",
    title: "Operations Runbook",
    summary: "Developer diagnostics for social/trade/media/push, current admin controls, read-only queries and real-session release checks.",
    readTime: "9 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "14",
    slug: "roadmap-and-glossary",
    title: "Roadmap & Glossary",
    summary: "Status-first roadmap, unverified pilot history, proposed external BIL contract, rejected patterns and current glossary.",
    readTime: "7 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "15",
    slug: "security-and-rls",
    title: "Security, RLS & Threat Model",
    summary: "Checked hosted access boundaries, role/team protections, anonymous/media signing, commercial override limits and unverified controls.",
    readTime: "8 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "16",
    slug: "storage-and-media",
    title: "Storage, Media & Uploads",
    summary: "Six hosted buckets; distinct 5/10/25/50/100 MB client limits, opaque feed paths, private signing and cleanup boundaries.",
    readTime: "6 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "17",
    slug: "owner-quickstart",
    title: "Owner Quickstart & Where Do I…?",
    summary: "Current owner task/source index, missing workflow warnings, docs deployment, domain verification and release safeguards.",
    readTime: "8 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "18",
    slug: "member-data-audit-migration",
    title: "Member Data Audit & Migration Plan",
    summary: "Proposed consent/dedupe/import plan, current business-registration gaps, safe rollback and unresolved execution/sign-off.",
    readTime: "7 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "19",
    slug: "privacy-policy",
    title: "Privacy Policy",
    summary: "Draft privacy notice aligned to current social/trade/push data; legal, consent, processor and retention gaps remain explicit.",
    readTime: "8 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "20",
    slug: "terms-of-service",
    title: "Terms of Service",
    summary: "Draft account/trade/content terms, private quotations/chat, disabled payments, third-party delivery and publication prerequisites.",
    readTime: "7 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "21",
    slug: "refund-and-cancellation-policy",
    title: "Refund & Cancellation Policy",
    summary: "Preserved draft cooling-off/pro-rata commitments, disabled current payment management and officer-led refund handling.",
    readTime: "5 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "22",
    slug: "grievance-and-redressal",
    title: "Grievance & Redressal Mechanism",
    summary: "Draft officer intake/response commitments, current moderation escalation and legal/publication verification requirements.",
    readTime: "5 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "23",
    slug: "kyc-and-verification-policy",
    title: "KYC & Verification Policy",
    summary: "Draft evidence/verification policy, Indian/overseas business registration, absent private upload flow and retention conflicts.",
    readTime: "7 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "24",
    slug: "sow-and-maintenance-sla",
    title: "Statement of Work & Maintenance SLA",
    summary: "Unsigned SOW/SLA template with updated feature scope, preserved draft numeric terms and contract reconciliation requirements.",
    readTime: "8 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "25",
    slug: "committee-operator-guide",
    title: "Committee Operator Guide (Non-technical)",
    summary: "Actual moderation tabs/buttons, Bulletin/ads, access-switch limitations, notification/install help and zero-SQL escalation.",
    readTime: "6 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "26",
    slug: "data-retention-and-deletion-policy",
    title: "Data Retention & Deletion Policy",
    summary: "Draft retention schedule mapped to current data classes, legacy mapping warnings, unresolved periods and absent automation.",
    readTime: "6 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "27",
    slug: "pilot-plan-and-success-criteria",
    title: "Pilot Plan & Success Criteria",
    summary: "Two-sided 90-day pilot targets, preserved thresholds, current measurement/payment gaps and unverified progress/outcome.",
    readTime: "7 min",
    diagramCount: 0,
    internal: true,
  },
  {
    number: "28",
    slug: "gtm-and-onboarding-playbook",
    title: "GTM & Onboarding Playbook",
    summary: "Warm-intro playbook, aligned cohort targets, current business/install onboarding and verified-link/offer sending checklist.",
    readTime: "7 min",
    diagramCount: 0,
    internal: true,
  },
];

export const SOURCES: Record<string, string> = {
  "start-here": startHere,
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
