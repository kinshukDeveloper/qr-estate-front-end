import NavbarV3 from "@/components/landing/v3/Navbar";
import HeroV3 from '@/components/landing/v3/Hero';
import FeaturesV3 from '@/components/landing/v3/Features';
import HowItWorksV3 from '@/components/landing/v3/HowItWorks';
import PricingV3 from '../components/landing/v3/Pricing';
import {
  CityStripV3,
  TestimonialsV3,
  FinalCTAV3,
  FooterV3,
} from '@/components/landing/v3/Sections';

export default function LandingPageV3() {
  return (
    <>
      <NavbarV3 />
      <HeroV3 />
      <CityStripV3 />
      <FeaturesV3 />
      <HowItWorksV3 />
      <PricingV3 />
       <TestimonialsV3 />
      <FinalCTAV3 />
      <FooterV3 />
    </>
  );
}
