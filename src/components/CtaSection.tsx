import React from 'react';
import { ArrowRight, Shield, Clock, Globe } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import ParallaxSection from './ParallaxSection';
import { useWallet } from '../context/WalletContext';
import { useNavigate } from 'react-router-dom';

const CtaSection: React.FC = () => {
  const { account } = useWallet();
  const navigate = useNavigate();

  const handleConnectClick = () => {
    if (account) {
      navigate('/dashboard');
    } else {
      navigate('/connect');
    }
  };

  return (
    <div className="py-24 px-8 md:px-16 bg-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 grid grid-cols-6 w-full h-full opacity-5 pointer-events-none">
        {[...Array(7)].map((_, i) => (
          <div key={`v-${i}`} className="border-l border-gray-500 h-full"></div>
        ))}
        {[...Array(7)].map((_, i) => (
          <div key={`h-${i}`} className="border-t border-gray-500 w-full"></div>
        ))}
      </div>
      
      {/* Glowing orbs */}
      <ParallaxSection speed={-0.1} className="absolute top-1/4 right-1/4 w-64 h-64 bg-lime-400 rounded-full filter blur-[120px] opacity-20"></ParallaxSection>
      <ParallaxSection speed={0.1} className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-lime-400 rounded-full filter blur-[120px] opacity-20"></ParallaxSection>
      
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="bg-gray-800/20 backdrop-blur-md rounded-3xl p-8 md:p-12 lg:p-16 border border-gray-700/30 shadow-2xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-lime-400 rounded-full filter blur-[80px] opacity-10"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-lime-400 rounded-full filter blur-[80px] opacity-10"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="lg:max-w-2xl">
                  <ScrollReveal delay={100}>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                      Ready to <span className="text-lime-400">bridge</span> the crypto-fiat gap with SemuniPay?
                    </h2>
                  </ScrollReveal>
                  
                  <ScrollReveal delay={200}>
                    <p className="text-gray-300 text-lg mb-8">
                      Join SemuniPay to experience seamless crypto-to-fiat conversions, lower remittance fees, and innovative financial solutions tailored for Ethiopia.
                    </p>
                  </ScrollReveal>
                  
                  <ScrollReveal delay={300}>
                    <div className="flex flex-wrap gap-6 mb-8">
                      <div className="flex items-center">
                        <div className="bg-gray-800/30 backdrop-blur-sm p-2 rounded-full mr-3 border border-gray-700/50">
                          <Shield className="text-lime-400" size={20} />
                        </div>
                        <span className="text-gray-300">Regulatory compliant</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="bg-gray-800/30 backdrop-blur-sm p-2 rounded-full mr-3 border border-gray-700/50">
                          <Clock className="text-lime-400" size={20} />
                        </div>
                        <span className="text-gray-300">Minutes, not days</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="bg-gray-800/30 backdrop-blur-sm p-2 rounded-full mr-3 border border-gray-700/50">
                          <Globe className="text-lime-400" size={20} />
                        </div>
                        <span className="text-gray-300">Local & global access</span>
                      </div>
                    </div>
                  </ScrollReveal>
                  
                  <ScrollReveal delay={400}>
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={handleConnectClick}
                        className="bg-lime-400 text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-lime-300 transition-colors flex items-center transform hover:scale-105 duration-300"
                      >
                        {account ? 'Go to Dashboard' : 'Connect Wallet'}
                        <ArrowRight className="ml-2" size={18} />
                      </button>
                      
                      <button className="bg-transparent border border-lime-400 text-lime-400 font-semibold px-8 py-3 rounded-full hover:bg-lime-400/10 transition-colors transform hover:scale-105 duration-300">
                        Learn More
                      </button>
                    </div>
                  </ScrollReveal>
                </div>
                
                <ScrollReveal delay={300} className="lg:w-1/3 relative">
                  <div className="w-full h-auto bg-gray-800/30 backdrop-blur-md rounded-3xl p-3 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 border border-gray-700/50">
                    <div className="bg-black rounded-2xl overflow-hidden h-full p-6">
                      <div className="flex justify-between items-center mb-8">
                        <div className="text-xl font-bold text-white">SemuniPay</div>
                        <div className="w-10 h-10 rounded-full bg-lime-400 flex items-center justify-center">
                          <span className="text-black font-bold">SP</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mb-8">
                        <div className="h-2 bg-gray-800 rounded-full w-full"></div>
                        <div className="h-2 bg-gray-800 rounded-full w-3/4"></div>
                        <div className="h-2 bg-gray-800 rounded-full w-1/2"></div>
                      </div>
                      
                      <div className="bg-gray-800 rounded-xl p-4 mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400 text-sm">ETH to ETB Rate</span>
                          <span className="text-lime-400 text-sm">Live</span>
                        </div>
                        <div className="text-2xl font-bold">1 ETH = 50,000 ETB</div>
                      </div>
                      
                      <button 
                        onClick={handleConnectClick}
                        className="bg-lime-400 text-black w-full py-3 rounded-xl font-bold"
                      >
                        {account ? 'View Dashboard' : 'Connect Wallet'}
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default CtaSection;