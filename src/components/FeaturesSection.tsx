import React from 'react';
import { 
  Smartphone, 
  DollarSign, 
  Clock, 
  Wallet, 
  BarChart2, 
  CreditCard 
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  index
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  index: number;
}) => {
  return (
    <ScrollReveal delay={index * 100}>
      <div className="bg-gray-800/20 backdrop-blur-md border border-gray-700/30 rounded-2xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:bg-gray-800/30">
        <div className="bg-lime-400/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-lime-400/30">
          <Icon className="text-lime-400" size={28} />
        </div>
        <h3 className="text-white text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </ScrollReveal>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Smartphone,
      title: "Crypto-to-Fiat Bridge",
      description: "Convert your crypto to Ethiopian Birr instantly and send directly to local banks"
    },
    {
      icon: Clock,
      title: "Fast Transactions",
      description: "Complete crypto-to-fiat conversions in minutes instead of days"
    },
    {
      icon: DollarSign,
      title: "Fiat-to-Crypto Onramp",
      description: "Buy crypto using Ethiopian Birr through bank transfers or mobile money"
    },
    {
      icon: Wallet,
      title: "Virtual Cards",
      description: "Access virtual cards for online payments powered by your crypto assets"
    },
    {
      icon: BarChart2,
      title: "Competitive Rates",
      description: "Get the best exchange rates with transparent fees and no hidden costs"
    },
    {
      icon: CreditCard,
      title: "Direct Bill Payments",
      description: "Pay for local services and utilities directly using your crypto"
    }
  ];

  return (
    <div className="py-20 px-8 md:px-16 bg-gray-900">
      <ScrollReveal>
        <div className="flex justify-center mb-4">
          <div className="bg-transparent border border-lime-400 text-lime-400 rounded-full px-4 py-1 text-sm">
            • Features
          </div>
        </div>
      </ScrollReveal>
      
      <ScrollReveal delay={200}>
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Bridging Crypto and Fiat<br />for Ethiopia
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            SemuniPay removes barriers between cryptocurrencies and Ethiopian Birr,
            enabling seamless financial transactions for everyone
          </p>
        </div>
      </ScrollReveal>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;