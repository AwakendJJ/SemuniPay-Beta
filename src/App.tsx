import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import ConnectWallet from './pages/ConnectWallet';
import VirtualCards from './pages/VirtualCards';

function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/connect" element={<ConnectWallet />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/virtual-cards" element={<VirtualCards />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </WalletProvider>
  );
}

export default App;