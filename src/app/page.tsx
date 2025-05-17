import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutUsSection from "@/components/AboutUsSection";
import FeaturesSection from "@/components/FeaturesSection";
import WorkingHoursSection from "@/components/WorkingHoursSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import MenuSection from "@/components/MenuSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0A1316]">
      <Navbar />
      <HeroSection />
      <AboutUsSection />
      <FeaturesSection />
      <WorkingHoursSection />
      <TestimonialsSection />
      <MenuSection />
      <Footer />
    </div>
  );
}
