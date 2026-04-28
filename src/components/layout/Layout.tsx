import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MarketTicker } from "./MarketTicker";
import { TrustStrip } from "./TrustStrip";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketTicker />
      <Header />
      <TrustStrip />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
