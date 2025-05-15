// src/components/Modals/BreakModal.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface BreakModalProps {
  onBreakComplete: () => void;
  onSkipBreak: () => void;
}

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  z-index: ${({ theme }) => theme.zIndices.modal};
`;

const ModalContent = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const BreakMessage = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TimerDisplay = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.primary};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
`;

const BreakCompleteButton = styled(motion.button)<{ disabled: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme, disabled }) => 
    disabled ? theme.colors.textSecondary : theme.colors.success};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const SkipBreakButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const BreakModal = ({ onBreakComplete, onSkipBreak }: BreakModalProps) => {
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(5 * 60); // 5 minutes in seconds
  const [breakComplete, setBreakComplete] = useState(false);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setBreakTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          setBreakComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  // Format time as MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ModalContent
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <ModalTitle>Time for a Break!</ModalTitle>
        <BreakMessage>
          Great job on your focused work session! Take a 5-minute break to rest your mind.
        </BreakMessage>
        
        <TimerDisplay>
          {formatTime(breakTimeRemaining)}
        </TimerDisplay>
        
        <ButtonContainer>
          <BreakCompleteButton
            whileTap={breakComplete ? { scale: 0.95 } : {}}
            onClick={breakComplete ? onBreakComplete : undefined}
            disabled={!breakComplete}
          >
            Break Complete
          </BreakCompleteButton>
          <SkipBreakButton
            whileTap={{ scale: 0.95 }}
            onClick={onSkipBreak}
          >
            Skip Break
          </SkipBreakButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default BreakModal;