// src/components/Card/TaskCard.tsx - Properly using styled-components
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { type Task, type Priority, type Category } from '../../types/Task';
import { useTheme } from '../../context/ThemeContext';
import PomodoroTimer from '../PomodoroTimer';

interface TaskCardProps {
  task: Task;
  taskCount: number;
  onComplete: () => void;
  onDismiss: () => void;
  onSnooze: (hours: number) => void;
  isShuffling?: boolean;
  simplifyMode?: boolean; // New prop for simplify mode
  pomodoroActive?: boolean;
  pomodoroEndTime?: number | null; // New prop for timer persistence
  onPomodoroComplete?: () => void;
}

// Get color for priority level - respects theme mode
const getPriorityColors = (priority: Priority, isDarkMode: boolean) => {
  if (isDarkMode) {
    // Dark mode colors - softer, less bright
    switch (priority) {
      case 'high':
        return { bg: '#3B0404', border: '#EF4444', text: '#F87171' };
      case 'medium':
        return { bg: '#452A05', border: '#F59E0B', text: '#FBBF24' };
      case 'low':
        return { bg: '#052E1A', border: '#10B981', text: '#34D399' };
      default:
        return { bg: '#1E1B4B', border: '#6366F1', text: '#818CF8' };
    }
  } else {
    // Light mode colors - unchanged
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

// Simplified mode colors - theme aware
const getLightSimplifiedColors = () => [
  { bg: '#F0F9FF', border: '#7DD3FC', text: '#0369A1' }, // Light blue
  { bg: '#F0FDF4', border: '#86EFAC', text: '#166534' }, // Light green
  { bg: '#FDF4FF', border: '#D8B4FE', text: '#7E22CE' }, // Light purple
  { bg: '#FFF1F2', border: '#FDA4AF', text: '#BE123C' }, // Light pink
  { bg: '#FFFBEB', border: '#FCD34D', text: '#A16207' }, // Light yellow
  { bg: '#F7FEE7', border: '#BEF264', text: '#3F6212' }, // Light lime
  { bg: '#F0FDFA', border: '#5EEAD4', text: '#0F766E' }, // Light teal
  { bg: '#FEF2F2', border: '#FCA5A5', text: '#B91C1C' }  // Light red
];

const getDarkSimplifiedColors = () => [
  { bg: '#082F49', border: '#0EA5E9', text: '#7DD3FC' }, // Dark blue
  { bg: '#052E16', border: '#10B981', text: '#86EFAC' }, // Dark green
  { bg: '#4A1D96', border: '#8B5CF6', text: '#D8B4FE' }, // Dark purple
  { bg: '#831843', border: '#EC4899', text: '#FDA4AF' }, // Dark pink
  { bg: '#713F12', border: '#EAB308', text: '#FCD34D' }, // Dark yellow
  { bg: '#365314', border: '#84CC16', text: '#BEF264' }, // Dark lime
  { bg: '#134E4A', border: '#14B8A6', text: '#5EEAD4' }, // Dark teal
  { bg: '#7F1D1D', border: '#EF4444', text: '#FCA5A5' }  // Dark red
];

// Get a consistent color based on task ID and theme
const getSimplifiedColor = (taskId: string, isDarkMode: boolean) => {
  // Extract numeric part from the task ID and sum the characters
  const numericValue = taskId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const colorArray = isDarkMode ? getDarkSimplifiedColors() : getLightSimplifiedColors();
  const colorIndex = numericValue % colorArray.length;
  return colorArray[colorIndex];
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

// Format the snooze until time in a user-friendly way
const formatSnoozeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 60) {
    return `in ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
  }
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return 'tomorrow';
  }
  
  return `in ${diffDays} days`;
};

// Styled components
const CardContainer = styled(motion.div)<{ colorBg: string; colorBorder: string }>`
  position: relative;
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

const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const DueDate = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SnoozeInfo = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.primaryLight}20; /* 20 = 12% opacity */
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  display: inline-block;
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
  background-color: #E5E7EB;
  color: #4B5563;
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
  color: ${({ theme }) => theme.colors.textSecondary};
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
  simplifyMode = false,
  pomodoroActive = false,
  pomodoroEndTime = null,
  onPomodoroComplete
}: TaskCardProps) => {
  // Get current theme mode
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

  // Determine which color scheme to use based on simplifyMode and theme
  const colors = simplifyMode 
    ? getSimplifiedColor(task.id, isDarkMode) 
    : getPriorityColors(task.priority, isDarkMode);

  // Check if task is snoozed
  const isSnoozed = !!task.snoozedUntil && task.snoozedUntil > new Date();

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
      {pomodoroActive && onPomodoroComplete && (
        <PomodoroTimer 
          isRunning={pomodoroActive && !isShuffling && !isSnoozed} 
          onTimerComplete={onPomodoroComplete}
          endTime={pomodoroEndTime}
        />
      )}
      
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
      
      <InfoRow>
        {task.dueDate && (
          <DueDate>
            Due: {task.dueDate.toLocaleDateString()}
          </DueDate>
        )}
        
        {isSnoozed && task.snoozedUntil && (
          <SnoozeInfo>
            Returns {formatSnoozeTime(task.snoozedUntil)}
          </SnoozeInfo>
        )}
      </InfoRow>

      <ActionButtonsGrid>
        <CompleteButton
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          disabled={isShuffling || isSnoozed}
        >
          Complete
        </CompleteButton>
        <DismissButton
          whileTap={{ scale: 0.95 }}
          onClick={onDismiss}
          disabled={isShuffling || isSnoozed}
        >
          Dismiss
        </DismissButton>
      </ActionButtonsGrid>
      
      <SnoozeButtonsGrid>
        <SnoozeButton
          whileTap={{ scale: 0.95 }}
          onClick={() => onSnooze(1)}
          disabled={isShuffling || isSnoozed}
        >
          +1 hour
        </SnoozeButton>
        <SnoozeButton
          whileTap={{ scale: 0.95 }}
          onClick={() => onSnooze(3)}
          disabled={isShuffling || isSnoozed}
        >
          +3 hours
        </SnoozeButton>
        <SnoozeButton
          whileTap={{ scale: 0.95 }}
          onClick={() => onSnooze(24)}
          disabled={isShuffling || isSnoozed}
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