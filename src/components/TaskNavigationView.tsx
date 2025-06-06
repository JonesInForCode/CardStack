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

    // Detect primary input method - hover for desktop, gestures for mobile
    useEffect(() => {
        const checkPrimaryInput = () => {
            // Check if the primary pointing device can hover (fine pointer like mouse)
            const hasHoverCapability = window.matchMedia('(hover: hover)').matches;
            // Check if the primary pointing device is coarse (like finger)
            const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

            // If device can hover reliably, it's probably desktop/laptop with mouse
            // If it has coarse pointer, it's probably mobile/tablet
            const isMobileDevice = hasCoarsePointer || !hasHoverCapability;

            console.log('Input detection:', {
                hasHoverCapability,
                hasCoarsePointer,
                isMobileDevice,
                screenWidth: window.innerWidth
            });

            setIsMobile(isMobileDevice);
        };

        checkPrimaryInput();
        window.addEventListener('resize', checkPrimaryInput);
        return () => window.removeEventListener('resize', checkPrimaryInput);
    }, []);

    // Handle pan gesture start
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handlePanStart = (_event: PointerEvent, _info: PanInfo) => {
        setIsSwipeInProgress(true);
        console.log('Pan start detected');
    };

    // Handle pan gesture during movement
    const handlePan = (_event: PointerEvent, info: PanInfo) => {
        if (!isSwipeInProgress) return;

        const deltaY = info.delta.y;
        const deltaX = info.delta.x;
        const threshold = 10; // Much lower threshold

        // Debug logging
        console.log('Pan movement:', { deltaX, deltaY });

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
        const deltaY = info.delta.y;
        const deltaX = info.delta.x;
        const velocityY = info.velocity.y;
        const velocityX = info.velocity.x;

        // Much more permissive thresholds
        const distanceThreshold = 50; // Lower distance requirement
        const velocityThreshold = 100; // Much lower velocity requirement

        // Debug logging
        console.log('Pan end:', {
            deltaX, deltaY,
            velocityX, velocityY,
            distanceThreshold,
            velocityThreshold
        });

        // Check for horizontal swipe first (right swipe to add subtask)
        const isSignificantHorizontalSwipe = Math.abs(deltaX) > distanceThreshold || Math.abs(velocityX) > velocityThreshold;
        const isSignificantVerticalSwipe = Math.abs(deltaY) > distanceThreshold || Math.abs(velocityY) > velocityThreshold;

        if (isSignificantHorizontalSwipe && Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe takes priority
            if (deltaX < 0 || velocityX < -velocityThreshold) {
                // Swiped left - add subtask
                console.log('Right swipe detected - adding subtask');
                if (onAddSubtask) {
                    onAddSubtask();
                }
            }
        } else if (isSignificantVerticalSwipe) {
            // Vertical swipe
            if (deltaY < 0 || velocityY < -velocityThreshold) {
                // Swiped up - go to previous
                console.log('Up swipe detected - previous task');
                if (hasPrevious) {
                    onNavigatePrevious();
                }
            } else if (deltaY > 0 || velocityY > velocityThreshold) {
                // Swiped down - go to next
                console.log('Down swipe detected - next task');
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
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onPanStart={handlePanStart}
                onPan={handlePan}
                onPanEnd={handlePanEnd}
                style={{ touchAction: 'pan-y' }}
            >
                {/* Top navigation area */}
                <NavigationArea
                    position="top"
                    isMobile={isMobile}
                    // Always add mouse events for hover capability
                    onMouseEnter={() => setShowTopNav(true)}
                    onMouseLeave={() => setShowTopNav(false)}
                >
                    <AnimatePresence>
                        {(showTopNav || (isMobile && isSwipeInProgress && showTopNav)) && (
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
                    // Always add mouse events for hover capability
                    onMouseEnter={() => setShowBottomNav(true)}
                    onMouseLeave={() => setShowBottomNav(false)}
                >
                    <AnimatePresence>
                        {(showBottomNav || (isMobile && isSwipeInProgress && showBottomNav)) && (
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