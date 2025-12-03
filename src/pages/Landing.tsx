import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Workflow from "@/components/landing/Workflow";
import Pricing from "@/components/landing/Pricing";
import Languages from "@/components/landing/Languages";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const Landing = () => {
  return (
    <LanguageProvider>
      <main className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        <Features />
        <Workflow />
        <Pricing />
        <Languages />
        <CTA />
        <Footer />
      </main>
    </LanguageProvider>
  );
};

export default Landing;
