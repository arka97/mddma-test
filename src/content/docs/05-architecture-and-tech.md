# Architecture & Tech

The implementation reference: stack, layering, data model, auth model, the Behavioral Intelligence Layer contract, and the rules that keep the codebase honest.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript | Lovable native, fast HMR |
| Styling | Tailwind 3 + shadcn/ui + HSL semantic tokens | Brand-locked Royal Heritage palette (navy, burgundy, gold, ivory) |
| Routing | React Router v6 (`BrowserRouter`) | SPA fallback handled by Lovable hosting |
| Data | TanStack Query (`@tanstack/react-query`) | Caching + invalidation over the repository layer |
| Backend | **Lovable Cloud** (Auth, Postgres, Storage, Edge Functions) | Single managed surface, no external accounts |
| Payments | Razorpay (single Paid plan, broker is a flag) | India-first, UPI native |
| Behavioral Intelligence Layer | **External API service** (TECH-001) | Compute-heavy; lives outside edge functions |

## System architecture

```mermaid
graph TD
  subgraph Browser
    UI[React app<br/>pages + components]
    Hooks[useCompanies / useProducts / useContent]
  end
  subgraph Repository_layer
    Repos[repositories/*<br/>typed supabase queries]
    DS[lib/dataSource.ts<br/>merges live + sample]
  end
  subgraph Lovable_Cloud
    Auth[Auth]
    DB[(Postgres + RLS)]
    Storage[Storage buckets]
    EF[Edge Functions]
  end
  subgraph External
    BIL[Behavioral Intelligence API]
    RP[Razorpay]
  end
  UI --> Hooks --> Repos --> DB
  Repos --> Storage
  UI --> Auth
  EF --> RP
  EF --> Auth
  UI -.signals.-> BIL
```

## Layering rules

1. **Pages** never call `supabase.from()` directly. They call hooks.
2. **Hooks** (`src/hooks/queries/*`) own loading/error state and call repositories.
3. **Repositories** (`src/repositories/*`) own typed `supabase.from()` queries and shape responses.
4. **`lib/dataSource.ts`** merges live database rows with curated sample data (live wins on slug conflict). This is the seam that lets the demo look full from day one.

This split is what stopped the "KGVPL invisible" class of bugs: there is exactly one place a discovery list is built.

## Data model

```mermaid
erDiagram
  companies ||--o{ products : has
  products ||--o{ product_variants : has
  companies ||--o{ rfqs : receives
  rfqs ||--o{ inquiry_products : contains
  product_variants ||--o{ inquiry_products : referenced_by
  auth_users ||--o{ companies : owns
  auth_users ||--o{ user_roles : has
  auth_users ||--o{ posts : authors
  posts ||--o{ comments : has
  admins ||--o{ circulars : publishes
  admins ||--o{ ads : publishes
  companies ||--o{ kyc_documents : submits
```

Key tables:

- `companies` — one per Paid member; carries `is_broker`, `is_verified`, slug, categories.
- `products` + `product_variants` — variant-level pricing input (never rendered exactly).
- `rfqs` + `inquiry_products` — the multi-item RFQ as two normalised tables.
- `posts` + `comments` — native forum.
- `circulars`, `ads` — admin CMS content.
- `user_roles` — **separate table**, never a column on `companies`. Roles are checked via a `SECURITY DEFINER` `has_role(uid, role)` function used inside RLS policies.

## Auth & RLS

```mermaid
sequenceDiagram
  participant Page
  participant Hook
  participant Repo
  participant DB as Postgres + RLS
  Page->>Hook: useProducts({ category })
  Hook->>Repo: listProducts({ category })
  Repo->>DB: select with auth.uid() in JWT
  DB->>DB: RLS evaluates has_role(auth.uid(), 'paid_member')
  DB-->>Repo: rows the caller is allowed to see
  Repo-->>Hook: typed Product[]
  Hook-->>Page: { data, loading, error }
```

Rules:

- **Roles live in `user_roles`**, never on profiles or companies. Storing roles on a profile is a privilege-escalation risk.
- Every table that holds member data has RLS enabled and policies that call `public.has_role(auth.uid(), 'admin'::app_role)` or check `auth.uid() = owner_id`.
- The `ad-assets` storage bucket is admin-only write, public read.

## Behavioral Intelligence Layer

The BIL is **external**, not an edge function. It receives anonymised signal events (search, RFQ submission, quote turnaround) and serves back demand-trend chips and ranking weights consumed by `Products` and `Storefront`.

| Direction | Endpoint shape | Consumer |
|---|---|---|
| **Inbound (events)** | `POST /events` `{ type, payload, ts }` | Frontend fires on key interactions |
| **Outbound (signals)** | `GET /signals?scope=...` | `useContent` hook merges into product cards |

The frontend treats BIL as best-effort: if the API is down, components fall back to a local trend computed from recent RFQ activity.

## Edge functions

Four functions deploy from `supabase/functions/<name>/index.ts`. Detail in **08 · Edge Functions Reference**.

| Function | Purpose | Auth model |
|---|---|---|
| `verify-doc-password` | Gates `/documents/*` with the shared committee password (`DOCS_PASSWORD` secret) | None — constant-time secret compare in code |
| `get-internal-doc` | Returns markdown for the password-gated internal docs (07–17). Same password as above; bodies never ship to the client bundle | None — password verified per request |
| `razorpay-create-payment-link` | Generates a Razorpay payment link for a pending membership | JWT bearer; verified to be admin via `user_roles` |
| `razorpay-webhook` | Receives `payment_link.paid` and activates the membership + role grant | None at JWT layer; HMAC signature verified via `RAZORPAY_WEBHOOK_SECRET` |

There is **no** `promote-verification` edge function in the current build. KYC tier promotion is performed by admins directly (via service-role writes from `/account/moderation`) — the `prevent_profile_privilege_escalation` trigger blocks any other path.

## Storage buckets

| Bucket | Public read | Write | Used for |
|---|---|---|---|
| `avatars` | yes | owner | Profile avatars |
| `company-assets` | yes | company owner | Logos, covers, gallery |
| `product-images` | yes | company owner | Product cover, gallery (max 3), product video |
| `ad-assets` | yes | **admin only** | Homepage / category / directory ad creative |

Size limits and validation live in `src/lib/storage.ts` — 10 MB for images, 100 MB for videos, SVGs explicitly rejected.

## Frontend conventions

- HSL semantic tokens only — no `text-white`, no hardcoded hex.
- shadcn components customised via `class-variance-authority` variants, never inline overrides.
- Multi-step forms use react-hook-form + zod.
- All async UI returns explicit `{ data, loading, error }` from hooks.

## Read next

- **04 · Functional Spec** — what each module does.
- **06 · Build & Operations** — how to run and ship it.
