
# Rework `/market` Compose Sheet

Replace the form-heavy bottom sheet with a Twitter-style composer matching the reference image. Same backing data (`createPost`, `structured_data`, link preview), no schema changes.

## New layout (`src/components/market/ComposeSheet.tsx`)

```
┌──────── handle ────────┐
│ (X)   New Post   [Post]│ ← header row
├────────────────────────┤
│ Post anonymously  [⌾] │ ← only if canPostAnonymous; muted helper text
├────────────────────────┤
│ (RS)  What's happening │ ← avatar + borderless textarea
│       in the market?   │
│                        │
│  [LinkPreviewCard]     │ ← auto-fetched, dismissible
├────────────────────────┤
│ 🖼 Photo  📄 File  🔗 Link  📊 Poll   ⚡ Signal │ ← bottom action row
└────────────────────────┘
```

### Header
- Close `X` button (ghost, circle) on the left.
- Centered "New Post" title.
- Pill `Post` button on the right (uses default `Button` variant — gold pill, warm shadow). Disabled when empty/submitting; shows spinner while submitting.

### Anonymous row
- Only rendered when `canPostAnonymous`.
- Compact row directly under header: bold "Post anonymously" + muted "Your identity will be hidden" + `Switch`. No card border — just a hairline divider below.

### Body
- User avatar (28–32px circle, initials from profile/email) on the left.
- Borderless, auto-grow `Textarea` filling the rest. Placeholder: "What's happening in the market?". No label.
- `LinkPreviewCard` renders below the textarea when a URL is detected (existing fetch/dismiss logic stays).

### Bottom action row (sticky to the sheet bottom, above safe area)
Pill buttons / icon+label tap targets:
- **Photo** (`ImageIcon`) — placeholder, shows toast "Photos coming soon" for now.
- **File** (`FileText`) — placeholder toast.
- **Link** (`LinkIcon`) — focuses textarea and inserts `https://` so the auto-preview fires; no dialog needed.
- **Poll** (`BarChart3`) — placeholder toast.
- **Signal** (`Zap`, gold pill, slightly emphasized like the reference) — opens an inline "Structured signal" panel that swaps the textarea area for the existing Price Signal / Market Alert / Sourcing Ask / Member News forms (kept verbatim from current sheet, just relocated into a collapsible panel). Selecting a type sets `postType`; tapping the active Signal pill again collapses back to general.

### State changes
- `postType` defaults to `"general"`; structured forms only render when the Signal panel is open.
- Drop the standalone `<Select>` for post type — replaced by the Signal pill + inline type tabs.
- Keep `createPost` payload, link preview effect, anonymous flag, and toast/invalidate logic exactly as today.

### Styling
- `SheetContent side="bottom"` with `rounded-t-2xl`, white bg, drag handle (already provided by Sheet), height auto-fits content with `max-h-[90vh]`.
- Hairline `border-border/60` dividers between header / anon / body / actions.
- Action pills: `rounded-full bg-muted/60 px-3 py-2 text-xs` with icon + label; Signal pill uses `bg-primary/15 text-primary-foreground` to echo the reference.

## Out of scope
- No backend changes. Photo/File/Poll are visual affordances only (toast stubs) so the surface matches the reference without partial implementations.
- No changes to `PostCard`, feed, or RLS.
- No AI Elements work — this is a domain compose sheet, not a chat surface.
