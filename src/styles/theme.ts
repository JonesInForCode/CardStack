// src/styles/theme.ts - Define app theme colors and values
const lightTheme = {
  colors: {
    primary: '#4F46E5', // indigo-600
    primaryLight: '#818CF8', // indigo-400
    primaryDark: '#4338CA', // indigo-700
    background: '#F3F4F6', // gray-100
    cardBackground: '#FFFFFF',
    textPrimary: '#111827', // gray-900
    textSecondary: '#6B7280', // gray-500
    
    // Priority colors
    highPriority: '#EF4444', // red-500
    mediumPriority: '#F59E0B', // amber-500
    lowPriority: '#10B981', // emerald-500
    
    // UI colors
    success: '#10B981', // emerald-500
    danger: '#EF4444', // red-500
    warning: '#F59E0B', // amber-500
    info: '#3B82F6', // blue-500
  },
  
  borderRadius: {
    small: '0.375rem', // 6px
    medium: '0.5rem', // 8px
    large: '0.75rem', // 12px
    xl: '1rem', // 16px
  },
  
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    xxl: '2.5rem', // 40px
  },
  
  shadows: {
    small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  typography: {
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif`,
    fontSizes: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      md: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      xxl: '1.5rem', // 24px
      xxxl: '2rem', // 32px
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  transitions: {
    default: '0.3s ease',
    fast: '0.15s ease',
    slow: '0.5s ease',
  },
  
  zIndices: {
    base: 0,
    card: 10,
    modal: 50,
    splash: 100,
  },
};

// Dark theme variant with adjusted colors for better visibility and reduced eye strain
const darkTheme = {
  ...lightTheme,
  colors: {
    primary: '#6366F1', // Slightly lighter indigo for better contrast
    primaryLight: '#818CF8', 
    primaryDark: '#4F46E5',
    background: '#111827', // Dark gray/blue background
    cardBackground: '#1F2937', // Darker card background
    textPrimary: '#F9FAFB', // Very light gray for main text
    textSecondary: '#D1D5DB', // Light gray for secondary text
    
    // Priority colors - slightly muted for dark mode
    highPriority: '#F87171', // Lighter red
    mediumPriority: '#FBBF24', // Lighter amber
    lowPriority: '#34D399', // Lighter emerald
    
    // UI colors
    success: '#34D399', // Lighter emerald
    danger: '#F87171', // Lighter red
    warning: '#FBBF24', // Lighter amber
    info: '#60A5FA', // Lighter blue
  },
  
  shadows: {
    small: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.16)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.14)',
  },
};

export { lightTheme, darkTheme };
export default lightTheme; // Export light theme as default for backwards compatibility