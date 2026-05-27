# Replace "Post RFQ" tile with "Member Directory"

## What
Swap the first tile in the homepage Quick Actions grid from **Post RFQ** to **Member Directory**.

## How
In `src/components/home/today/QuickActionsGrid.tsx`:
1. **Import** `Users` from `lucide-react` (replace `Send` if unused elsewhere).
2. **Replace the first tile** in the `tiles` array:
   - `label`: `"Member Directory"`
   - `meta`: `"Browse verified traders"`
   - `href`: `"/directory"`
   - `icon`: `Users`
   - `tone`: keep `"accent"`
3. **Remove unused RFQ state**: delete `rfqCount` and its `useState`, plus the `supabase.from("rfqs")...` query inside the `useEffect`.
4. **Remove unused imports**: `Send` (if no longer used), `useAuth` (if no longer needed after removing the conditional `href`).

No other tiles or layout change.
