import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { TodayHeader } from "@/components/home/today/TodayHeader";
import { LiveRatesTicker } from "@/components/home/today/LiveRatesTicker";
import { QuickActionsGrid } from "@/components/home/today/QuickActionsGrid";
import { AdSlot } from "@/components/home/today/AdSlot";
import { MembershipCTA } from "@/components/home/today/MembershipCTA";
import { ActionRequiredCircular } from "@/components/home/today/ActionRequiredCircular";
import { CategoryGrid } from "@/components/home/today/CategoryGrid";
import { RecentListingsList } from "@/components/home/today/RecentListingsList";
import { FeaturedMembers } from "@/components/home/today/FeaturedMembers";
import { PartnersStrip } from "@/components/home/today/PartnersStrip";
import { AuthorityBlurb } from "@/components/home/today/AuthorityBlurb";

const Index = () => (
  <Layout>
    <Seo
      title="MDDMA — Verified B2B Dry Fruits & Dates Trade Network"
      description="Official MDDMA member portal — verified dry fruits, dates and nuts merchants of Mumbai. Member directory, RFQs, circulars and trade knowledge base."
      path="/"
    />

    {/* Mobile: single column app feed. Desktop (lg+): 12-col hybrid grid. */}
    <div className="container mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="space-y-5 lg:grid lg:grid-cols-12 lg:gap-6 lg:space-y-0">
        <div className="lg:col-span-12">
          <TodayHeader />
        </div>

        <div className="lg:col-span-12">
          <LiveRatesTicker />
        </div>

        <div className="lg:col-span-4">
          <QuickActionsGrid />
        </div>
        <div className="lg:col-span-4">
          <MembershipCTA />
        </div>
        <div className="lg:col-span-4">
          <ActionRequiredCircular />
        </div>

        <div className="lg:col-span-12">
          <AdSlot placement="homepage-banner" />
        </div>

        <div className="lg:col-span-7">
          <CategoryGrid />
        </div>
        <div className="lg:col-span-5">
          <RecentListingsList />
        </div>

        <div className="lg:col-span-12">
          <AdSlot placement="category-banner" />
        </div>

        <div className="lg:col-span-12">
          <FeaturedMembers />
        </div>

        <div className="lg:col-span-12">
          <PartnersStrip />
        </div>

        <div className="lg:col-span-12">
          <AuthorityBlurb />
        </div>
      </div>
    </div>
  </Layout>
);

export default Index;
