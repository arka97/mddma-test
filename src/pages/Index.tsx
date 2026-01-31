import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { PillarsSection } from "@/components/home/PillarsSection";
import { QuickAccessSection } from "@/components/home/QuickAccessSection";
import { PresidentMessageSection } from "@/components/home/PresidentMessageSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <PillarsSection />
      <QuickAccessSection />
      <PresidentMessageSection />
    </Layout>
  );
};

export default Index;
