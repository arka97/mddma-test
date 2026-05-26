### Plan: Remove Discourse tab and make native Forum the primary community view

**Goal:** Remove the non-functional Discourse Discussions tab, keep the native posts view as the single community experience, and rebrand "Archive" to "Forum".

**Changes in `src/pages/Community.tsx`:**

1. **Remove Discourse imports and usage**
   - Delete `DiscourseEmbed` import.
   - Delete `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` imports.
   - Delete `Archive` icon import.

2. **Update post-detail view (when a single post is open)**
   - Change "Back to archive" button text to "Back to forum".
   - Remove the "Read-only archive. Continue the conversation in the Discussions tab." notice at the bottom.

3. **Update main community listing view**
   - Change `PageHeader` subtitle from "Live discussions on Discourse, plus a read-only archive of earlier posts" to "Member discussions, market updates, and association circulars".
   - Remove the entire `<Tabs>` wrapper. Since there is now only one view, render the post list directly without tabs.
   - Remove the read-only info banner: "This archive is read-only. New discussions happen in the Discussions tab."
   - Change empty-state text from "No archived posts." to "No posts yet. Be the first to start a conversation."
   - Keep category filter buttons and post list layout exactly as-is.

**No other files touched.**

**Done when:** Community page renders a single Forum view with no Discourse references, no Tabs UI, and all labels say "forum" instead of "archive".