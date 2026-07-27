import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { CampaignShowcase } from '@/components/landing/CampaignShowcase';
import { StatsSection } from '@/components/landing/StatsSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { AISection } from '@/components/landing/AISection';
import { AlgorandSection } from '@/components/landing/AlgorandSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] overflow-hidden">
      <Navbar />
      <HeroSection />
      <CampaignShowcase />
      <StatsSection />
      <FeaturesSection />
      <AISection />
      <AlgorandSection />
      <HowItWorks />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
