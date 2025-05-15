// src/styles/global.ts
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    transition: background-color 0.3s ease, color 0.3s ease;
    user-select: none; /* Disable text selection globally */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  
  html, body {
    height: 100%;
  }
  
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    overscroll-behavior: none;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
    touch-action: manipulation; /* Improves touch behavior */
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Fix iOS safe areas */
  @supports (padding: max(0px)) {
    body {
      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }
  }
  
  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
    transition: all 0.15s ease; /* Slightly faster transition */
    position: relative;
    overflow: hidden;
    
    &:hover:not(:disabled) {
      filter: brightness(1.1); /* More noticeable brightness increase */
      transform: translateY(-2px); /* Slight lift effect */
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* Shadow on hover */
    }
    
    &:active:not(:disabled) {
      filter: brightness(0.9); /* More noticeable darkening */
      transform: translateY(1px); /* Pressed down effect */
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* Smaller shadow when pressed */
    }
    
    &:focus-visible {
      outline: 2px solid rgba(99, 102, 241, 0.6);
      outline-offset: 2px;
    }
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
    
    /* Create a ripple effect for touch/click feedback */
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.4) 10%, transparent 70%);
      background-repeat: no-repeat;
      background-position: 50%;
      transform: scale(10, 10);
      opacity: 0;
      transition: transform 0.3s, opacity 0.3s;
    }
    
    &:active::after {
      transform: scale(0, 0);
      opacity: 0.3;
      transition: 0s;
    }
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
  
  input, textarea, select {
    font-family: inherit;
    user-select: text; /* Keep inputs selectable */
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
  }
`;

export default GlobalStyle;