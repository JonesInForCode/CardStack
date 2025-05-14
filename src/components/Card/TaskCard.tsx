// src/components/Card/TaskCard.tsx - Updated for dark mode compatibility
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { type Task, type Priority, type Category } from '../../types/Task';

interface TaskCardProps {
  task: Task;
  taskCount: number;
  onComplete: () => void;
  onDismiss: () => void;
  onSnooze: (hours: number) => void;
  isShuffling?: boolean;
  simplifyMode?: boolean;
}

// Get color for priority level with dark mode consideration
const getPriorityColors = (priority: Priority, isDark: boolean) => {
  if (isDark) {
    switch (priority) {
      case 'high':
        return { bg: '#7f1d1d', border: '#ef4444', text: '#fca5a5' };
      case 'medium':
        return { bg: '#78350f', border: '#f59e0b', text: '#fcd34d' };
      case 'low':
        return { bg: '#064e3b', border: '#10b981', text: '#6ee7b7' };
      default:
        return { bg: '#1e40af', border: '#3b82f6', text: '#93c5fd' };
    }
  } else {
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
  }
};

// Simplified mode colors
const getLightSimplifiedColors = [
  { bg: '#F0F9FF', border: '#7DD3FC', text: '#0369A1' }, // Light blue
  { bg: '#F0FDF4', border: '#86EFAC', text: '#166534' }, // Light green
  { bg: '#FDF4FF', border: '#D8B4FE', text: '#7E22CE' }, // Light purple
  { bg: '#FFF1F2', border: '#FDA4AF', text: '#BE123C' }, // Light pink
  { bg: '#FFFBEB', border: '#FCD34D', text: '#A16207' }, // Light yellow
  { bg: '#F7FEE7', border: '#BEF264', text: '#3F6212' }, // Light lime
  { bg: '#F0FDFA', border: '#5EEAD4', text: '#0F766E' }, // Light teal
  { bg: '#FEF2F2', border: '#FCA5A5', text: '#B91C1C' }  // Light red
];

// Dark mode simplified colors
const getDarkSimplifiedColors = [
  { bg: '#082f49', border: '#0284c7', text: '#7dd3fc' }, // Dark blue
  { bg: '#052e16', border: '#16a34a', text: '#86efac' }, // Dark green
  { bg: '#4a044e', border: '#a855f7', text: '#d8b4fe' }, // Dark purple
  { bg: '#4c0519', border: '#e11d48', text: '#fda4af' }, // Dark pink
  { bg: '#451a03', border: '#eab308', text: '#fcd34d' }, // Dark yellow
  { bg: '#1a2e05', border: '#84cc16', text: '#bef264' }, // Dark lime
  { bg: '#042f2e', border: '#14b8a6', text: '#5eead4' }, // Dark teal
  { bg: '#450a0a', border: '#dc2626', text: '#fca5a5' }  // Dark red
];

// Get a consistent color based on task ID for simplified mode
const getSimplifiedColor = (taskId: string, isDark: boolean) => {
  const colors = isDark ? getDarkSimplifiedColors : getLightSimplifiedColors;
  const numericValue = taskId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const colorIndex = numericValue % colors.length;
  return colors[colorIndex];
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
const CardContainer = styled(motion.div)<{ colorBg: string; colorBorder: string }>`
  width: 100%;
  max-width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.large};
  border-top: 8px solid ${({ colorBorder }) => colorBorder};
  background-color: ${({ colorBg }) => colorBg};
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

const PriorityLabel = styled.span<{ textColor: string }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ textColor }) => textColor};
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
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const DismissButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.small};
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SnoozeButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const SnoozeButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
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
  onSnooze,
  isShuffling = false,
  simplifyMode = false
}: TaskCardProps) => {
  // Get the current theme mode
  const { themeMode } = useTheme();
  const isDarkMode = themeMode === 'dark';
  
  // Different animations based on whether we're shuffling or just showing a card
  const cardVariants = {
    initial: isShuffling 
      ? { opacity: 1, y: 0, scale: 1, rotateY: 0 } 
      : { opacity: 0, y: 50, scale: 0.8 },
    animate: { opacity: 1, y: 0, scale: 1, rotateY: 0 },
    exit: isShuffling 
      ? { opacity: 0, rotateY: 90, transition: { duration: 0.3 } }
      : { opacity: 0, y: -50, scale: 0.8 },
    shuffling: { 
      opacity: 0.8, 
      scale: 0.9, 
      rotateY: 90,
      transition: { duration: 0.3 } 
    }
  };

  // Determine which color scheme to use based on simplifyMode and dark mode
  const colors = simplifyMode 
    ? getSimplifiedColor(task.id, isDarkMode) 
    : getPriorityColors(task.priority, isDarkMode);

  return (
    <CardContainer
      colorBg={colors.bg}
      colorBorder={colors.border}
      key={task.id}
      initial="initial"
      animate={isShuffling ? "shuffling" : "animate"}
      exit="exit"
      variants={cardVariants}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <CardHeader>
        <CategoryEmoji>{getCategoryEmoji(task.category)}</CategoryEmoji>
        {!simplifyMode && (
          <PriorityLabel textColor={colors.text}>
            {task.priority} priority
          </PriorityLabel>
        )}
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
          disabled={isShuffling}
        >
          Complete
        </CompleteButton>
        <DismissButton
          whileTap={{ scale: 0.95 }}
          onClick={onDismiss}
          disabled={isShuffling}
        >
          Dismiss
        </DismissButton>
      </ActionButtonsGrid>
      
      <SnoozeButtonsGrid>
        <SnoozeButton
          whileTap={{ scale: 0.95 }}
          onClick={() => onSnooze(1)}
          disabled={isShuffling}
        >
          +1 hour
        </SnoozeButton>
        <SnoozeButton
          whileTap={{ scale: 0.95 }}
          onClick={() => onSnooze(3)}
          disabled={isShuffling}
        >
          +3 hours
        </SnoozeButton>
        <SnoozeButton
          whileTap={{ scale: 0.95 }}
          onClick={() => onSnooze(24)}
          disabled={isShuffling}
        >
          Tomorrow
        </SnoozeButton>
      </SnoozeButtonsGrid>
      
      <TaskCount>
        {taskCount} task{taskCount !== 1 ? 's' : ''} in your stack
      </TaskCount>
    </CardContainer>
  );
};

export default TaskCard;