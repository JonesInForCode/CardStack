// src/components/Header/Header.tsx with proper styled-components
import { motion } from 'framer-motion';
import styled from 'styled-components';
import DarkModeToggle from '../DarkModeToggle';

interface HeaderProps {
  onShuffle: () => void;
  taskCount: number;
  simplifyMode: boolean;
  onToggleSimplifyMode: () => void;
}

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.textPrimary};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const TitleContainer = styled.div`
  text-align: center;
  flex: 1;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ShuffleButton = styled(motion.button)`
  background-color: ${({ theme }) => theme.colors.primaryDark};
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.small};
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SimplifyButton = styled(motion.button)<{ active: boolean }>`
  background-color: ${({ theme, active }) => 
    active ? theme.colors.success : theme.colors.primaryDark};
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

// Shuffle icon using SVG for better control
const ShuffleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M21 16V20H17M21 8V4H17M3 4L7 8M16 20L7 11M16 4L3 17" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Simplify icon using SVG
const SimplifyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M4 8H20M4 16H20" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const Header = ({ 
  onShuffle, 
  taskCount, 
  simplifyMode, 
  onToggleSimplifyMode 
}: HeaderProps) => {
  return (
    <HeaderContainer>
      <TitleContainer>
        <Title>CardStack</Title>
        <Subtitle>Focus on one task at a time</Subtitle>
      </TitleContainer>
      <ButtonContainer>
        <DarkModeToggle />
        <SimplifyButton
          whileTap={{ scale: 0.9 }}
          onClick={onToggleSimplifyMode}
          title={simplifyMode ? "Show priorities" : "Simplify view"}
          aria-label={simplifyMode ? "Show priorities" : "Simplify view"}
          active={simplifyMode}
        >
          <SimplifyIcon />
        </SimplifyButton>
        <ShuffleButton
          whileTap={{ scale: 0.9, rotate: 180 }}
          onClick={onShuffle}
          disabled={taskCount <= 1}
          title="Shuffle deck"
          aria-label="Shuffle task deck"
          transition={{ duration: 0.3 }}
        >
          <ShuffleIcon />
        </ShuffleButton>
      </ButtonContainer>
    </HeaderContainer>
  );
};

export default Header;