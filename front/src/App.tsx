// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/login';
import RegisterPage from './components/register';
import ResetPasswordPage from './components/reset_passw';

const NotFoundPage: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center', color: '#585C87' }}>
    <h1>404</h1>
    <p>Страница не найдена</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset_passw" element={<ResetPasswordPage />} />
        <Route path="*" element={<NotFoundPage />} /> {/* 404 */}
      </Routes>
    </Router>
  );
};

export default App;
