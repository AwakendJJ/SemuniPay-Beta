import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { account } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      // Update navbar background
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Smooth scroll to sections when clicking nav links
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 100;
      
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute('id') || '';
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80, // Adjust for navbar height
        behavior: 'smooth'
      });
    }
  };

  const handleWalletConnect = () => {
    if (account) {
      navigate('/dashboard');
    } else {
      navigate('/connect');
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-8 md:px-16 flex justify-between items-center transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-800/80 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
          <span className="text-gray-900 font-bold text-lg">S</span>
        </div>
        <div className="text-lime-400 font-semibold text-2xl tracking-wide">SemuniPay</div>
      </div>
      
      <div className="hidden md:flex space-x-10">
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
          className={`transition-colors ${activeSection === 'home' ? 'text-lime-400' : 'text-white hover:text-lime-400'}`}
        >
          Home
        </a>
        <a 
          href="#features" 
          onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}
          className={`transition-colors ${activeSection === 'features' ? 'text-lime-400' : 'text-white hover:text-lime-400'}`}
        >
          Features
        </a>
        <a 
          href="#services" 
          onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
          className={`transition-colors ${activeSection === 'services' ? 'text-lime-400' : 'text-white hover:text-lime-400'}`}
        >
          Services
        </a>
        <button 
          onClick={() => navigate('/virtual-cards')}
          className="text-white hover:text-lime-400 transition-colors"
        >
          Virtual Cards
        </button>
        <a 
          href="#faq" 
          onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}
          className={`transition-colors ${activeSection === 'faq' ? 'text-lime-400' : 'text-white hover:text-lime-400'}`}
        >
          FAQ
        </a>
      </div>
      
      <button 
        onClick={handleWalletConnect}
        className="bg-lime-400 text-gray-900 font-semibold px-6 py-2 rounded-full hover:bg-lime-300 transition-all duration-300 transform hover:scale-105 flex items-center"
      >
        {account ? 'Dashboard' : 'Connect Wallet'}
      </button>
    </nav>
  );
};

export default Navbar;