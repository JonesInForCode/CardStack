// src/components/Card/TaskCard.tsx
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { type Task, type Priority, type Category } from '../../types/Task';

interface TaskCardProps {
  task: Task;
  taskCount: number;
  onComplete: () => void;
  onDismiss: () => void;
  onSnooze: (hours: number) => void;
}

// Get color for priority level
const getPriorityColors = (priority: Priority) => {
  switch (priority) {
    case 'high':
      return { bg: '#FEE2E2', border: '#EF4444', text: '#B91C1C' };
    case 'medium':
      return { bg: '#FEF3C7', border: '#F59E0B', text: '#B45309' };
    case 'low':
      return { bg: '#D1FAE5', border: '#10B981', text: '#047857' };
    default:
      return { bg: '#E0E7FF', border: '#6366F1', text: '#4338CA' };
  }
};

// Get emoji for category
const getCategoryEmoji = (category: Category): string => {
  switch (category) {
    case 'work':
      return '💼';
    case 'personal':
      return '🏠';
    case 'errands':
      return '🛒';
    case 'other':
      return '📌';
    default:
      return '📝';
  }
};

// Styled components
const CardWrapper = styled.div`
  width: 100%;
  max-width: 400px; // Added max-width constraint
  margin: 0 auto;
`;

const CardContainer = styled(motion.div)<{ priority: Priority }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.large};
  border-top: 8px solid ${({ priority }) => getPriorityColors(priority).border};
  background-color: ${({ priority }) => getPriorityColors(priority).bg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CategoryEmoji = styled.span`
  font-size: 2rem;
`;

const PriorityLabel = styled.span<{ priority: Priority }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ priority }) => getPriorityColors(priority).text};
`;

const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CardDescription = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DueDate = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
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
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const DismissButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: #E5E7EB;
  color: #4B5563;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const SnoozeButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const SnoozeButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: #F3F4F6;
  color: #4B5563;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const TaskCount = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const TaskCard = ({ 
  task, 
  taskCount, 
  onComplete, 
  onDismiss, 
  onSnooze 
}: TaskCardProps) => {
  return (
    <CardWrapper>
      <CardContainer
        priority={task.priority}
        key={task.id}
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <CardHeader>
          <CategoryEmoji>{getCategoryEmoji(task.category)}</CategoryEmoji>
          <PriorityLabel priority={task.priority}>
            {task.priority} priority
          </PriorityLabel>
        </CardHeader>
        
        <CardTitle>{task.title}</CardTitle>
        <CardDescription>{task.description}</CardDescription>
        
        {task.dueDate && (
          <DueDate>
            Due: {task.dueDate.toLocaleDateString()}
          </DueDate>
        )}
        
        <ActionButtonsGrid>
          <CompleteButton
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
          >
            Complete
          </CompleteButton>
          <DismissButton
            whileTap={{ scale: 0.95 }}
            onClick={onDismiss}
          >
            Dismiss
          </DismissButton>
        </ActionButtonsGrid>
        
        <SnoozeButtonsGrid>
          <SnoozeButton
            whileTap={{ scale: 0.95 }}
            onClick={() => onSnooze(1)}
          >
            +1 hour
          </SnoozeButton>
          <SnoozeButton
            whileTap={{ scale: 0.95 }}
            onClick={() => onSnooze(3)}
          >
            +3 hours
          </SnoozeButton>
          <SnoozeButton
            whileTap={{ scale: 0.95 }}
            onClick={() => onSnooze(24)}
          >
            Tomorrow
          </SnoozeButton>
        </SnoozeButtonsGrid>
        
        <TaskCount>
          {taskCount} task{taskCount !== 1 ? 's' : ''} in your stack
        </TaskCount>
      </CardContainer>
    </CardWrapper>
  );
};

export default TaskCard;