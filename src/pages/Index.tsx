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
      title="MDDMA — Dry Fruits, Dates & Commodities | Verified B2B Trade"
      description="Source dry fruits, dates, nuts, spices, honey & more from verified sellers. India's most trusted B2B trade network — only on MDDMA."
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
