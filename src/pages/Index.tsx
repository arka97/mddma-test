import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCategoriesSection } from "@/components/home/FeaturedCategoriesSection";
import { MarketplacePulse } from "@/components/home/MarketplacePulse";
import { WhyMddmaSection } from "@/components/home/WhyMddmaSection";
import { IndustryFeed } from "@/components/home/IndustryFeed";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { FooterCTA } from "@/components/home/FooterCTA";

const Index = () => (
  <Layout>
    <HeroSection />
    <FeaturedCategoriesSection />
    <MarketplacePulse />
    <WhyMddmaSection />
    <IndustryFeed />
    <SponsorsSection />
    <FooterCTA />
  </Layout>
);

export default Index;
