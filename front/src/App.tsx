// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import ResetPasswordPage from './pages/reset_passw';
import FirstPage from './pages/first_page';
import ProfilePage from './pages/profile';
import ChangePasswordPage from './pages/change_password';
import FirstMonthPage from './pages/first_month';

const NotFoundPage: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center', color: '#585C87' }}>
    <h1>404</h1>
    <p>Страница не найдена</p>
  </div>
);

const GamePage: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center', color: '#585C87' }}>
    <h1>Игра</h1>
    <p>Страница игры в разработке</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset_passw" element={<ResetPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/change_password" element={<ChangePasswordPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/first-month" element={<FirstMonthPage />} />
        <Route path="*" element={<NotFoundPage />} /> {/* 404 */}
      </Routes>
    </Router>
  );
};

export default App;
