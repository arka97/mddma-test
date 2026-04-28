# Architecture & Tech

The implementation reference: stack, layering, data model, auth model, the Behavioral Intelligence Layer contract, and the rules that keep the codebase honest.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript | Lovable native, fast HMR |
| Styling | Tailwind 3 + shadcn/ui + HSL semantic tokens | Brand-locked navy + gold |
| Routing | React Router (`BrowserRouter`) | SPA fallback handled by Lovable hosting |
| Backend | **Lovable Cloud** (Auth, Postgres, Storage, Edge Functions) | Single managed surface, no external accounts |
| Payments | Razorpay (membership + broker addon) | India-first, UPI native |
| Behavioral Intelligence Layer | **External API service** | Compute-heavy; lives outside edge functions |

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

| Function | Purpose | JWT verify |
|---|---|---|
| `verify-doc-password` | Gates `/documents/*` with the shared committee password | off |
| `razorpay-create-payment-link` | Generates a payment link for membership / broker addon | on |
| `razorpay-webhook` | Confirms successful payment and promotes the user | off (signature verified) |
| `promote-verification` | Admin action: marks a company verified after KYC review | on |

## Storage buckets

| Bucket | Read | Write |
|---|---|---|
| `ad-assets` | public | admin only |
| `kyc-documents` | owner + admin | owner |
| `product-images` | public | owner |

## Frontend conventions

- HSL semantic tokens only — no `text-white`, no hardcoded hex.
- shadcn components customised via `class-variance-authority` variants, never inline overrides.
- Multi-step forms use react-hook-form + zod.
- All async UI returns explicit `{ data, loading, error }` from hooks.

## Read next

- **04 · Functional Spec** — what each module does.
- **06 · Build & Operations** — how to run and ship it.
