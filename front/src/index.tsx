import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 💡 Убираем отступы по умолчанию у body и html
Object.assign(document.body.style, {
  margin: '0',
  padding: '0',
  height: '100%',
});

Object.assign(document.documentElement.style, {
  margin: '0',
  padding: '0',
  height: '100%',
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
