// src/components/TaskNavigationView.tsx
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { type Task } from '../types/Task';
import TaskCard from './Card/TaskCard';

interface TaskNavigationViewProps {
  task: Task;
  taskCount: number;
  currentIndex: number;
  onComplete: () => void;
  onDismiss: () => void;
  onSnooze: (hours: number) => void;
  onNavigatePrevious: () => void;
  onNavigateNext: () => void;
  onAddTask: () => void;
  isShuffling?: boolean;
  simplifyMode?: boolean;
  pomodoroActive?: boolean;
  pomodoroEndTime?: number | null;
  onPomodoroComplete?: () => void;
  onOpenSubtasks?: () => void;
  onAddSubtask?: () => void;
}

const NavigationContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

const TaskContentWrapper = styled.div`
  position: relative;
  width: 100%;
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

const AddTaskButton = styled(motion.button)`
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

const TaskNavigationView = ({
  task,
  taskCount,
  currentIndex,
  onComplete,
  onDismiss,
  onSnooze,
  onNavigatePrevious,
  onNavigateNext,
  onAddTask,
  isShuffling = false,
  simplifyMode = false,
  pomodoroActive = false,
  pomodoroEndTime = null,
  onPomodoroComplete,
  onOpenSubtasks,
  onAddSubtask
}: TaskNavigationViewProps) => {
  const [showTopNav, setShowTopNav] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(false);
  
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < taskCount - 1;

  return (
    <NavigationContainer>
      <TaskContentWrapper>
        {/* Top navigation area */}
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
                    onClick={onNavigatePrevious}
                    title="Previous task"
                  >
                    ↑
                  </NavigationButton>
                ) : (
                  <AddTaskButton
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onAddTask}
                    title="Add task above"
                  >
                    +
                  </AddTaskButton>
                )}
              </>
            )}
          </AnimatePresence>
        </NavigationArea>

        {/* Main task card */}
        <TaskCard
          task={task}
          taskCount={taskCount}
          onComplete={onComplete}
          onDismiss={onDismiss}
          onSnooze={onSnooze}
          isShuffling={isShuffling}
          simplifyMode={simplifyMode}
          pomodoroActive={pomodoroActive}
          pomodoroEndTime={pomodoroEndTime}
          onPomodoroComplete={onPomodoroComplete}
          onOpenSubtasks={onOpenSubtasks}
          onAddSubtask={onAddSubtask}
        />

        {/* Bottom navigation area */}
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
                    onClick={onNavigateNext}
                    title="Next task"
                  >
                    ↓
                  </NavigationButton>
                ) : (
                  <AddTaskButton
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onAddTask}
                    title="Add task below"
                  >
                    +
                  </AddTaskButton>
                )}
              </>
            )}
          </AnimatePresence>
        </NavigationArea>
      </TaskContentWrapper>
    </NavigationContainer>
  );
};

export default TaskNavigationView;