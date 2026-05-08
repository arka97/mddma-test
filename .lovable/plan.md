## What's happening

`src/components/docs/DocPage.tsx` runs a `scroll` listener that calls `setProgress(...)` on every scroll event. Each update re-renders the whole page — including the `<Markdown>` body and every Mermaid diagram inside it — which is what produces the flicker. The progress width itself uses `transition-all`, so it also lags behind the actual scroll position, hence the "not consistent" feel.

The sticky top bar also uses `backdrop-blur`, which compounds the cost while scrolling over the diagram-heavy content.

## Plan

1. **Delete the scroll progress bar** in `DocPage.tsx`:
   - Remove the `progress` state, the `useState` import usage for it, and the `useEffect` that registers the `scroll` listener.
   - Remove the `<div className="fixed top-0 ... h-1 bg-muted ...">` and its inner accent-coloured fill.
2. **Drop `backdrop-blur`** from the sticky top bar so scrolling over Mermaid diagrams stops re-sampling the blurred region. Keep the bar visually stable by switching `bg-primary/95` to a solid `bg-primary`.
3. Leave everything else untouched: TOC, mark-as-read effect, download/print buttons, headings extraction, layout grid, Markdown rendering. The page will load and render in one go with no scroll-driven state.

## Out of scope

- No changes to Mermaid rendering itself — once the re-render storm is gone, diagrams render once and stay put.
- No changes to the `/documents` hub or any of the 14 markdown sources.
- No new dependencies, no styling overhaul.

## Files touched

- `src/components/docs/DocPage.tsx` (only)
