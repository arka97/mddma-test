# Rework the Post (compose) screen

## What's wrong today

From your screenshot and the current build:

1. **The editor looks empty.** The sheet is a fixed full-height panel, so when the iOS keyboard opens the panel does not shrink. The avatar, "Posting as…" line and the caret end up above the visible area, leaving a big white void with the toolbar floating in the middle of the screen.
2. **No visible text field.** The textarea has no border, no background and no focus ring, so there is nothing telling the user "type here" — only a thin caret that is often scrolled out of view.
3. **No identity context.** "Posting as <Business>" is tiny 11px grey text tucked next to the anonymous switch. A first-time user cannot tell which business the post goes out as, or that the post is public to the whole association.
4. **Toolbar is icon-only and ambiguous.** Seven identical burgundy glyphs (photo, video, PDF, link, tag, chart, bolt) with no labels — the Price / Poll / Signal ones silently swap the entire editor.
5. **Structured modes lose the writing surface.** Entering Price/Poll/Signal replaces the composer with a form; the note field is buried at the bottom and the media you already attached is hidden.
6. **Nothing shows progress.** No character counter ring, no upload progress, no "Posting…" state beyond a spinner in the button.

## What I'll change

### Layout & keyboard
- Size the sheet with the visual viewport (`window.visualViewport`) so the composer body shrinks when the keyboard opens and the toolbar sits directly above it — never a floating strip with dead space.
- Keep the header (Cancel · New Post · Post) and toolbar pinned; only the body scrolls, and it auto-scrolls the caret into view.

### A real, obvious writing surface
- Wrap the textarea in a soft card (`bg-muted/40`, rounded, 1px border) that gets a primary-coloured ring while focused, so the active field is unmistakable.
- Larger placeholder ("What's happening in the market?") and auto-growing height starting at ~7 lines.
- Tapping anywhere in that card focuses the caret.

### Clear "who am I posting as"
- Top of the body: avatar + business name + a small "Public · everyone in G-BAU-G can see this" audience chip.
- If the account has multiple businesses, the chip is tappable and switches identity inline instead of "switch in header".
- Anonymous moves into that row as a labelled pill toggle; when on, the identity line visibly flips to "Anonymous" with the compliance note.

### Toolbar
- Keep icon buttons but add short labels under each on mobile widths, group them: media (Photo · Video · PDF · Link) | post type (Price · Poll · Signal) with a divider.
- Active post-type button stays visibly filled, and a "Post type: Price" chip appears under the identity row with an X to go back to a plain post.
- Right side: character-count ring that fills as you type, replacing the bare number.

### Structured modes keep the composer
- Price / Poll / Signal render as an inline card **below** the main text area rather than replacing it, so the note, media and preview stay on screen.
- Media buttons stay enabled in these modes instead of greying out.

### Feedback
- Per-image upload progress overlay and a disabled-with-reason tooltip on Post ("Add text or media to post").
- Success toast keeps current behaviour.

## Technical notes
- Single file for most of it: `src/components/market/ComposeSheet.tsx`; plus a small `useVisualViewportHeight` hook in `src/hooks/`.
- Uses existing semantic tokens only (primary/muted/border) — no new colours.
- No backend, schema, policy or upload-logic changes; posting payload stays identical.
