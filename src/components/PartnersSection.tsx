import React, { useRef } from 'react';

const PartnersSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const partners = [
    { 
      name: 'Commercial Bank of Ethiopia', 
      logo: '/src/Images/Commercial Bank of Ethiopia Logo.png' 
    },
    { 
      name: 'Chapa', 
      logo: '/src/Images/Chapa Logo.png' 
    },
    { 
      name: 'CBE Birr', 
      logo: '/src/Images/CBE Birr ( No background ) Logo.png' 
    },
    { 
      name: 'Awash International Bank', 
      logo: '/src/Images/Awash International Bank ( No text ) Logo.png' 
    },
    { 
      name: 'Kacha', 
      logo: '/src/Images/KachaLogo.png' 
    },
    { 
      name: 'TeleBirr', 
      logo: '/src/Images/TeleBirrLogo.png' 
    },
    { 
      name: 'Bank of Abyssinia', 
      logo: '/src/Images/Bank of Abyssinia Logo.png' 
    }
  ];
  
  // Duplicate the partners array to create a seamless loop effect
  const duplicatedPartners = [...partners, ...partners, ...partners]; // Triple to ensure enough content for smooth looping
  
  return (
    <div className="py-16 px-8 md:px-16 bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-transparent border border-lime-400 text-lime-400 rounded-full px-4 py-1 text-sm mb-4">
            • Banking Partners
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Integrated with Ethiopia's leading financial institutions
          </h2>
        </div>
        
        <div className="relative overflow-hidden">
          {/* Gradient fade on left side */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-gray-900 to-transparent"></div>
          
          {/* Scrolling container with CSS animation instead of JS */}
          <div 
            ref={scrollRef}
            className="flex items-center space-x-20 py-8 overflow-x-auto scrollbar-hide partners-scroll"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {duplicatedPartners.map((partner, index) => (
              <div 
                key={`${partner.name}-${index}`} 
                className="flex-shrink-0 flex items-center justify-center h-16 opacity-70 hover:opacity-100 transition-opacity duration-500"
              >
                <img 
                  src={partner.logo} 
                  alt={`${partner.name} logo`} 
                  className="h-full w-auto object-contain max-w-[120px]"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          
          {/* Gradient fade on right side */}
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-gray-900 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default PartnersSection;