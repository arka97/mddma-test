## Goal

Lead Packs are out of scope (BIZ-001). Memory already says removed, but stale references still render in the UI. Remove them.

## Changes

**1. `src/pages/Forms.tsx`**
- Drop the "Lead Packs" tab trigger and its `TabsContent` block.
- Change tab grid from `grid-cols-4` to `grid-cols-3`.
- Remove now-unused `Database` icon import.

**2. `src/pages/MembershipPlans.tsx`**
- Remove the `<p>Lead Packs: …</p>` line from the tier meta block.

**3. `src/data/sampleData.ts`**
- Remove `leadPacks: number` from the membership tier interface.
- Remove `leadPacks: 0` from each tier object (Free, Paid).

**4. Docs (`src/content/docs/01-vision-and-pitch.md`, `02-business-and-scope.md`)**
- Leave as-is. These docs explicitly state Lead Packs are rejected/out-of-scope, which is the canonical record. Removing them would erase the rationale.

## Out of scope
- No DB schema changes (no `lead_packs` table exists).
- No route changes (`/leads` already absent).
- Memory already reflects removal — no memory update needed.
