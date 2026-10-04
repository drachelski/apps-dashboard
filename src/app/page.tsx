import { AppsSection } from '@/components/home/AppsSection';
import { ContactSection } from '@/components/home/ContactSection';
import { Hero } from '@/components/home/Hero';

export default function HomePage() {
  return (
    <>
      <Hero />
      <AppsSection />
      <ContactSection />
    </>
  );
}
