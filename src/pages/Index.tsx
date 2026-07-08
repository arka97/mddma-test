import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { HomeHero } from "@/components/home/hero/HomeHero";
import { LiveTicker } from "@/components/home/hero/LiveTicker";
import { TodayHeader } from "@/components/home/today/TodayHeader";
import { AdSlot } from "@/components/home/today/AdSlot";
import { QuickActionsGrid } from "@/components/home/today/QuickActionsGrid";
import { CategoryGrid } from "@/components/home/today/CategoryGrid";
import { RecentListingsList } from "@/components/home/today/RecentListingsList";
import { NewMembersList } from "@/components/home/today/NewMembersList";
import { MembershipCTA } from "@/components/home/today/MembershipCTA";

const Index = () => (
  <Layout>
    <Seo
      title="MDDMA — Verified B2B Dry Fruits & Dates Trade Network"
      description="Official MDDMA member portal — verified dry fruits, dates and nuts merchants of Mumbai. Directory, live APMC signals, RFQs and trade circulars."
      path="/"
    />

    <div className="container mx-auto max-w-6xl space-y-5 px-5 pt-4 sm:px-6 sm:pt-5 lg:px-8">
      <HomeHero />
      <LiveTicker />
    </div>

    <div className="container mx-auto max-w-6xl px-5 py-5 sm:px-6 lg:px-8">
      <div className="space-y-5">
        <QuickActionsGrid />
        <TodayHeader />
        <CategoryGrid />
        <RecentListingsList />
        <NewMembersList />
        <MembershipCTA />
        <AdSlot placement="homepage-banner" />
      </div>
    </div>
  </Layout>
);

export default Index;
