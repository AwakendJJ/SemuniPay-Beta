import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import ConnectWallet from './pages/ConnectWallet';
import VirtualCards from './pages/VirtualCards';
import Login from './pages/Login';
import AuthCallback from './AuthCallback';


function App() {
  return (
    
       <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login/>} />
           <Route path="/auth/callback" element={<AuthCallback />} />
          {/* <Route path="/connect" element={<ConnectWallet />} /> */}
          {/* <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/virtual-cards" element={<VirtualCards />} /> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    
  );
}

export default App;