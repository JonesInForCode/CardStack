// src/components/SubtaskView.tsx
import { useState, useEffect } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
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

const SubtaskContentWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 500px;
`;

const NavigationArea = styled(motion.div) <{ position: 'top' | 'bottom' }>`
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

// Swipe indicator
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
  const [isMobile, setIsMobile] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);

  // Get active subtasks (not completed or cancelled)
  const activeSubtasks = subtasks.filter(st => !st.isCompleted);
  const currentSubtask = activeSubtasks[currentSubtaskIndex];

  const hasPrevious = currentSubtaskIndex > 0;
  const hasNext = currentSubtaskIndex < activeSubtasks.length - 1;

  // Detect if mobile
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

  // Handle drag during movement
  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragX(info.offset.x);
    setDragY(info.offset.y);

    const threshold = 30;

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
    const distanceThreshold = 50;
    const velocityThreshold = 100;

    const absX = Math.abs(info.offset.x);
    const absY = Math.abs(info.offset.y);
    const absVelX = Math.abs(info.velocity.x);
    const absVelY = Math.abs(info.velocity.y);

    const isValidSwipe = (distance: number, velocity: number) =>
      distance > distanceThreshold || velocity > velocityThreshold;

    if (absX > absY) {
      // Horizontal swipe
      if (info.offset.x < 0 && isValidSwipe(absX, absVelX)) {
        // Left swipe - go back to parent (SWAPPED)
        onClose();
      } else if (info.offset.x > 0 && isValidSwipe(absX, absVelX)) {
        // Right swipe - complete subtask (SWAPPED)
        handleSubtaskComplete();
      }
    } else {
      // Vertical swipe
      if (info.offset.y < 0 && isValidSwipe(absY, absVelY)) {
        // Up swipe
        if (hasPrevious) {
          navigateToPrevious();
        } else {
          onAddSubtask(); // Add subtask at top
        }
      } else if (info.offset.y > 0 && isValidSwipe(absY, absVelY)) {
        // Down swipe
        if (hasNext) {
          navigateToNext();
        } else {
          onAddSubtask(); // Add subtask at bottom
        }
      }
    }

    // Reset state
    setSwipeDirection(null);
    setDragX(0);
    setDragY(0);
  };

  // Get swipe indicator text
  const getSwipeIndicatorText = () => {
    switch (swipeDirection) {
      case 'right':  // SWAPPED
        return { text: 'Complete', icon: '✓' };
      case 'left':   // SWAPPED
        return { text: 'Back to Task', icon: '←' };
      case 'up':
        if (hasPrevious) {
          return { text: 'Previous', icon: '↑' };
        }
        return { text: 'Add Subtask', icon: '+' };
      case 'down':
        if (hasNext) {
          return { text: 'Next', icon: '↓' };
        }
        return { text: 'Add Subtask', icon: '+' };
      default:
        return null;
    }
  };

  const indicatorInfo = getSwipeIndicatorText();

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
        <SubtaskContentWrapper
          drag={isMobile}
          dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
          dragElastic={0.2}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={{ x: 0, y: 0 }}
          style={{ touchAction: isMobile ? 'none' : 'auto' }}
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

          {/* Desktop navigation areas */}
          {!isMobile && (
            <>
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
            </>
          )}

          <AnimatePresence mode="wait">
            {currentSubtask ? (
              <motion.div
                animate={{
                  x: dragX * 0.3,
                  y: dragY * 0.3,
                  rotateY: dragX * 0.1,
                  scale: 1 - Math.abs(dragX) * 0.0005 - Math.abs(dragY) * 0.0005
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                style={{ position: 'relative' }}
              >
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
              </motion.div>
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
        </SubtaskContentWrapper>
      </SubtaskContainer>
    </ViewContainer>
  );
};

export default SubtaskView;