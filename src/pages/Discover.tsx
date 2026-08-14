import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { HomeHero } from "@/components/home/hero/HomeHero";
import { TodayHeader } from "@/components/home/today/TodayHeader";
import { AdSlot } from "@/components/home/today/AdSlot";
import { QuickActionsGrid } from "@/components/home/today/QuickActionsGrid";
import { CategoryGrid } from "@/components/home/today/CategoryGrid";
import { RecentListingsList } from "@/components/home/today/RecentListingsList";
import { NewMembersList } from "@/components/home/today/NewMembersList";
import { MembershipCTA } from "@/components/home/today/MembershipCTA";

const Discover = () => (
  <Layout>
    <Seo
      title="Discover — G-BAU-G Verified Food Trade Network"
      description="Discover verified businesses, products, market intelligence and RFQs across nuts, dry fruits, dates, seeds, spices and allied foods."
      path="/discover"
    />

    <div className="container mx-auto max-w-6xl space-y-5 px-5 pt-4 sm:px-6 sm:pt-5 lg:px-8">
      <AdSlot placement="homepage-banner" />
      <TodayHeader />
      <QuickActionsGrid />
    </div>

    <div className="container mx-auto max-w-6xl px-5 py-5 sm:px-6 lg:px-8">
      <div className="space-y-5">
        <HomeHero />
        <AdSlot placement="categories-above" />
        <CategoryGrid />
        <RecentListingsList />
        <NewMembersList />
        <MembershipCTA />
          </div>
    </div>
  </Layout>
);

export default Discover;
