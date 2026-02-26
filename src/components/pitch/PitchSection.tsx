import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PitchSectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}

export function PitchSection({ id, children, className, dark }: PitchSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "min-h-screen flex items-center justify-center py-20 px-6 sm:px-10 lg:px-20 print:min-h-0 print:py-10 print:break-inside-avoid",
        dark ? "bg-primary text-primary-foreground" : "bg-background text-foreground",
        className
      )}
    >
      <div className="w-full max-w-5xl mx-auto">{children}</div>
    </section>
  );
}
