// src/components/Drawers/CompletedTasksDrawer.tsx
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { type Task } from '../../types/Task';

interface CompletedTasksDrawerProps {
  completedTasks: Task[];
  onClose: () => void;
  onReturnToStack: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void; // New prop for delete function
}

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
  color: ${({ theme }) => theme.colors.textPrimary};
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

const TaskInfo = styled.div`
  flex: 1;
`;

const TaskTitle = styled.h3`
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  text-decoration: line-through;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TaskDate = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ReturnButton = styled(motion.button)`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  background-color: ${({ theme }) => theme.colors.primaryDark};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const DeleteButton = styled(motion.button)`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  background-color: ${({ theme }) => theme.colors.danger};
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
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primaryDark};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const CompletedTasksDrawer = ({ 
  completedTasks, 
  onClose, 
  onReturnToStack,
  onDeleteTask
}: CompletedTasksDrawerProps) => {
  return (
    <DrawerContainer
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <DrawerTitle>Completed Tasks</DrawerTitle>
      
      {completedTasks.length === 0 ? (
        <EmptyMessage>No completed tasks yet</EmptyMessage>
      ) : (
        <TasksContainer>
          {completedTasks.map(task => (
            <TaskItem key={task.id}>
              <TaskInfo>
                <TaskTitle>{task.title}</TaskTitle>
                <TaskDate>
                  Completed: {task.completedDate?.toLocaleDateString()}
                </TaskDate>
              </TaskInfo>
              <ActionButtons>
                <DeleteButton
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDeleteTask(task.id)}
                  aria-label={`Delete task ${task.title}`}
                >
                  Delete
                </DeleteButton>
                <ReturnButton
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onReturnToStack(task.id)}
                  aria-label={`Return task ${task.title} to stack`}
                >
                  Return
                </ReturnButton>
              </ActionButtons>
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

export default CompletedTasksDrawer;