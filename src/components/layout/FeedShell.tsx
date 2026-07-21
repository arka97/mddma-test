import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeedShellProps {
  children: ReactNode;
  rightRail?: ReactNode;
  /** Override the center column width. Defaults to the X-style 600px feed. */
  centerClassName?: string;
  /** Outer wrapper class overrides — control max width / padding. */
  className?: string;
}

/**
 * X-style two-rail shell. Center column keeps the 600px feed width; the
 * right rail (widgets) appears only at xl+ and sticks in view while
 * scrolling. Mobile falls back to single column so the existing feed
 * layout is untouched.
 *
 * The top-of-page Header already carries primary nav + search, so a left
 * rail would duplicate it — intentionally omitted until nav is moved
 * out of the header in a later phase.
 */
export function FeedShell({ children, rightRail, centerClassName, className }: FeedShellProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[1100px] justify-center gap-6 px-0 xl:px-6",
        className,
      )}
    >
      <div className={cn("w-full max-w-[600px] min-w-0", centerClassName)}>{children}</div>
      {rightRail && (
        <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-[340px] shrink-0 space-y-4 overflow-y-auto pb-8 pt-3 xl:block">
          {rightRail}
        </aside>
      )}
    </div>
  );
}
