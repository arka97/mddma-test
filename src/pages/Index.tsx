import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCategoriesSection } from "@/components/home/FeaturedCategoriesSection";
import { WhyMddmaSection } from "@/components/home/WhyMddmaSection";
import { FeaturedMembersSection } from "@/components/home/FeaturedMembersSection";
import { RecentListingsSection } from "@/components/home/RecentListingsSection";
import { CommunitySection } from "@/components/home/CommunitySection";
import { NewsSection } from "@/components/home/NewsSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { AdBanner } from "@/components/home/AdBanner";

const Index = () => {
  return (
    <Layout>
      <HeroSection />

      {/* Homepage Banner Ad */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdBanner placement="homepage-banner" />
      </div>

      <FeaturedCategoriesSection />
      <RecentListingsSection />
      <WhyMddmaSection />
      <FeaturedMembersSection />
      <CommunitySection />
      <NewsSection />
      <SponsorsSection />
    </Layout>
  );
};

export default Index;
