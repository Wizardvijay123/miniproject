import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import CommunityStats from '@/components/sections/CommunityStats';
import Testimonials from '@/components/sections/Testimonials';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      {/* <Features />
      <HowItWorks />
      <CommunityStats />
      <Testimonials />
      <CTA />
      <Footer /> */}
    </main>
  );
}