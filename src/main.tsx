// src/main.tsx - Remove Tailwind imports and update for styled-components only
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import ErrorBoundary from './components/ErrorBoundary'
import App from './App.tsx'
import theme from './styles/theme'
import GlobalStyle from './styles/global'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>,
)