// src/components/Card/SubtaskCard.tsx
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { type Task } from '../../types/Task';

interface SubtaskCardProps {
  subtask: Task;
  onComplete: () => void;
  onCancel: () => void;
  onUpgradeToTask: () => void;
  subtaskCount: number;
  currentIndex: number;
}

// Styled components - similar to TaskCard but with visual differences
const CardContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.cardBackground};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SubtaskIndicator = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`;

const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const CardDescription = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ActionButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const CompleteButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const CancelButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.danger};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const UpgradeButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  margin-top: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`;

const SubtaskCount = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const SubtaskCard = ({ 
  subtask, 
  onComplete, 
  onCancel, 
  onUpgradeToTask,
  subtaskCount,
  currentIndex
}: SubtaskCardProps) => {
  return (
    <CardContainer
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <SubtaskIndicator>Subtask</SubtaskIndicator>
      
      <CardTitle>{subtask.title}</CardTitle>
      {subtask.description && <CardDescription>{subtask.description}</CardDescription>}

      <ActionButtonsGrid>
        <CompleteButton
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
        >
          Complete
        </CompleteButton>
        <CancelButton
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
        >
          Cancel
        </CancelButton>
      </ActionButtonsGrid>
      
      <UpgradeButton
        whileTap={{ scale: 0.95 }}
        onClick={onUpgradeToTask}
      >
        Upgrade to main task
      </UpgradeButton>
      
      <SubtaskCount>
        Subtask {currentIndex + 1} of {subtaskCount}
      </SubtaskCount>
    </CardContainer>
  );
};

export default SubtaskCard;