# Home feed polish + X-style composer

## 1. Chip rename
"For You" becomes **Feed**. Order stays: Feed · Reels · Following · Bulletin · Price Signals · …

## 2. Scroll-aware chrome (Twitter behaviour)
Scrolling **down** hides the top chrome (header, ad slot, chips) upward and slides the bottom tab bar down. Scrolling **up** — at any point, even mid-page — brings both back instantly. Always visible at the very top of the page.

- New `useScrollDirection` hook (rAF-throttled, small threshold so tiny jitters don't flip it).
- Header, the home ad block + sticky chips row, and the mobile bottom bar each translate out with a short transition; nothing collapses to zero height mid-animation, so no layout jump or gap.

## 3. Compact timestamps
`24m`, `14h`, `3d`, `5w`, `8mo`, `2y` instead of "24 minutes". Applied to post cards, post detail, comments, bulletins — one shared helper so all surfaces match.

## 4. Views only on an opened post
The view-count (bar chart) action disappears from feed cards and shows only on the post detail screen, matching X.

## 5. Post button back to a floating button
The centre Post slot leaves the bottom bar. Bottom bar returns to five normal tabs: Home · Discover · RFQ · Firms · Chat. A round burgundy compose FAB floats above the bar on the right (clear of the tabs, respects safe area) and hides/reappears with the same scroll rule.

## 6. Composer rework (X + Instagram grade)
Current sheet is cramped and buries options. New behaviour:

- **Full-screen on mobile** (sheet on desktop): `Cancel` left, avatar + "Posting as <Business>" line, `Post` pill right, disabled until there's content.
- **Body**: large auto-growing text area, autofocused, paste/drag-drop images, no visible borders — just the caret and placeholder "What's happening in the market?".
- **Media**: image grid with rounded tiles and per-tile remove, inline video player, PDF chip, live link preview — all inside the scroll body.
- **Toolbar pinned above the keyboard**: icon-only round buttons (Photo, Video, PDF, Link, Poll, Price, Signal) with a character-count ring on the right, like X.
- **Structured types** (Price / Poll / Signal) open as an inline panel with a clear back arrow instead of replacing the whole editor silently; the composed note stays.
- **Anonymous toggle** moves out of the always-on header into a compact meta row under the author line (only when eligible), with the compliance note shown on enable.

## Technical notes
- Files: `src/hooks/useScrollDirection.ts` (new), `src/lib/time.ts` (new short-time helper), `TopicChips.tsx`, `Home.tsx`, `Header.tsx`, `MobileBottomTabBar.tsx`, `EngagementBar.tsx` (`showViews` prop), `PostCard.tsx`, `PostDetail.tsx`, `CommentsSheet.tsx`, `BulletinCard.tsx`, `ComposeSheet.tsx`.
- No backend, schema or policy changes; presentation only.
