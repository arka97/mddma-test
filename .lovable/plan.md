

# BRD, FSD & TSD Document Pages

## Overview
Create three new document pages — Business Requirements Document (BRD), Functional Specification Document (FSD), and Technical Specification Document (TSD) — following the same presentation-style layout as the existing Sales Pitch page. Each will be a scrollable, print-friendly document page accessible via `/brd`, `/fsd`, and `/tsd` routes.

## Pages & Content

### 1. BRD (`/brd`) — Business Requirements Document
Sections:
- **Cover** — Title, prepared for MDDMA, date/version
- **Executive Summary** — High-level business need for digital transformation
- **Business Objectives** — Increase member engagement, generate digital revenue, modernize operations, improve discoverability
- **Scope** — In-scope (directory, products, leads, ads, admin) and out-of-scope items
- **Stakeholders** — Committee members, office staff, members, buyers, advertisers
- **Business Requirements** — Numbered list (BR-001 through BR-015+) covering member management, product catalog, lead intelligence, advertising, membership workflows
- **Success Criteria** — KPIs (member signups, revenue targets, page visits)
- **Constraints & Assumptions** — Budget, timeline, technology assumptions
- **Risks** — Adoption risk, data migration, committee buy-in

### 2. FSD (`/fsd`) — Functional Specification Document
Sections:
- **Cover**
- **Introduction** — Purpose, audience, references to BRD
- **User Roles** — Public visitor, registered member, admin/office staff
- **Functional Requirements by Module:**
  - Member Directory (search, filter, profile view, verification badges)
  - Product Catalog (categories, variants, seller mapping, affiliate links)
  - Lead Intelligence (pack listing, purchase flow, download)
  - Advertising (banner placement, scheduling, rotation)
  - Admin Panel (CRUD for members/products/leads/ads, featured/sponsored management)
  - Membership (application form, tier selection, renewal workflow)
- **UI/UX Requirements** — Responsive design, print support, accessibility
- **Non-Functional Requirements** — Performance, security, SEO
- **Demo Links** — Links to live demo pages (`/directory`, `/products`, etc.)

### 3. TSD (`/tsd`) — Technical Specification Document
Sections:
- **Cover**
- **Architecture Overview** — React SPA, Vite build, Tailwind CSS, component hierarchy
- **Technology Stack** — React 18, TypeScript, Tailwind, shadcn/ui, React Router, TanStack Query, Recharts
- **Component Architecture** — Layout system, page structure, reusable UI components
- **Data Model** — Member, Product, LeadPack, Advertiser, MembershipTier interfaces (from sampleData.ts)
- **Routing** — All routes listed with descriptions
- **Backend Integration Plan** — Supabase tables, RLS policies, auth flow
- **Deployment** — Lovable hosting, CI/CD, environment config
- **Security Considerations** — Auth, role-based access, input validation
- **Performance** — Code splitting, lazy loading, caching strategy

## Technical Approach

### New Files
- `src/pages/BRD.tsx` — BRD document page
- `src/pages/FSD.tsx` — FSD document page  
- `src/pages/TSD.tsx` — TSD document page

### Modified Files
- `src/App.tsx` — Add `/brd`, `/fsd`, `/tsd` routes

### Design
- Reuse `PitchSection` component for consistent section styling
- Same sticky nav pattern as SalesPitch with section anchors
- Print-optimized with `@media print` classes
- Navy/gold theme consistent with pitch page
- Each document self-contained with a PDF export button
- Cross-links between documents (BRD references FSD, FSD references TSD)

