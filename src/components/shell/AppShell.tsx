import { type ReactNode, useState } from "react";
import { LeftRail } from "./LeftRail";
import { RightRail } from "./RightRail";
import { MobileTopBar } from "./MobileTopBar";
import { MobileBottomTabBar } from "@/components/layout/MobileBottomTabBar";
import { PostComposer } from "./PostComposer";

interface Props {
  children: ReactNode;
  /** Hide the right rail on this route (e.g., deep detail pages that need width). */
  hideRightRail?: boolean;
}

export function AppShell({ children, hideRightRail = false }: Props) {
  const [composeOpen, setComposeOpen] = useState(false);
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1300px]">
      <LeftRail onPost={() => setComposeOpen(true)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main className="min-w-0 flex-1 border-x-0 border-border pb-[80px] lg:border-x lg:pb-0">
          {children}
        </main>
      </div>
      {!hideRightRail && <RightRail />}
      <MobileBottomTabBar onPost={() => setComposeOpen(true)} />
      <PostComposer open={composeOpen} onOpenChange={setComposeOpen} />
    </div>
  );
}
