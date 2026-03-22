import { Navbar }           from '@/components/landing/Navbar';
import { Hero }             from '@/components/landing/Hero';
import { CityStrip }        from '@/components/landing/CityStrip';
import { HowItWorks }       from '@/components/landing/HowItWorks';
import { Features }         from '@/components/landing/Features';
import { PropertyPreview }  from '@/components/landing/PropertyPreview';
import { Pricing }          from '@/components/landing/Pricing';
import { Testimonials }     from '@/components/landing/Testimonials';
import { FinalCTA }         from '@/components/landing/FinalCTA';
import { Footer }           from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <main className="bg-brand-bg min-h-screen">
      <Navbar />
      <Hero />
      <CityStrip />
      <HowItWorks />
      <Features />
      <PropertyPreview />
      <Pricing />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
