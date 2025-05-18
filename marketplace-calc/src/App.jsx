import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, signOutUser } from './services/firebase';
import Sidebar from './components/Sidebar/Sidebar';

// Ленивая загрузка страниц для оптимизации производительности
const CalculatorPage = lazy(() => import('./pages/CalculatorPage/CalculatorPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage/DashboardPage'));

import './App.css';

/**
 * Главный компонент приложения
 * Отвечает за маршрутизацию и аутентификацию
 * @returns {JSX.Element} Компонент приложения
 */
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Отслеживаем состояние аутентификации пользователя
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Отписываемся от слушателя при размонтировании компонента
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
          {/* Используем Suspense для отображения заглушки при ленивой загрузке компонентов */}
          <Suspense fallback={<div className="loading">Загрузка страницы...</div>}>
            <Routes>
              <Route path="/" element={<DashboardPage user={user} />} />
              <Route path="/calculator" element={<CalculatorPage user={user} />} />
              <Route path="/history" element={<div className="page-container">История (раздел в разработке)</div>} />
              <Route path="/charts" element={<div className="page-container">Графики (раздел в разработке)</div>} />
              <Route path="/finance" element={<div className="page-container">Финансы (раздел в разработке)</div>} />
              <Route path="/settings" element={<div className="page-container">Настройки (раздел в разработке)</div>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
