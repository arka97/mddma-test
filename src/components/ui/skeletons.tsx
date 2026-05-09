import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border/60 bg-card p-4", className)}>
      <Skeleton className="aspect-square w-full rounded-md" />
      <Skeleton className="mt-3 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
    </div>
  );
}

export function ListingsGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableRowSkeleton({ rows = 6, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("divide-y divide-border/60", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

export function ProfileHeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-3 py-8 sm:flex-row sm:items-start sm:gap-5", className)}>
      <Skeleton className="h-20 w-20 rounded-xl" />
      <div className="flex-1 space-y-3 text-center sm:text-left">
        <Skeleton className="mx-auto h-6 w-48 sm:mx-0" />
        <Skeleton className="mx-auto h-4 w-72 sm:mx-0" />
        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}
