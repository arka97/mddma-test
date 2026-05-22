import { type ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Number of currently active filters shown on the trigger button. */
  activeCount?: number;
  /** Cleared/reset all filters. */
  onClear?: () => void;
  children: ReactNode;
}

/**
 * Mobile-friendly filter sheet. Used by Directory and Products on mobile.
 * Hides the usual sidebar/inline filter row behind a clear, single tap target.
 */
export function FiltersSheet({ open, onOpenChange, activeCount = 0, onClear, children }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] w-full overflow-y-auto rounded-t-3xl pb-safe pt-safe"
      >
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <SlidersHorizontal className="h-5 w-5" /> Filters
          </SheetTitle>
          {onClear && activeCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-sm font-medium text-accent hover:underline"
            >
              Clear all
            </button>
          )}
        </SheetHeader>

        <div className="space-y-5">{children}</div>

        <div className="sticky bottom-0 left-0 right-0 mt-6 -mx-6 border-t border-border bg-background px-6 py-3">
          <SheetClose asChild>
            <Button className="h-12 w-full text-base">
              Show results
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Button that opens the FiltersSheet. Renders an active-count pill.
 */
export function FiltersSheetTrigger({
  onClick,
  activeCount = 0,
}: {
  onClick: () => void;
  activeCount?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground shadow-sm hover:bg-muted"
    >
      <SlidersHorizontal className="h-4 w-4" /> Filters
      {activeCount > 0 && (
        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-accent-foreground">
          {activeCount}
        </span>
      )}
    </button>
  );
}
