import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileTopBar } from "./MobileTopBar";
import { MobileTabBar } from "./MobileTabBar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile shell */}
      <MobileTopBar />
      {/* Desktop shell */}
      <div className="hidden md:contents">
        <Header />
      </div>

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      <div className="hidden md:contents">
        <Footer />
      </div>
      <MobileTabBar />
    </div>
  );
}
