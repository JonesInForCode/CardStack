// src/components/Drawers/SnoozedTasksDrawer.tsx
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { type Task } from '../../types/Task';

interface SnoozedTasksDrawerProps {
  snoozedTasks: Task[];
  onClose: () => void;
  onUnsnoozeTasks: (taskId: string) => void; // Callback to restore a snoozed task
}

// Format the snooze until time in a user-friendly way
const formatSnoozeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
  }
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return 'tomorrow';
  }
  
  return `${diffDays} days`;
};

// Styled components
const DrawerContainer = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-top-left-radius: ${({ theme }) => theme.borderRadius.xl};
  border-top-right-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.large};
  padding: ${({ theme }) => theme.spacing.md};
  z-index: ${({ theme }) => theme.zIndices.modal};
  max-height: 70vh;
  overflow-y: auto;
  
  /* iOS safe area support */
  padding-bottom: calc(${({ theme }) => theme.spacing.md} + env(safe-area-inset-bottom, 0));
`;

const DrawerTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing.md};
`;

const TasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TaskItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TaskInfo = styled.div``;

const TaskTitle = styled.h3`
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TaskSnoozeTime = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const UnsnoozeBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: white;
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  padding: 4px 8px;
  border-radius: 12px;
`;

const ButtonWrapper = styled.div`
  position: relative;
`;

const UnsnoozeButton = styled(motion.button)`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  background-color: ${({ theme }) => theme.colors.primaryDark};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const CloseButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const CloseButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.primaryDark};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const SnoozedTasksDrawer = ({ 
  snoozedTasks, 
  onClose, 
  onUnsnoozeTasks 
}: SnoozedTasksDrawerProps) => {
  // Sort tasks by snoozedUntil time (closest first)
  const sortedTasks = [...snoozedTasks].sort((a, b) => {
    if (!a.snoozedUntil) return 1;
    if (!b.snoozedUntil) return -1;
    return a.snoozedUntil.getTime() - b.snoozedUntil.getTime();
  });

  return (
    <DrawerContainer
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <DrawerTitle>Snoozed Tasks</DrawerTitle>
      
      {sortedTasks.length === 0 ? (
        <EmptyMessage>No snoozed tasks</EmptyMessage>
      ) : (
        <TasksContainer>
          {sortedTasks.map(task => (
            <TaskItem key={task.id}>
              <TaskInfo>
                <TaskTitle>{task.title}</TaskTitle>
                <TaskSnoozeTime>
                  Returns in: {task.snoozedUntil ? formatSnoozeTime(task.snoozedUntil) : 'Unknown'}
                </TaskSnoozeTime>
              </TaskInfo>
              <ButtonWrapper>
                <UnsnoozeButton
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onUnsnoozeTasks(task.id)}
                >
                  Unsnooze
                </UnsnoozeButton>
                <UnsnoozeBadge>Now</UnsnoozeBadge>
              </ButtonWrapper>
            </TaskItem>
          ))}
        </TasksContainer>
      )}
      
      <CloseButtonContainer>
        <CloseButton
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
        >
          Close
        </CloseButton>
      </CloseButtonContainer>
    </DrawerContainer>
  );
};

export default SnoozedTasksDrawer;