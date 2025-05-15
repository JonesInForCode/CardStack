// src/components/PomodoroTimer/PomodoroTimer.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

interface PomodoroTimerProps {
  isRunning: boolean;
  onTimerComplete: () => void;
  endTime: number | null; // New prop for external time management
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

const PomodoroTimer = ({ isRunning, onTimerComplete, endTime }: PomodoroTimerProps) => {
  // Display time (in seconds)
  const [displayTimeRemaining, setDisplayTimeRemaining] = useState(25 * 60);
  // Reference to the interval ID for cleanup
  const intervalRef = useRef<number | null>(null);
  // Store if timer has completed to prevent multiple triggers
  const hasCompletedRef = useRef(false);

  // Function to calculate and update the time remaining
  const updateTimeRemaining = useCallback(() => {
    if (!endTime) return;
    
    const now = Date.now();
    const remaining = Math.max(0, endTime - now);
    const remainingSeconds = Math.ceil(remaining / 1000);
    
    setDisplayTimeRemaining(remainingSeconds);
    
    // If time's up and we haven't triggered completion yet
    if (remaining <= 0 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      onTimerComplete();
      clearInterval(intervalRef.current || undefined);
      intervalRef.current = null;
    }
  }, [endTime, onTimerComplete]);

  // Reset completion flag when endTime changes
  useEffect(() => {
    hasCompletedRef.current = false;
  }, [endTime]);

  // Set up an interval to update the display
  useEffect(() => {
    if (endTime && isRunning) {
      // Immediately update once
      updateTimeRemaining();
      
      // Then set up the interval for updates
      intervalRef.current = window.setInterval(updateTimeRemaining, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [endTime, isRunning, updateTimeRemaining]);

  // Add event listeners for when the app regains focus or visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && endTime) {
        updateTimeRemaining();
      }
    };

    const handleFocus = () => {
      if (endTime) {
        updateTimeRemaining();
      }
    };

    // Listen for visibility and focus events
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [endTime, updateTimeRemaining]);

  // Format time as MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <TimerContainer>
      <TimerIcon>⏱️</TimerIcon>
      {formatTime(displayTimeRemaining)}
    </TimerContainer>
  );
};

export default PomodoroTimer;