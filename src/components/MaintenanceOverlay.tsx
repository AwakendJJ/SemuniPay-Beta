import React, { useEffect } from 'react';
import { Twitter } from 'lucide-react';

const MaintenanceOverlay: React.FC = () => {
  // Prevent body scroll when overlay is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xl">
      {/* Soft glow edges */}
      <div className="absolute inset-0 border-2 border-lime-400/20 shadow-[0_0_60px_rgba(163,230,53,0.2)] pointer-events-none" />
      
      {/* Centered modal card */}
      <div className="relative bg-gray-800/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 w-full max-w-md mx-4 border border-gray-700/50 shadow-2xl shadow-[0_0_30px_rgba(163,230,53,0.3)]">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 text-center">
          We'll be back soon
        </h2>
        
        {/* Description */}
        <div className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-center space-y-3 sm:space-y-4">
          <p>
            We're currently making improvements to SemuniPay.
          </p>
          <p>
            Thanks for your patience — for updates or questions, reach us on X.
          </p>
        </div>
        
        {/* Twitter/X link */}
        <div className="flex justify-center">
          <a
            href="https://twitter.com/semunipay"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 sm:gap-3 bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/50 hover:border-lime-400/50 text-white hover:text-lime-400 px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <Twitter size={20} className="sm:w-6 sm:h-6" />
            <span className="font-semibold text-sm sm:text-base">Follow us on X</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceOverlay;
