import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AuthCallback from './AuthCallback';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
       
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setUser(null);
          setLoading(false);
          return;
        }

       
        const res = await fetch('http://localhost:5000/api/protected', {
          credentials: 'include',
        });

        if (!res.ok) {
          setUser(null);
        } else {
          setUser(data.session.user);
        }
      } catch (err) {
        console.error('Session validation error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }

      
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });

      return () => listener.subscription.unsubscribe();
    };

    checkSession();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />

      
        <Route path="/auth/callback" element={<AuthCallback />} />

       
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
    

       
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
