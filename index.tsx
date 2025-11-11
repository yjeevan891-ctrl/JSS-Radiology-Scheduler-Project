import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Assuming a global CSS file with Tailwind directives exists
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
