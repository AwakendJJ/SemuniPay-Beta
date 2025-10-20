import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface FaqItemProps {
  question: string;
  answer: string;
  index: number;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ScrollReveal delay={index * 100}>
      <div className="border-b border-gray-800">
        <button
          className="w-full py-6 flex justify-between items-center text-left focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h3 className="text-xl md:text-2xl font-semibold text-white">{question}</h3>
          <div className="flex-shrink-0 ml-4">
            {isOpen ? (
              <Minus className="text-lime-400" size={24} />
            ) : (
              <Plus className="text-lime-400" size={24} />
            )}
          </div>
        </button>
        
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
          }`}
        >
          <p className="text-gray-400">{answer}</p>
        </div>
      </div>
    </ScrollReveal>
  );
};

const FaqSection: React.FC = () => {
  const faqs: Omit<FaqItemProps, 'index'>[] = [
    {
      question: "How does SemuniPay convert crypto to Ethiopian Birr?",
      answer: "SemuniPay partners with licensed Ethiopian financial institutions to facilitate the conversion of cryptocurrencies to Ethiopian Birr (ETB). When you initiate a conversion, we secure the best available exchange rate, process the transaction, and deposit the ETB directly to your chosen bank account or mobile money wallet, typically within minutes."
    },
    {
      question: "Which cryptocurrencies does SemuniPay support?",
      answer: "SemuniPay currently supports major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), and stablecoins like USDC. We're continuously expanding our supported assets based on user demand and regulatory considerations within Ethiopia."
    },
    {
      question: "How do I buy crypto using Ethiopian Birr?",
      answer: "To buy crypto with Ethiopian Birr, simply select the 'Buy Crypto' option in your SemuniPay dashboard, choose your preferred cryptocurrency, enter the amount, and select your payment method (bank transfer or mobile money). Once your payment is confirmed, the cryptocurrency will be deposited to your wallet."
    },
    {
      question: "Is SemuniPay compliant with Ethiopian regulations?",
      answer: "Yes, SemuniPay works closely with Ethiopian regulatory authorities and financial institutions to ensure full compliance with local regulations. We implement comprehensive KYC (Know Your Customer) and AML (Anti-Money Laundering) procedures to maintain a secure and compliant platform."
    },
    {
      question: "What are the fees for using SemuniPay?",
      answer: "SemuniPay charges competitive fees that are significantly lower than traditional remittance services. Our fee structure includes a small percentage for conversions (typically 1-3% depending on the transaction volume) and minimal withdrawal fees. All fees are transparently displayed before you confirm any transaction."
    },
    {
      question: "How can I use SemuniPay for remittances to Ethiopia?",
      answer: "For remittances, the sender can convert their currency to cryptocurrency and send it to SemuniPay. We then convert the crypto to Ethiopian Birr and deposit it directly to the recipient's bank account or mobile money wallet. This process is typically faster and more cost-effective than traditional remittance channels."
    }
  ];

  return (
    <div className="py-20 px-8 md:px-16 bg-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-lime-400 rounded-full filter blur-[150px] opacity-10"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-lime-400 rounded-full filter blur-[150px] opacity-10"></div>
      
      <ScrollReveal>
        <div className="flex justify-center mb-4">
          <div className="bg-transparent border border-lime-400 text-lime-400 rounded-full px-4 py-1 text-sm">
            • FAQ
          </div>
        </div>
      </ScrollReveal>
      
      <ScrollReveal delay={200}>
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about AddisPay's crypto-to-fiat services in Ethiopia
          </p>
        </div>
      </ScrollReveal>
      
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <FaqItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default FaqSection;