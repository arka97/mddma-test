import { type ReactNode } from "react";
import { AppShell } from "@/components/shell/AppShell";

interface LayoutProps {
  children: ReactNode;
  hideRightRail?: boolean;
}

// Kept for backwards compatibility — every page renders inside the new AppShell now.
export function Layout({ children, hideRightRail }: LayoutProps) {
  return <AppShell hideRightRail={hideRightRail}>{children}</AppShell>;
}
