import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Remove loading skeleton once React is ready to prevent CLS
const removeLoadingSkeleton = () => {
  const skeleton = document.querySelector('.loading-skeleton');
  if (skeleton) {
    skeleton.remove();
  }
};

// Initialize app with performance monitoring
const initApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  // Clear any existing content (skeletons)
  rootElement.innerHTML = '';
  
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  // Remove skeleton after React has mounted
  setTimeout(removeLoadingSkeleton, 100);
};

// Use requestIdleCallback for non-blocking initialization
if ('requestIdleCallback' in window) {
  requestIdleCallback(initApp, { timeout: 1000 });
} else {
  // Fallback for browsers that don't support requestIdleCallback
  setTimeout(initApp, 0);
}
