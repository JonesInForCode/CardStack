// src/components/PomodoroTimer/PomodoroTimer.tsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';

interface PomodoroTimerProps {
  isRunning: boolean;
  onTimerComplete: () => void;
}

const TimerContainer = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primaryDark};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  z-index: 5;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const TimerIcon = styled.span`
  margin-right: ${({ theme }) => theme.spacing.xs};
  font-size: 1rem;
`;

const PomodoroTimer = ({ isRunning, onTimerComplete }: PomodoroTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds

  useEffect(() => {
    let timerId: number;

    if (isRunning && timeRemaining > 0) {
      timerId = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerId);
            onTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [isRunning, timeRemaining, onTimerComplete]);

  // Reset timer when it starts running
  useEffect(() => {
    if (isRunning) {
      setTimeRemaining(25 * 60);
    }
  }, [isRunning]);

  // Format time as MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <TimerContainer>
      <TimerIcon>⏱️</TimerIcon>
      {formatTime(timeRemaining)}
    </TimerContainer>
  );
};

export default PomodoroTimer;