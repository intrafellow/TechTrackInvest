import React from 'react';
import Header from './components/header';

const App: React.FC = () => {
  return (
    <div style={{ height: "100vh", margin: 0 }}>
      <Header />
      <div style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        {/* основной контент */}
      </div>
    </div>
  );
};

export default App;
