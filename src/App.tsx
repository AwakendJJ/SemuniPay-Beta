import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import ConnectWallet from './pages/ConnectWallet';
import VirtualCards from './pages/VirtualCards';
import MaintenanceOverlay from './components/MaintenanceOverlay';
import { MAINTENANCE_MODE_ENABLED } from './config';

function App() {
  return (
    <>
      {MAINTENANCE_MODE_ENABLED && <MaintenanceOverlay />}
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* <Route path="/connect" element={<ConnectWallet />} /> */}
          {/* <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/virtual-cards" element={<VirtualCards />} /> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;