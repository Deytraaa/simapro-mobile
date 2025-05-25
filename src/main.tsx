import React from 'react';
import { createRoot } from 'react-dom/client';
import Tabs from './App';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Tabs />
    </React.StrictMode>
  );
} else {
  console.error('Root container not found');
}
