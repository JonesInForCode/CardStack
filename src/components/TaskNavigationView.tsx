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
    const [isSwipeInProgress, setIsSwipeInProgress] = useState(false);

    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < taskCount - 1;

    // Detect touch capability - simpler and more reliable
    useEffect(() => {
        const checkTouchCapable = () => {
            // If the device has touch capability, enable gestures
            const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

            console.log('Touch detection:', {
                hasTouchSupport,
                maxTouchPoints: navigator.maxTouchPoints,
                screenWidth: window.innerWidth
            });

            setIsMobile(hasTouchSupport);
        };

        checkTouchCapable();
        window.addEventListener('resize', checkTouchCapable);
        return () => window.removeEventListener('resize', checkTouchCapable);
    }, []);

    // Handle pan gesture start
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handlePanStart = (_event: PointerEvent, _info: PanInfo) => {
        // Only activate if this is actually a mobile device
        if (!isMobile) return;

        setIsSwipeInProgress(true);
        // Don't show navigation immediately - wait for actual movement
    };

    // Handle pan gesture during movement
    const handlePan = (_event: PointerEvent, info: PanInfo) => {
        if (!isMobile || !isSwipeInProgress) return;

        const deltaY = info.delta.y;
        const deltaX = info.delta.x;
        const threshold = 20; // Small threshold to avoid showing on tiny movements

        // Prioritize horizontal swipes over vertical ones
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
            // Horizontal swipe detected - hide vertical navigation
            setShowTopNav(false);
            setShowBottomNav(false);
        } else if (Math.abs(deltaY) > threshold) {
            // Show appropriate navigation based on vertical swipe direction
            if (deltaY < 0) { // Swiping up
                setShowTopNav(true);
                setShowBottomNav(false);
            } else if (deltaY > 0) { // Swiping down
                setShowBottomNav(true);
                setShowTopNav(false);
            }
        }
    };

    // Handle pan gesture end
    const handlePanEnd = (_event: PointerEvent, info: PanInfo) => {
        if (!isMobile) return;

        const deltaY = info.delta.y;
        const deltaX = info.delta.x;
        const velocityY = info.velocity.y;
        const velocityX = info.velocity.x;
        const threshold = 50; // Minimum distance for swipe
        const velocityThreshold = 500; // Minimum velocity for quick swipes

        // Check for horizontal swipe first (right swipe to add subtask)
        const isSignificantHorizontalSwipe = Math.abs(deltaX) > threshold || Math.abs(velocityX) > velocityThreshold;
        const isSignificantVerticalSwipe = Math.abs(deltaY) > threshold || Math.abs(velocityY) > velocityThreshold;

        if (isSignificantHorizontalSwipe && Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe takes priority
            if (deltaX > 0 || velocityX > velocityThreshold) {
                // Swiped right - add subtask
                if (onAddSubtask) {
                    onAddSubtask();
                }
            }
            // Note: We don't handle left swipes for now
        } else if (isSignificantVerticalSwipe) {
            // Vertical swipe
            if (deltaY < 0 || velocityY < -velocityThreshold) {
                // Swiped up - go to previous
                if (hasPrevious) {
                    onNavigatePrevious();
                }
            } else if (deltaY > 0 || velocityY > velocityThreshold) {
                // Swiped down - go to next
                if (hasNext) {
                    onNavigateNext();
                }
            }
        }

        // Hide navigation after a short delay
        setTimeout(() => {
            setIsSwipeInProgress(false);
            setShowTopNav(false);
            setShowBottomNav(false);
        }, 100);
    };
    return (
        <NavigationContainer>
            <TaskContentWrapper
                // Always enable pan gestures on touch-capable devices
                onPanStart={handlePanStart}
                onPan={handlePan}
                onPanEnd={handlePanEnd}
            >
                {/* Top navigation area */}
                <NavigationArea
                    position="top"
                    isMobile={isMobile}
                    // Only add mouse events for non-mobile devices
                    {...(!isMobile && {
                        onMouseEnter: () => setShowTopNav(true),
                        onMouseLeave: () => setShowTopNav(false)
                    })}
                >
                    <AnimatePresence>
                        {((!isMobile && showTopNav) || (isMobile && isSwipeInProgress && showTopNav)) && (
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
                    isMobile={isMobile}
                    // Only add mouse events for non-mobile devices
                    {...(!isMobile && {
                        onMouseEnter: () => setShowBottomNav(true),
                        onMouseLeave: () => setShowBottomNav(false)
                    })}
                >
                    <AnimatePresence>
                        {((!isMobile && showBottomNav) || (isMobile && isSwipeInProgress && showBottomNav)) && (
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