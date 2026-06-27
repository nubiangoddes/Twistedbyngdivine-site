import HeroSection from '@/components/features/HeroSection';
import FindYourTwistQuiz from '@/components/features/FindYourTwistQuiz';
import CollectionsSection from '@/components/features/CollectionsSection';
import ConfidenceSection from '@/components/features/ConfidenceSection';
import FounderSection from '@/components/features/FounderSection';
import CustomOrdersSection from '@/components/features/CustomOrdersSection';
import NewsletterSection from '@/components/features/NewsletterSection';
import FAQSection from '@/components/features/FAQSection';
import ContactSection from '@/components/features/ContactSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FindYourTwistQuiz />
      <CollectionsSection />
      <ConfidenceSection />
      <FounderSection />
      <CustomOrdersSection />
      <NewsletterSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
