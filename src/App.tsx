import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi';
import { config } from './config'
import { ConnectKitProvider, getDefaultConfig } from "connectkit";


import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import ConnectWallet from './pages/ConnectWallet';
import VirtualCards from './pages/VirtualCards';
const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
     <QueryClientProvider client={queryClient}>
      <ConnectKitProvider>
       <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/connect" element={<ConnectWallet />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/virtual-cards" element={<VirtualCards />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </ConnectKitProvider>
     </QueryClientProvider>
     
    </WagmiProvider>
  );
}

export default App;