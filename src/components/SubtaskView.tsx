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
  onAddSubtask: () => void;
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
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.85;
  }
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
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

const SubtaskContentWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
`;

const NavigationArea = styled(motion.div)<{ position: 'top' | 'bottom' }>`
  position: absolute;
  left: 0;
  right: 0;
  height: 80px;
  ${({ position }) => position === 'top' ? 'top: -60px;' : 'bottom: -60px;'}
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
`;

const NavigationButton = styled(motion.div)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  font-size: 1.5rem;
`;

const AddSubtaskButton = styled(motion.button)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  font-size: 1.5rem;
  border: 2px solid ${({ theme }) => theme.colors.cardBackground};
`;

const FutureNestButton = styled(motion.div)`
  position: absolute;
  right: -60px;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.background};
  border: 2px dashed ${({ theme }) => theme.colors.textSecondary};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  opacity: 0.5;
  cursor: not-allowed;
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
  onClose,
  onAddSubtask
}: SubtaskViewProps) => {
  const [currentSubtaskIndex, setCurrentSubtaskIndex] = useState(0);
  const [showTopNav, setShowTopNav] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(false);
  
  // Get active subtasks (not completed or cancelled)
  const activeSubtasks = subtasks.filter(st => !st.isCompleted);
  const currentSubtask = activeSubtasks[currentSubtaskIndex];
  
  const hasPrevious = currentSubtaskIndex > 0;
  const hasNext = currentSubtaskIndex < activeSubtasks.length - 1;

  const handleSubtaskComplete = () => {
    if (currentSubtask) {
      onSubtaskComplete(currentSubtask.id);
      // Stay at same index if possible, otherwise go to previous
      if (currentSubtaskIndex >= activeSubtasks.length - 1 && currentSubtaskIndex > 0) {
        setCurrentSubtaskIndex(currentSubtaskIndex - 1);
      }
    }
  };

  const handleSubtaskCancel = () => {
    if (currentSubtask) {
      onSubtaskCancel(currentSubtask.id);
      // Stay at same index if possible, otherwise go to previous
      if (currentSubtaskIndex >= activeSubtasks.length - 1 && currentSubtaskIndex > 0) {
        setCurrentSubtaskIndex(currentSubtaskIndex - 1);
      }
    }
  };

  const handleUpgrade = () => {
    if (currentSubtask) {
      onUpgradeToTask(currentSubtask.id);
    }
  };

  const navigateToPrevious = () => {
    if (hasPrevious) {
      setCurrentSubtaskIndex(currentSubtaskIndex - 1);
    }
  };

  const navigateToNext = () => {
    if (hasNext) {
      setCurrentSubtaskIndex(currentSubtaskIndex + 1);
    }
  };

  return (
    <ViewContainer>
      <ParentCardContainer
        initial={{ x: 0, opacity: 1, scale: 1 }}
        animate={{ x: -20, opacity: 0.7, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={onClose}
        whileTap={{ scale: 0.85 }}
      >
        <ParentCard>
          <ParentTitle>{parentTask.title}</ParentTitle>
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            {activeSubtasks.length} subtask{activeSubtasks.length !== 1 ? 's' : ''} remaining
          </p>
        </ParentCard>
      </ParentCardContainer>

      <SubtaskContainer>
        <SubtaskContentWrapper>
          {/* Top navigation or add button */}
          <NavigationArea
            position="top"
            onMouseEnter={() => setShowTopNav(true)}
            onMouseLeave={() => setShowTopNav(false)}
          >
            <AnimatePresence>
              {showTopNav && (
                <>
                  {hasPrevious ? (
                    <NavigationButton
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={navigateToPrevious}
                    >
                      ↑
                    </NavigationButton>
                  ) : (
                    <AddSubtaskButton
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onAddSubtask}
                      title="Add subtask above"
                    >
                      +
                    </AddSubtaskButton>
                  )}
                </>
              )}
            </AnimatePresence>
          </NavigationArea>

          <AnimatePresence mode="wait">
            {currentSubtask ? (
              <div style={{ position: 'relative' }}>
                <SubtaskCard
                  key={currentSubtask.id}
                  subtask={currentSubtask}
                  onComplete={handleSubtaskComplete}
                  onCancel={handleSubtaskCancel}
                  onUpgradeToTask={handleUpgrade}
                  subtaskCount={activeSubtasks.length}
                  currentIndex={currentSubtaskIndex}
                />
                
                {/* Future nest button (non-functional for now) */}
                <FutureNestButton
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.5 }}
                  title="Nested subtasks coming soon"
                >
                  →
                </FutureNestButton>
              </div>
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

          {/* Bottom navigation or add button */}
          <NavigationArea
            position="bottom"
            onMouseEnter={() => setShowBottomNav(true)}
            onMouseLeave={() => setShowBottomNav(false)}
          >
            <AnimatePresence>
              {showBottomNav && (
                <>
                  {hasNext ? (
                    <NavigationButton
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={navigateToNext}
                    >
                      ↓
                    </NavigationButton>
                  ) : (
                    <AddSubtaskButton
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onAddSubtask}
                      title="Add subtask below"
                    >
                      +
                    </AddSubtaskButton>
                  )}
                </>
              )}
            </AnimatePresence>
          </NavigationArea>
        </SubtaskContentWrapper>
      </SubtaskContainer>
    </ViewContainer>
  );
};

export default SubtaskView;