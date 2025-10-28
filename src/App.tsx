import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AuthCallback from './AuthCallback';
import Loader from './components/Loader'
import useJwtExpiryLogout from './hooks/useSessionTimeout';
import type { User } from '@supabase/supabase-js';

// ⬇️ Split App into two layers so the hook runs inside the Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Now this runs inside the Router context — safe to use `useNavigate`
  useJwtExpiryLogout();

  useEffect(() => {
    // Initialize session on app load
    async function getSession() {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error('Error fetching session:', error);

      setUser(data.session?.user ?? null);
      setLoading(false);
    }

    getSession();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

 if (loading) {
  return (
    <Loader/>
  );
}

  return (
    <Routes>
      {/* Login page */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />

      {/* Magic link callback */}
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected dashboard */}
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
