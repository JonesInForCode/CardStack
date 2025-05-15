// src/components/PomodoroToggle.tsx
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface PomodoroToggleProps {
  active: boolean;
  onToggle: () => void;
}

const ToggleButton = styled(motion.button)<{ active: boolean }>`
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

// Timer icon SVG
const TimerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12 6V12L16 14" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const PomodoroToggle = ({ active, onToggle }: PomodoroToggleProps) => {
  return (
    <ToggleButton
      whileTap={{ scale: 0.9 }}
      onClick={onToggle}
      active={active}
      title={active ? "Disable Pomodoro Timer" : "Enable Pomodoro Timer"}
      aria-label={active ? "Disable Pomodoro Timer" : "Enable Pomodoro Timer"}
    >
      <TimerIcon />
    </ToggleButton>
  );
};

export default PomodoroToggle;