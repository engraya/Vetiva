import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/index.css';
import { App } from '@/app/app';
import { enableMocking } from '@/mocks/browser';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

// The mock API is part of the demo product — always on.
void enableMocking().then(() => {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
