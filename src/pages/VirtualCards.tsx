import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  Eye, 
  EyeOff, 
  Copy, 
  Plus,
  Settings,
  Lock,
  Unlock,
  Trash2,
  X,
  Check,
  DollarSign,
  Pause,
  Play,
  AlertTriangle
} from 'lucide-react';

const VirtualCards: React.FC = () => {
  const { account, disconnectWallet } = useWallet();
  const navigate = useNavigate();
  const [showCardDetails, setShowCardDetails] = useState<{ [key: string]: boolean }>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [fundAmount, setFundAmount] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  
  const handleDisconnect = () => {
    disconnectWallet();
    navigate('/');
  };

  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const toggleCardDetails = (cardId: string) => {
    setShowCardDetails(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(`${type} copied!`);
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const handleCreateCard = () => {
    setShowCreateModal(false);
    setShowSuccessModal(true);
    setNewCardName('');
  };

  const handleFundCard = () => {
    setShowFundModal(false);
    setShowSuccessModal(true);
    setFundAmount('');
  };

  const handleDeleteCard = () => {
    setShowDeleteModal(false);
    setShowSuccessModal(true);
  };

  const virtualCards = [
    {
      id: '1',
      name: 'Primary Card',
      balance: '2,450.00',
      currency: 'USD',
      cardNumber: '4532 1234 5678 9012',
      expiryDate: '12/27',
      cvv: '123',
      status: 'active',
      type: 'visa'
    },
    {
      id: '2',
      name: 'Shopping Card',
      balance: '850.50',
      currency: 'USD',
      cardNumber: '5412 9876 5432 1098',
      expiryDate: '08/26',
      cvv: '456',
      status: 'locked',
      type: 'mastercard'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-gray-800/50 bg-gray-800/20 backdrop-blur-md">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="mr-4 p-2 hover:bg-gray-700/50 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <span className="text-gray-900 font-bold text-lg">S</span>
            </div>
            <div className="text-lime-400 font-semibold text-2xl tracking-wide">SemuniPay</div>
          </div>
        </div>
        {account ? (
          <div className="bg-gray-800/30 backdrop-blur-sm text-lime-400 font-medium px-4 py-2 rounded-full border border-gray-700/50">
            {formatWalletAddress(account)}
          </div>
        ) : (
          <button 
            className="bg-lime-400 text-gray-900 font-semibold px-6 py-2 rounded-full hover:bg-lime-300 transition-all duration-300"
            onClick={handleDisconnect}
          >
            Connect
          </button>
        )}
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Virtual Cards</h1>
            <p className="text-gray-400">Manage your crypto-powered virtual cards</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-lime-400 text-gray-900 font-semibold px-6 py-3 rounded-xl hover:bg-lime-300 transition-all duration-300 flex items-center transform hover:scale-105"
          >
            <Plus size={20} className="mr-2" />
            Create New Card
          </button>
        </div>

        {/* Copy Success Notification */}
        {copySuccess && (
          <div className="fixed top-4 right-4 bg-lime-400/20 backdrop-blur-md border border-lime-400/30 text-lime-400 px-4 py-2 rounded-lg z-50 animate-pulse">
            {copySuccess}
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {virtualCards.map((card) => (
            <div key={card.id} className="bg-gray-800/20 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6 hover:bg-gray-800/30 transition-all duration-300">
              {/* Card Visual */}
              <div className="relative mb-6">
                <div className={`w-full h-48 rounded-xl p-6 text-white relative overflow-hidden ${
                  card.type === 'visa' 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-700' 
                    : 'bg-gradient-to-br from-red-600 to-orange-700'
                }`}>
                  {/* Card Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 right-4 w-20 h-20 border border-white/30 rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-16 h-16 border border-white/30 rounded-full"></div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm opacity-80">Balance</div>
                        <div className="text-2xl font-bold">${card.balance}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs opacity-80 uppercase tracking-wider">
                          {card.type}
                        </div>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs mt-1 ${
                          card.status === 'active' 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {card.status === 'active' ? <Unlock size={12} className="mr-1" /> : <Lock size={12} className="mr-1" />}
                          {card.status}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-lg font-mono tracking-wider mb-2">
                        {showCardDetails[card.id] ? card.cardNumber : '•••• •••• •••• ••••'}
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs opacity-80">Card Name</div>
                          <div className="font-semibold">{card.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs opacity-80">Expires</div>
                          <div className="font-mono">
                            {showCardDetails[card.id] ? card.expiryDate : '••/••'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Details */}
              {showCardDetails[card.id] && (
                <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/30 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Card Number</label>
                      <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2">
                        <span className="font-mono text-sm">{card.cardNumber}</span>
                        <button 
                          onClick={() => copyToClipboard(card.cardNumber, 'Card number')}
                          className="text-lime-400 hover:text-lime-300 transition-colors"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">CVV</label>
                      <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2">
                        <span className="font-mono text-sm">{card.cvv}</span>
                        <button 
                          onClick={() => copyToClipboard(card.cvv, 'CVV')}
                          className="text-lime-400 hover:text-lime-300 transition-colors"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => toggleCardDetails(card.id)}
                  className="flex-1 bg-gray-700/30 backdrop-blur-sm border border-gray-600/30 text-white py-2 px-4 rounded-lg hover:bg-gray-700/50 transition-all duration-300 flex items-center justify-center"
                >
                  {showCardDetails[card.id] ? <EyeOff size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
                  {showCardDetails[card.id] ? 'Hide' : 'Show'} Details
                </button>
                
                <button 
                  onClick={() => {
                    setSelectedCard(card);
                    setShowFundModal(true);
                  }}
                  className="bg-lime-400/20 backdrop-blur-sm border border-lime-400/30 text-lime-400 p-2 rounded-lg hover:bg-lime-400/30 transition-all duration-300"
                  title="Fund Card"
                >
                  <DollarSign size={16} />
                </button>
                
                <button className="bg-gray-700/30 backdrop-blur-sm border border-gray-600/30 text-white p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-300">
                  {card.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                </button>
                
                <button 
                  onClick={() => {
                    setSelectedCard(card);
                    setShowDeleteModal(true);
                  }}
                  className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 p-2 rounded-lg hover:bg-red-500/30 transition-all duration-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800/20 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-lime-400/20 backdrop-blur-sm border border-lime-400/30 text-lime-400 py-4 px-6 rounded-xl hover:bg-lime-400/30 transition-all duration-300 flex items-center justify-center"
            >
              <Plus size={20} className="mr-2" />
              Create New Card
            </button>
            <button className="bg-gray-700/30 backdrop-blur-sm border border-gray-600/30 text-white py-4 px-6 rounded-xl hover:bg-gray-700/50 transition-all duration-300 flex items-center justify-center">
              <Settings size={20} className="mr-2" />
              Card Settings
            </button>
            <button className="bg-gray-700/30 backdrop-blur-sm border border-gray-600/30 text-white py-4 px-6 rounded-xl hover:bg-gray-700/50 transition-all duration-300 flex items-center justify-center">
              <Eye size={20} className="mr-2" />
              Transaction History
            </button>
          </div>
        </div>
      </div>

      {/* Create Card Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-md relative border border-gray-700/50 shadow-2xl">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-lime-400/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="text-lime-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Create New Card</h3>
              <p className="text-gray-400">Create a new virtual card for your transactions</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Card Name</label>
                <input
                  type="text"
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  placeholder="Enter card name"
                  className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Card Type</label>
                <select className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400">
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 text-white py-3 rounded-lg hover:bg-gray-700/70 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCard}
                className="flex-1 bg-lime-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-lime-300 transition-all duration-300"
              >
                Create Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fund Card Modal */}
      {showFundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-md relative border border-gray-700/50 shadow-2xl">
            <button 
              onClick={() => setShowFundModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-lime-400/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-lime-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Fund Card</h3>
              <p className="text-gray-400">Add funds to {selectedCard?.name}</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount (USD)</label>
                <input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>
              <div className="bg-gray-700/30 backdrop-blur-sm rounded-lg p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current Balance:</span>
                  <span className="text-white">${selectedCard?.balance}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFundModal(false)}
                className="flex-1 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 text-white py-3 rounded-lg hover:bg-gray-700/70 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleFundCard}
                className="flex-1 bg-lime-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-lime-300 transition-all duration-300"
              >
                Fund Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Card Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-md relative border border-gray-700/50 shadow-2xl">
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Delete Card</h3>
              <p className="text-gray-400">Are you sure you want to delete {selectedCard?.name}? This action cannot be undone.</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 text-white py-3 rounded-lg hover:bg-gray-700/70 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCard}
                className="flex-1 bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition-all duration-300"
              >
                Delete Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-md relative border border-gray-700/50 shadow-2xl">
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-lime-400/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-lime-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
              <p className="text-gray-400 mb-6">Your action has been completed successfully.</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-lime-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-lime-300 transition-all duration-300"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualCards;