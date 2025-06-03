// src/components/SubtaskView.tsx
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { type Task } from '../types/Task';
import SubtaskCard from './Card/SubtaskCard';

interface SubtaskViewProps {
  parentTask: Task;
  subtasks: Task[];
  onSubtaskComplete: (subtaskId: string) => void;
  onSubtaskCancel: (subtaskId: string) => void;
  onUpgradeToTask: (subtaskId: string) => void;
  onClose: () => void;
}

const ViewContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  position: relative;
`;

const ParentCardContainer = styled(motion.div)`
  flex: 0 0 30%;
  min-width: 200px;
  opacity: 0.7;
  transform: scale(0.9);
  transform-origin: left center;
`;

const ParentCard = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border-top: 8px solid ${({ theme }) => theme.colors.primary};
`;

const ParentTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SubtaskContainer = styled.div`
  flex: 1;
  position: relative;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.primaryDark};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CompleteMainButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.success};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  width: 100%;
`;

const SubtaskView = ({
  parentTask,
  subtasks,
  onSubtaskComplete,
  onSubtaskCancel,
  onUpgradeToTask,
  onClose
}: SubtaskViewProps) => {
  const [currentSubtaskIndex, setCurrentSubtaskIndex] = useState(0);
  
  // Get active subtasks (not completed or cancelled)
  const activeSubtasks = subtasks.filter(st => !st.isCompleted);
  const currentSubtask = activeSubtasks[currentSubtaskIndex];

  const handleSubtaskComplete = () => {
    if (currentSubtask) {
      onSubtaskComplete(currentSubtask.id);
      // Move to next subtask or close if none left
      if (currentSubtaskIndex >= activeSubtasks.length - 1) {
        setCurrentSubtaskIndex(0);
      }
    }
  };

  const handleSubtaskCancel = () => {
    if (currentSubtask) {
      onSubtaskCancel(currentSubtask.id);
      // Move to next subtask or close if none left
      if (currentSubtaskIndex >= activeSubtasks.length - 1) {
        setCurrentSubtaskIndex(0);
      }
    }
  };

  const handleUpgrade = () => {
    if (currentSubtask) {
      onUpgradeToTask(currentSubtask.id);
    }
  };

  return (
    <ViewContainer>
      <ParentCardContainer
        initial={{ x: 0, opacity: 1, scale: 1 }}
        animate={{ x: -20, opacity: 0.7, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <ParentCard>
          <ParentTitle>{parentTask.title}</ParentTitle>
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            {activeSubtasks.length} subtask{activeSubtasks.length !== 1 ? 's' : ''} remaining
          </p>
        </ParentCard>
      </ParentCardContainer>

      <SubtaskContainer>
        <CloseButton
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
        >
          ✕
        </CloseButton>

        <AnimatePresence mode="wait">
          {currentSubtask ? (
            <SubtaskCard
              key={currentSubtask.id}
              subtask={currentSubtask}
              onComplete={handleSubtaskComplete}
              onCancel={handleSubtaskCancel}
              onUpgradeToTask={handleUpgrade}
              subtaskCount={activeSubtasks.length}
              currentIndex={currentSubtaskIndex}
            />
          ) : (
            <EmptyState>
              <EmptyStateText>All subtasks completed!</EmptyStateText>
              <CompleteMainButton
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
              >
                Back to main task
              </CompleteMainButton>
            </EmptyState>
          )}
        </AnimatePresence>
      </SubtaskContainer>
    </ViewContainer>
  );
};

export default SubtaskView;