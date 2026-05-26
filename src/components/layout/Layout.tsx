import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileBottomTabBar } from "./MobileBottomTabBar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* Bottom tab bar reserves ~64px on mobile so content isn't covered */}
      <main className="flex-1 pb-[72px] lg:pb-0">{children}</main>
      <div className="hidden lg:block">
        <Footer />
      </div>
      <MobileBottomTabBar />
    </div>
  );
}
