// src/main.tsx - Updated to register the service worker
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ErrorBoundary from './components/ErrorBoundary'
import App from './App.tsx'
import GlobalStyle from './styles/global'
import { ThemeProvider } from './context/ThemeContext'
import { registerServiceWorker } from './registerServiceWorker'

// Register service worker for PWA functionality
registerServiceWorker();

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