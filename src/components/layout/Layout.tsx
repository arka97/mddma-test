import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileBottomNav } from "./MobileBottomNav";
import { WhatsappHelpFab } from "@/components/help/WhatsappHelpFab";
import { WelcomeCarousel } from "@/components/onboarding/WelcomeCarousel";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* Bottom padding on mobile so content never hides behind the bottom tab bar. */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      <WhatsappHelpFab />
      <WelcomeCarousel />
    </div>
  );
}
