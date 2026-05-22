import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCategoriesSection } from "@/components/home/FeaturedCategoriesSection";
import { FeaturedBrandsStrip } from "@/components/home/FeaturedBrandsStrip";
import { MarketplacePulse } from "@/components/home/MarketplacePulse";
import { WhyMddmaSection } from "@/components/home/WhyMddmaSection";
import { IndustryFeed } from "@/components/home/IndustryFeed";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { FooterCTA } from "@/components/home/FooterCTA";

const Index = () => (
  <Layout>
    <Seo
      title="MDDMA — Verified B2B Dry Fruits & Dates Trade Network"
      description="Official MDDMA member portal — verified dry fruits, dates and nuts merchants of Mumbai. Member directory, RFQs, circulars and trade knowledge base."
      path="/"
    />
    <HeroSection />
    <FeaturedCategoriesSection />
    <FeaturedBrandsStrip />
    <MarketplacePulse />
    <WhyMddmaSection />
    <IndustryFeed />
    <SponsorsSection />
    <FooterCTA />
  </Layout>
);

export default Index;
