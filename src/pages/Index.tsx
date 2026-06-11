import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { TodayHeader } from "@/components/home/today/TodayHeader";
import { LiveRatesTicker } from "@/components/home/today/LiveRatesTicker";
import { AdSlot } from "@/components/home/today/AdSlot";
import { QuickActionsGrid } from "@/components/home/today/QuickActionsGrid";
import { MarketSnapshot } from "@/components/home/today/MarketSnapshot";
import { MarketNewsSection } from "@/components/home/today/MarketNewsSection";
import { HumorSection } from "@/components/home/today/HumorSection";
import { CircularsSection } from "@/components/home/today/CircularsSection";
import { FeaturedBrandsStrip } from "@/components/home/FeaturedBrandsStrip";
import { FeaturedMembers } from "@/components/home/today/FeaturedMembers";

const Index = () => (
  <Layout>
    <Seo
      title="MDDMA — Verified B2B Dry Fruits & Dates Trade Network"
      description="Official MDDMA member portal — verified dry fruits, dates and nuts merchants of Mumbai. Member directory, circulars and trade knowledge base."
      path="/"
    />

    {/* Rotating ad carousel sits flush under the header */}
    <div className="container mx-auto max-w-6xl px-4 pt-3 sm:px-6 sm:pt-4 lg:px-8">
      <AdSlot placement="homepage-banner" />
    </div>

    <div className="container mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="space-y-5">
        <TodayHeader />
        <LiveRatesTicker />

        {/* Quick actions */}
        <QuickActionsGrid />

        {/* 1. Market */}
        <MarketSnapshot />

        {/* 2. Market News */}
        <MarketNewsSection />

        {/* 3. Humor */}
        <HumorSection />

        {/* 4. Circulars & Notices */}
        <CircularsSection />

        {/* 5. Brands */}
        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          <FeaturedBrandsStrip />
        </div>

        {/* 6. Member Directory */}
        <FeaturedMembers />
      </div>
    </div>
  </Layout>
);

export default Index;
