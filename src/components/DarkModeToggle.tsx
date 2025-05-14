// src/components/DarkModeToggle.tsx
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

interface DarkModeToggleProps {
  className?: string;
}

const ToggleButton = styled(motion.button)`
  background-color: ${({ theme }) => theme.colors.primaryDark};
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

// Sun icon for light mode
const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Moon icon for dark mode
const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const DarkModeToggle = ({ className }: DarkModeToggleProps) => {
  const { themeMode, toggleTheme } = useTheme();
  
  return (
    <ToggleButton
      className={className}
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      title={themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-label={themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {themeMode === 'light' ? <MoonIcon /> : <SunIcon />}
    </ToggleButton>
  );
};

export default DarkModeToggle;