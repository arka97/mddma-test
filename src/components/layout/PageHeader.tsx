import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, eyebrow, children, className }: PageHeaderProps) {
  return (
    <section className={cn("border-b border-border bg-muted/30 py-8 sm:py-10", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            {eyebrow && <div className="t-eyebrow text-muted-foreground">{eyebrow}</div>}
            <h1 className="t-h1 text-foreground">{title}</h1>
            {subtitle && (
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>
            )}
          </div>
        </div>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
