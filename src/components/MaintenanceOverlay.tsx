import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const MaintenanceOverlay: React.FC = () => {
  // Prevent body scroll when overlay is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-[40px]">
      {/* Centered glass panel */}
      <div 
        className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 w-full max-w-md mx-4 border border-gray-600/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(255,255,255,0.05),inset_0_2px_4px_rgba(0,0,0,0.3)]"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Title */}
        <h2 
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 text-center"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          We'll be back soon
        </h2>
        
        {/* Description */}
        <div 
          className="text-gray-200 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-center space-y-3 sm:space-y-4"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          <p>
            We're currently making improvements to SemuniPay.
          </p>
          <p>
            Thanks for your patience — for updates or questions, reach us on X.
          </p>
        </div>
        
        {/* X/Twitter link */}
        <div className="flex justify-center">
          <a
            href="https://twitter.com/semunipay"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 sm:gap-3 bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/50 hover:border-lime-400/50 text-white hover:text-lime-400 px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
            <span className="font-semibold text-sm sm:text-base">Follow us on X</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceOverlay;
