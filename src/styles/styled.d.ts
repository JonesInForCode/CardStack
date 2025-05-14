// src/styles/styled.d.ts
import 'styled-components';

// Extend the DefaultTheme interface
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryLight: string;
      primaryDark: string;
      background: string;
      cardBackground: string;
      textPrimary: string;
      textSecondary: string;
      highPriority: string;
      mediumPriority: string;
      lowPriority: string;
      success: string;
      danger: string;
      warning: string;
      info: string;
    };
    
    borderRadius: {
      small: string;
      medium: string;
      large: string;
      xl: string;
    };
    
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    
    shadows: {
      small: string;
      medium: string;
      large: string;
      xl: string;
    };
    
    typography: {
      fontFamily: string;
      fontSizes: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
        xxxl: string;
      };
      fontWeights: {
        normal: number;
        medium: number;
        semibold: number;
        bold: number;
      };
    };
    
    transitions: {
      default: string;
      fast: string;
      slow: string;
    };
    
    zIndices: {
      base: number;
      card: number;
      modal: number;
      splash: number;
    };
  }
}