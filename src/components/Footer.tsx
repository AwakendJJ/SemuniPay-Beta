import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 px-8 md:px-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Company info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <span className="text-gray-900 font-bold text-xl">S</span>
              </div>
              <div className="text-lime-400 font-semibold text-3xl tracking-wide">SemuniPay</div>
            </div>
            <p className="text-gray-400 mb-6">
              Ethiopia's premier crypto-to-fiat bridge, enabling seamless transactions between cryptocurrencies and Ethiopian Birr.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-lime-400 hover:text-gray-900 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-lime-400 hover:text-gray-900 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-lime-400 hover:text-gray-900 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-lime-400 hover:text-gray-900 transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-lime-400 hover:text-gray-900 transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">Home</a>
              <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">About Us</a>
              <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">Services</a>
              <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">Features</a>
              <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">Pricing</a>
              <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">Blog</a>
              <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">FAQ</a>
              <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">Contact</a>
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates on crypto-fiat solutions in Ethiopia</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-800 text-white px-4 py-2 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
              <button className="bg-lime-400 text-gray-900 font-semibold px-4 py-2 rounded-r-lg hover:bg-lime-300 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 mb-4 md:mb-0">
            © {currentYear} SemuniPay. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-lime-400 transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-lime-400 transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-lime-400 transition-colors text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;