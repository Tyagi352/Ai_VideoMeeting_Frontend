import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../api/index.js";
import Navbar from "../components/Navbar.jsx";
import HeroSection from "../components/Hero/HeroSection.jsx";
import FeaturesSection from "../components/Hero/FeaturesSection.jsx";
import HowItWorks from "../components/Hero/HowItWorks.jsx";
import Testimonials from "../components/Hero/Testimonials.jsx";
import CTASection from "../components/Hero/CTASection.jsx";
import Footer from "../components/Layout/Footer.jsx";

export default function Home() {
  const nav = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (user) {
      nav("/dashboard");
    }
  }, [user, nav]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
