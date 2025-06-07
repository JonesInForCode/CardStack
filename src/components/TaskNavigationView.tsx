// src/components/TaskNavigationView.tsx
import { useState, useEffect } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
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

const TaskContentWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
`;

const NavigationArea = styled(motion.div) <{ position: 'top' | 'bottom'; isMobile: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  height: 80px;
  ${({ position }) => position === 'top' ? 'top: -60px;' : 'bottom: -60px;'}
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ isMobile }) => isMobile ? 'default' : 'pointer'};
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

// Visual swipe indicators
const SwipeIndicator = styled(motion.div) <{ direction: 'left' | 'right' | 'up' | 'down' }>`
  position: absolute;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  ${({ direction }) => {
        switch (direction) {
            case 'left':
                return `
          right: -20px;
          top: 50%;
          transform: translateY(-50%);
        `;
            case 'right':
                return `
          left: -20px;
          top: 50%;
          transform: translateY(-50%);
        `;
            case 'up':
                return `
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
        `;
            case 'down':
                return `
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
        `;
        }
    }}
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
    const [isMobile, setIsMobile] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(null);
    const [dragX, setDragX] = useState(0);
    const [dragY, setDragY] = useState(0);

    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < taskCount - 1;
    const hasSubtasks = task.hasSubtasks && task.subtasks && task.subtasks.length > 0;

    // Detect primary input method
    useEffect(() => {
        const checkPrimaryInput = () => {
            const hasHoverCapability = window.matchMedia('(hover: hover)').matches;
            const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
            const isMobileDevice = hasCoarsePointer || !hasHoverCapability;
            setIsMobile(isMobileDevice);
        };

        checkPrimaryInput();
        window.addEventListener('resize', checkPrimaryInput);
        return () => window.removeEventListener('resize', checkPrimaryInput);
    }, []);

    // Handle drag/pan during movement
    const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setDragX(info.offset.x);
        setDragY(info.offset.y);

        const threshold = 30; // Minimum distance to show indicator

        // Determine swipe direction based on current offset
        if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
            // Horizontal swipe
            if (info.offset.x < -threshold) {
                setSwipeDirection('left');
            } else if (info.offset.x > threshold) {
                setSwipeDirection('right');
            } else {
                setSwipeDirection(null);
            }
        } else {
            // Vertical swipe
            if (info.offset.y < -threshold) {
                setSwipeDirection('up');
            } else if (info.offset.y > threshold) {
                setSwipeDirection('down');
            } else {
                setSwipeDirection(null);
            }
        }
    };

    // Handle drag end
    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const distanceThreshold = 50; // Minimum distance for action
        const velocityThreshold = 100; // Minimum velocity for quick swipes

        const absX = Math.abs(info.offset.x);
        const absY = Math.abs(info.offset.y);
        const absVelX = Math.abs(info.velocity.x);
        const absVelY = Math.abs(info.velocity.y);

        // Check if swipe meets threshold (either distance OR velocity)
        const isValidSwipe = (distance: number, velocity: number) =>
            distance > distanceThreshold || velocity > velocityThreshold;

        // Determine primary direction
        if (absX > absY) {
            // Horizontal swipe
            if (info.offset.x < 0 && isValidSwipe(absX, absVelX)) {
                // Left swipe - open subtasks or add subtask
                if (hasSubtasks && onOpenSubtasks) {
                    onOpenSubtasks();
                } else if (onAddSubtask) {
                    onAddSubtask();
                }
            } else if (info.offset.x > 0 && isValidSwipe(absX, absVelX)) {
                // Right swipe - Complete task
                onComplete();
            }
        } else {
            // Vertical swipe
            if (info.offset.y < 0 && isValidSwipe(absY, absVelY)) {
                // Up swipe
                if (hasPrevious) {
                    onNavigatePrevious();
                } else {
                    onAddTask(); // Add task at top
                }
            } else if (info.offset.y > 0 && isValidSwipe(absY, absVelY)) {
                // Down swipe
                if (hasNext) {
                    onNavigateNext();
                } else {
                    onAddTask(); // Add task at bottom
                }
            }
        }

        // Reset state
        setSwipeDirection(null);
        setDragX(0);
        setDragY(0);
        setShowTopNav(false);
        setShowBottomNav(false);
    };

    // Get swipe indicator text
    const getSwipeIndicatorText = () => {
        switch (swipeDirection) {
            case 'right':  // SWAPPED
                return { text: 'Complete', icon: '✓' };
            case 'left':   // SWAPPED
                if (hasSubtasks) {
                    return { text: 'View Subtasks', icon: '←' };
                }
                return { text: 'Add Subtask', icon: '+' };
            case 'up':
                if (hasPrevious) {
                    return { text: 'Previous', icon: '↑' };
                }
                return { text: 'Add Task', icon: '+' };
            case 'down':
                if (hasNext) {
                    return { text: 'Next', icon: '↓' };
                }
                return { text: 'Add Task', icon: '+' };
            default:
                return null;
        }
    };

    const indicatorInfo = getSwipeIndicatorText();

    return (
        <NavigationContainer>
            <TaskContentWrapper
                drag
                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                dragElastic={0.2}
                dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                animate={{ x: 0, y: 0 }}
                style={{ touchAction: 'none' }}
            >
                {/* Swipe indicators */}
                <AnimatePresence>
                    {swipeDirection && indicatorInfo && (
                        <SwipeIndicator
                            direction={swipeDirection}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <span>{indicatorInfo.icon}</span>
                            <span>{indicatorInfo.text}</span>
                        </SwipeIndicator>
                    )}
                </AnimatePresence>

                {/* Top navigation area for desktop */}
                {!isMobile && (
                    <NavigationArea
                        position="top"
                        isMobile={isMobile}
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
                )}

                {/* Main task card */}
                <motion.div
                    animate={{
                        x: dragX * 0.3, // Subtle visual feedback during drag
                        y: dragY * 0.3,
                        rotateY: dragX * 0.1, // Slight 3D rotation on horizontal swipe
                        scale: 1 - Math.abs(dragX) * 0.0005 - Math.abs(dragY) * 0.0005
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                >
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
                </motion.div>

                {/* Bottom navigation area for desktop */}
                {!isMobile && (
                    <NavigationArea
                        position="bottom"
                        isMobile={isMobile}
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
                )}
            </TaskContentWrapper>
        </NavigationContainer>
    );
};

export default TaskNavigationView;