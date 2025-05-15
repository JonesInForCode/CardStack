// src/main.tsx - Updated to register the service worker and handle PWA updates
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ErrorBoundary from './components/ErrorBoundary'
import App from './App.tsx'
import GlobalStyle from './styles/global'
import { ThemeProvider } from './context/ThemeContext'
import { registerServiceWorker } from './registerServiceWorker'

// Register service worker for PWA functionality
registerServiceWorker();

// Handle automatic refreshes from the service worker
let refreshing = false;
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    console.log('Service worker controller changed, refreshing page...');
    window.location.reload();
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <GlobalStyle />
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>,
)