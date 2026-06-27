import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-secondary text-secondary-foreground",
        neutral: "border-border/60 bg-muted text-foreground",
        secondary: "border-transparent bg-muted text-foreground",
        outline: "border-border/70 bg-transparent text-foreground",
        primary: "border-transparent bg-primary/15 text-primary-foreground",
        success: "border-transparent bg-success/15 text-success",
        warning: "border-transparent bg-warning/20 text-[hsl(33_85%_30%)]",
        info: "border-transparent bg-info/15 text-info",
        danger: "border-transparent bg-danger/15 text-danger",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        amber: "border-transparent bg-[hsl(36_92%_88%)] text-[hsl(33_85%_30%)]",
        blue: "border-transparent bg-[hsl(213_100%_92%)] text-[hsl(213_90%_35%)]",
        red: "border-transparent bg-[hsl(358_85%_93%)] text-[hsl(358_70%_42%)]",
        green: "border-transparent bg-[hsl(142_60%_90%)] text-[hsl(142_70%_28%)]",
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
