import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { registerServiceWorker } from './registerSW';
import { initSentry } from './lib/sentry';

// Sentry : chargé en différé, seulement si VITE_SENTRY_DSN est configuré
initSentry();

// Enregistre le service worker (PWA offline) — prod uniquement
registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
