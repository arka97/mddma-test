import { useEffect, useState } from "react";

/**
 * Height of the *visible* viewport in px.
 *
 * On iOS the software keyboard overlays the page instead of resizing it, so a
 * `100dvh` sheet keeps its full height and its pinned toolbar ends up hidden
 * behind (or floating above) the keyboard. `window.visualViewport` reports the
 * area actually visible, letting a sheet shrink with the keyboard.
 */
export function useVisualViewportHeight(): number | null {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setHeight(Math.round(vv.height));
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return height;
}
