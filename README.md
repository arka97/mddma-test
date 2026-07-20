# G-BAU-G by MDDMA

G-BAU-G is the MDDMA-operated verified B2B network for nuts, dry fruits, dates, seeds, spices and allied food trade.

This repository is connected to Lovable. Changes made in Lovable are committed here automatically, and changes merged into the connected branch are reflected back in the Lovable project.

## Product surfaces currently in the application

- Verified business directory and profiles
- Business storefronts, products and brands
- Market feed and official bulletins
- RFQ board
- Member dashboard and moderation tools
- Public knowledge, FAQ, contact and association pages

The product definition is evolving from an MDDMA-member portal into an open, business-verified international network. Preserve existing data and access controls while changing product language or flows.

## Technology

- React 18
- TypeScript
- Vite
- Tailwind CSS and shadcn/ui
- TanStack Query
- Lovable Cloud / Supabase

## Local development

The project uses Bun in its scripts and lockfile workflow.

```bash
bun install
bun run dev
```

Useful checks:

```bash
bun run lint
bun run test
bun run build
```

## Lovable-safe contribution rules

1. Work on a branch and merge through a pull request.
2. Keep pages and components free of direct `supabase.from()` calls. Put data access in `src/repositories/` and consume it through query hooks.
3. Reuse semantic design tokens instead of hard-coded colours.
4. Do not rename or remove database fields through UI-only refactors.
5. Treat generated Supabase types, migrations and edge functions as coordinated backend changes.
6. Avoid editing the same screen concurrently in Lovable and GitHub; sync first to reduce merge conflicts.
7. Run lint, tests and a production build before merging.

## Deployment

Publish through the connected Lovable project. Custom domains are managed from Lovable **Project Settings → Domains**.
