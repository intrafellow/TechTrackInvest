import React from 'react';
import Header from './components/header';
import Sidebar from './components/left_menu';
import Field from './components/field';

const App: React.FC = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', margin: 0 }}>
      <Header />
      <div style={{ flex: 1, display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, backgroundColor: '#444A6B', overflow: 'hidden' }}>
          <Field />
        </div>
      </div>
    </div>
  );
};

export default App;