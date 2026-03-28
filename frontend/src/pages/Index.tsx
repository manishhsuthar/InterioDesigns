import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturesGrid from "@/components/home/FeaturesGrid";
import ProjectCardStack from "@/components/home/ProjectCardStack";
import Footer from "@/components/layout/Footer";
import ExploreSection from "@/components/landing/ExploreSection";
import EstimateSection from "@/components/landing/EstimateSection";
import AboutSection from "@/components/landing/AboutSection";
import ContactSection from "@/components/landing/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section id="home" className="scroll-mt-32">
          <HeroSection />
        </section>
        <FeaturesGrid />
        <ProjectCardStack />
        <EstimateSection />
        <ExploreSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
