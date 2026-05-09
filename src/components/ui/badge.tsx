import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Soft neutral chip — replaces the old aggressive solid-primary default.
        default: "border-border/60 bg-secondary text-secondary-foreground",
        neutral: "border-border/60 bg-secondary text-secondary-foreground",
        secondary: "border-transparent bg-muted text-foreground",
        outline: "border-border/70 bg-transparent text-foreground",
        success: "border-success/20 bg-success/10 text-success",
        warning: "border-warning/30 bg-warning/15 text-warning-foreground",
        info: "border-info/20 bg-info/10 text-info",
        danger: "border-danger/20 bg-danger/10 text-danger",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
