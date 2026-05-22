import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { FeaturedCategoriesSection } from "@/components/home/FeaturedCategoriesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { FeaturedBrandsStrip } from "@/components/home/FeaturedBrandsStrip";
import { MarketplacePulse } from "@/components/home/MarketplacePulse";
import { HomeFaq } from "@/components/home/HomeFaq";
import { FooterCTA } from "@/components/home/FooterCTA";

const Index = () => (
  <Layout>
    <Seo
      title="MDDMA — Dry Fruits, Dates & Commodities | Verified B2B Trade"
      description="Source dry fruits, dates, nuts, spices, honey & more from verified sellers. India's most trusted B2B trade network — only on MDDMA."
      path="/"
    />
    <HeroSection />
    <TrustStrip />
    <FeaturedCategoriesSection />
    <HowItWorksSection />
    <div className="bg-surface-cream">
      <MarketplacePulse />
    </div>
    <FeaturedBrandsStrip />
    <HomeFaq />
    <FooterCTA />
  </Layout>
);

export default Index;
