import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, signOutUser } from './services/firebase';
import Sidebar from './components/Sidebar/Sidebar';

import CalculatorPage from './pages/CalculatorPage/CalculatorPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage user={user} />} />
            <Route path="/calculator" element={<CalculatorPage user={user} />} />
            <Route path="/history" element={<div className="page-container">История (раздел в разработке)</div>} />
            <Route path="/charts" element={<div className="page-container">Графики (раздел в разработке)</div>} />
            <Route path="/finance" element={<div className="page-container">Финансы (раздел в разработке)</div>} />
            <Route path="/settings" element={<div className="page-container">Настройки (раздел в разработке)</div>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
