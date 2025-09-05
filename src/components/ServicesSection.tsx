import React from 'react';
import { 
  SendHorizontal, 
  ReceiptText, 
  BarChart, 
  Clock 
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import ParallaxSection from './ParallaxSection';

const ServiceItem = ({ 
  icon: Icon, 
  title, 
  description,
  position,
  index
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  position: 'left' | 'right';
  index: number;
}) => {
  return (
    <ScrollReveal delay={index * 150}>
      <div className={`flex ${position === 'left' ? 'flex-row-reverse' : 'flex-row'} items-start gap-6 mb-24`}>
        <div className={`${position === 'left' ? 'text-right' : 'text-left'} max-w-xs`}>
          <h3 className="text-2xl font-bold mb-3">{title}</h3>
          <p className="text-gray-400">{description}</p>
        </div>
        <div className="bg-gray-800 p-3 rounded-full border border-gray-700 flex-shrink-0">
        <div className="bg-gray-800/30 backdrop-blur-md p-3 rounded-full border border-gray-700/50 flex-shrink-0">
          <Icon className="text-white" size={24} />
        </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

const ServicesSection = () => {
  const leftServices = [
    {
      icon: SendHorizontal,
      title: "Crypto-to-Birr Conversion",
      description: "Convert your cryptocurrency to Ethiopian Birr and withdraw directly to your bank account or mobile money wallet."
    },
    {
      icon: ReceiptText,
      title: "Merchant Payments",
      description: "Pay Ethiopian merchants and service providers using your crypto assets while they receive Birr."
    }
  ];

  const rightServices = [
    {
      icon: BarChart,
      title: "Birr-to-Crypto Onramp",
      description: "Deposit Ethiopian Birr via bank transfer or mobile money and convert it to your preferred cryptocurrency."
    },
    {
      icon: Clock,
      title: "Remittance Solutions",
      description: "Send money to Ethiopia from abroad with lower fees and faster settlement than traditional remittance services."
    }
  ];

  return (
    <div className="py-20 px-8 md:px-16 bg-gray-900">
      <ScrollReveal>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ethiopia's first<br />crypto-fiat bridge
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            SemuniPay connects the Ethiopian financial ecosystem with global cryptocurrency markets, enabling seamless transactions between worlds.
          </p>
        </div>
      </ScrollReveal>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Left side services */}
        <div className="space-y-8">
          {leftServices.map((service, index) => (
            <ServiceItem
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              position="left"
              index={index}
            />
          ))}
        </div>
        
        {/* Center phone mockup */}
        <ParallaxSection speed={0.05}>
          <div className="relative flex justify-center">
            <div className="w-72 h-auto bg-gray-800/20 backdrop-blur-md rounded-3xl p-3 shadow-2xl transform transition-transform duration-500 hover:scale-105 border border-gray-700/30">
              <div className="bg-white rounded-3xl overflow-hidden h-full border border-gray-200 shadow-inner">
                {/* Phone status bar */}
                <div className="flex justify-between items-center p-2 text-xs text-gray-600 bg-gray-50">
                  <span>9:41</span>
                  <div className="flex space-x-1">
                    <span>●●●●</span>
                    <span>●●</span>
                  </div>
                </div>
                
                {/* App content */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-8">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    </div>
                    <div className="text-center text-sm font-medium text-gray-800">SemuniPay</div>
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-800">$48,296.24</div>
                    <div className="text-xs text-gray-500">≈ 2,414,812 ETB</div>
                  </div>
                  
                  <div className="flex justify-center space-x-4 mb-10">
                    <div className="bg-lime-400 text-gray-900 text-xs px-6 py-2 rounded-full font-medium shadow-lg">Buy Crypto</div>
                    <div className="bg-gray-200 text-gray-700 text-xs px-6 py-2 rounded-full font-medium">Sell Crypto</div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-4">Recent Transactions</div>
                  
                  <div className="space-y-4 mb-10">
                    <div className="bg-gray-100 rounded-lg p-3 flex justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-orange-100 mr-2 flex items-center justify-center">
                          <span className="text-xs text-orange-600">₿</span>
                        </div>
                        <span className="text-gray-800">Sold Bitcoin</span>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-800">25,000 ETB</div>
                        <div className="text-lime-400 text-xs">Completed</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 rounded-lg p-3 flex justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 mr-2 flex items-center justify-center">
                          <span className="text-xs text-blue-600">Ξ</span>
                        </div>
                        <span className="text-gray-800">Bought ETH</span>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-800">10,000 ETB</div>
                        <div className="text-lime-400 text-xs">Completed</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ParallaxSection>
        
        {/* Right side services */}
        <div className="space-y-8">
          {rightServices.map((service, index) => (
            <ServiceItem
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              position="right"
              index={index + 2} // Offset for staggered animation
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;