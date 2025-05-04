import React from 'react';
import { NonExistentDevComponent } from './NonExistentDevComponent'; // Намеренная ошибка для проверки CI/CD

export const DevTestComponent: React.FC = () => {
  return (
    <div>
      <h1>Dev Test Component</h1>
      <NonExistentDevComponent />
    </div>
  );
}; 