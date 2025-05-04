import React from 'react';
// Тестовый компонент для проверки автоматического отката при ошибках
// Этот компонент должен быть автоматически отменен через revert
import { NonExistentDevComponent } from './NonExistentDevComponent'; // Намеренная ошибка для проверки CI/CD

export const DevTestComponent: React.FC = () => {
  return (
    <div>
      <h1>Dev Test Component</h1>
      <NonExistentDevComponent />
    </div>
  );
}; 