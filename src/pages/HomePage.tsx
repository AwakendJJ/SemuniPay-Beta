import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import PartnersSection from '../components/PartnersSection';
import FeaturesSection from '../components/FeaturesSection';
import ServicesSection from '../components/ServicesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CtaSection from '../components/CtaSection';
import FaqSection from '../components/FaqSection';
import Footer from '../components/Footer';

function HomePage() {
  // Initialize scroll reveal animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollElements = document.querySelectorAll('.scroll-reveal:not(.active)');
      
      scrollElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };
    
    // Initial check on load
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="pt-16"> {/* Add padding to prevent content from being hidden under the navbar */}
        <section id="home">
          <HeroSection />
        </section>
        <PartnersSection />
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="services">
          <ServicesSection />
        </section>
        <section id="cta">
          <CtaSection />
        </section>
        <section id="faq">
          <FaqSection />
        </section>
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;