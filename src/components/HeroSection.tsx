import React from 'react';
import { ArrowUpRight, Apple, PlayCircle, Zap, Shield, Globe, CreditCard } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative px-8 md:px-16 py-12 md:py-20 min-h-screen flex items-center justify-center">
      {/* Background grid lines */}
      <div className="absolute inset-0 grid grid-cols-6 w-full h-full opacity-5 pointer-events-none">
        {[...Array(7)].map((_, i) => (
          <div key={`v-${i}`} className="border-l border-gray-500 h-full"></div>
        ))}
        {[...Array(7)].map((_, i) => (
          <div key={`h-${i}`} className="border-t border-gray-500 w-full"></div>
        ))}
      </div>
      
      {/* Floating orbs */}
      <div className="absolute top-1/6 left-1/4 w-80 h-80 bg-lime-400 rounded-full filter blur-[120px] opacity-25 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-lime-400 rounded-full filter blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Centered content */}
      <div className="z-10 text-center max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="mb-6">
            <span className="text-gray-300 uppercase tracking-wider font-medium bg-gray-800/30 backdrop-blur-md px-4 py-2 rounded-full border border-gray-700/50">
              BRIDGING CRYPTO & FIAT IN ETHIOPIA
            </span>
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={200}>
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            Ethiopia's <span className="text-lime-400">crypto gateway</span> <br />
            <span className="text-gray-400">for everyone.</span>
          </h1>
        </ScrollReveal>
        
        <ScrollReveal delay={400}>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            SemuniPay bridges the gap between cryptocurrencies and Ethiopian Birr, enabling seamless conversions and payments for both individuals and businesses across Ethiopia.
          </p>
        </ScrollReveal>
        
        {/* Feature cards with glassmorphism */}
        <ScrollReveal delay={600}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800/20 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6 hover:bg-gray-800/30 transition-all duration-300">
              <div className="bg-lime-400/20 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-lime-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-400 text-sm">Convert crypto to Birr in minutes, not days</p>
            </div>
            
            <div className="bg-gray-800/20 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6 hover:bg-gray-800/30 transition-all duration-300">
              <div className="bg-lime-400/20 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-lime-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Bank-Grade Security</h3>
              <p className="text-gray-400 text-sm">Regulatory compliant and fully secure</p>
            </div>
            
            <div className="bg-gray-800/20 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6 hover:bg-gray-800/30 transition-all duration-300">
              <div className="bg-lime-400/20 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-lime-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Global Access</h3>
              <p className="text-gray-400 text-sm">Connect Ethiopia to the world of crypto</p>
            </div>
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={800}>
          <div className="mb-12">
            <div className="text-gray-300 mb-6">Coming soon on</div>
            <div className="flex justify-center space-x-6">
              <div className="flex items-center bg-gray-800/30 backdrop-blur-md border border-gray-700/50 px-6 py-3 rounded-xl transform transition-all duration-300 hover:scale-105 hover:bg-gray-800/40">
                <Apple className="text-white mr-3" size={28} />
                <div className="text-left">
                  <div className="text-xs text-gray-400">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
            <button 
              onClick={() => navigate('/virtual-cards')}
              className="bg-gray-800/30 backdrop-blur-md border border-gray-700/50 text-white font-semibold px-8 py-4 rounded-full hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-105 flex items-center text-lg"
            >
              <CreditCard className="mr-2" size={20} />
              Virtual Cards
            </button>
            
              </div>
              
              <div className="flex items-center bg-gray-800/30 backdrop-blur-md border border-gray-700/50 px-6 py-3 rounded-xl transform transition-all duration-300 hover:scale-105 hover:bg-gray-800/40">
                <PlayCircle className="text-white mr-3" size={28} />
                <div className="text-left">
                  <div className="text-xs text-gray-400">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={1000}>
          <div className="flex justify-center items-center space-x-6">
            <div className="bg-lime-400/20 backdrop-blur-sm rounded-full p-4 border border-lime-400/30">
              <ArrowUpRight className="text-lime-400" size={32} />
            </div>
            
            <p className="text-gray-400 max-w-md text-left">
              Join thousands of Ethiopians who are already using SemuniPay to bridge the gap between traditional finance and the future of money.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default HeroSection;