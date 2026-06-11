import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { TodayHeader } from "@/components/home/today/TodayHeader";
import { LiveRatesTicker } from "@/components/home/today/LiveRatesTicker";
import { AdSlot } from "@/components/home/today/AdSlot";
import { QuickActionsGrid } from "@/components/home/today/QuickActionsGrid";
import { CategoryGrid } from "@/components/home/today/CategoryGrid";
import { RecentListingsList } from "@/components/home/today/RecentListingsList";

import { MembershipCTA } from "@/components/home/today/MembershipCTA";
import { PartnersStrip } from "@/components/home/today/PartnersStrip";
import { AuthorityBlurb } from "@/components/home/today/AuthorityBlurb";

const Index = () => (
  <Layout>
    <Seo
      title="MDDMA — Verified B2B Dry Fruits & Dates Trade Network"
      description="Official MDDMA member portal — verified dry fruits, dates and nuts merchants of Mumbai. Member directory, circulars and trade knowledge base."
      path="/"
    />

    <div className="container mx-auto max-w-6xl px-4 pt-3 sm:px-6 sm:pt-4 lg:px-8">
      <AdSlot placement="homepage-banner" />
    </div>

    <div className="container mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="space-y-5">
        <TodayHeader />
        <LiveRatesTicker />
        <QuickActionsGrid />
        <CategoryGrid />
        <RecentListingsList />
        
        <MembershipCTA />
        <PartnersStrip />
        <AuthorityBlurb />
      </div>
    </div>
  </Layout>
);

export default Index;
