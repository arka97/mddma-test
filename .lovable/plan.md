## Change

In `src/pages/Forms.tsx`:

1. Remove the `ShieldCheck` import (no longer used).
2. Change the `TabsList` from `grid-cols-3` to `grid-cols-2`.
3. Remove the `<TabsTrigger value="verification">` trigger.
4. Remove the entire `<TabsContent value="verification">` block (the Verification Request card and form).
5. Change `<Tabs defaultValue="verification">` to `defaultValue="advertise"` so the page opens on a valid tab.

No other files, routes, or logic change. The `/contact` route still renders the Contact tab as before.
