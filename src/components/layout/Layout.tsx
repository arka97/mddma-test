import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileBottomTabBar } from "./MobileBottomTabBar";
import { ChromeVisibilityProvider } from "@/contexts/ChromeVisibilityContext";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <ChromeVisibilityProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        {/* Bottom tab bar reserves ~64px on mobile so content isn't covered */}
        {/* overflow-x-clip (not hidden) so sticky children still stick to the viewport */}
        <main className="w-full min-w-0 overflow-x-clip flex-1 pb-[72px] lg:pb-0">{children}</main>
        <div className="hidden lg:block">
          <Footer />
        </div>
        <MobileBottomTabBar />
      </div>
    </ChromeVisibilityProvider>
  );
}

