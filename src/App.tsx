import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

// Components
import SplashScreen from './components/Splash';
import Header from './components/Header';
import Footer from './components/Footer';
import TaskCard from './components/Card';
import AddTaskModal from './components/Modals';
import { BreakModal, InfoModal } from './components/Modals';
import { CompletedTasksDrawer, SnoozedTasksDrawer, CategoryDecksDrawer } from './components/Drawers';
import Loading from './components/Loading';
import PWAInstall from './components/PWAInstall';
import UpdateNotification from './components/UpdateNotification';

// Hooks
import { useTasks } from './hooks/useTasks';
import { useAppVersionCheck } from './utils/version';

// Constants
import { ANIMATION_DURATION } from './constants';
import { type Category, getCategoryEmoji } from './types/Task';

// Get the app version from package.json
const APP_VERSION = '1.3.0'; // This should match your package.json version

const AppContainer = styled.div`
  position: relative;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  overflow: hidden;
`;

const MainContent = styled.main`
  max-width: 500px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md};
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 6rem; /* Space for footer */
`;

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const EmptyStateTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SnoozedTasksInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.primaryDark};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  text-align: center;
  color: white;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  cursor: pointer;
`;

const AddTaskButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const CategoryHeading = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`;

const App = () => {
  // Task-related state and functions from custom hook
  const {
    tasks: allTasks,
    completedTasks,
    currentTask: hookCurrentTask,
    isLoading,
    snoozedTasks,
    snoozedTasksCount,
    completeTask,
    dismissTask,
    snoozeTask,
    unsnoozeTask,
    addTask,
    returnToStack,
    deleteCompletedTask,
    shuffleDeck,
    setCurrentTaskIndex,
  } = useTasks();

  // UI state
  const [showAddTask, setShowAddTask] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showSnoozedTasks, setShowSnoozedTasks] = useState(false);
  const [showCategoryDecks, setShowCategoryDecks] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false); // Track shuffle animation state
  const [simplifyMode, setSimplifyMode] = useState(false); // State for "Don't Prioritize" feature
  const [showInfoModal, setShowInfoModal] = useState(false); // State for info modal

  // Pomodoro state
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [pomodoroEndTime, setPomodoroEndTime] = useState<number | null>(null);
  const POMODORO_DURATION = 25 * 60 * 1000; // 25 minutes in milliseconds

  // Version check state
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const { updateAvailable, versionInfo, refreshApp } = useAppVersionCheck(APP_VERSION);

  // Helper function to trigger card animation
const triggerCardAnimation = () => {
  setIsShuffling(true);
  setTimeout(() => {
    setIsShuffling(false);
  }, 300);
};

  // Filter tasks based on the selected category
  const filteredTasks = selectedCategory
    ? allTasks.filter(task => task.category === selectedCategory)
    : allTasks;

  // Get visible tasks (tasks that aren't snoozed)
  const tasks = filteredTasks.filter(task => !task.snoozedUntil || task.snoozedUntil <= new Date());

  // Update currentTaskIndex when selected category changes
  useEffect(() => {
    if (selectedCategory) {
      // When a category is selected, find the first task with that category
      const firstTaskIndex = allTasks.findIndex(
        task => task.category === selectedCategory && (!task.snoozedUntil || task.snoozedUntil <= new Date())
      );
      if (firstTaskIndex !== -1) {
        setCurrentTaskIndex(firstTaskIndex);
      }
    }
  }, [selectedCategory, allTasks, setCurrentTaskIndex]);

  // Handle shuffle with animation
  const handleShuffle = () => {
    if (tasks.length <= 1) return; // Don't shuffle if not enough tasks

    setIsShuffling(true);
    // Small delay to allow animation to show before actual shuffle happens
    setTimeout(() => {
      shuffleDeck();
      setIsShuffling(false);
    }, 300);
  };

  // Toggle simplify mode (don't prioritize)
  const toggleSimplifyMode = () => {
    setSimplifyMode(prev => !prev);
  };

  // Toggle Category Decks drawer
  const toggleCategoryDecks = () => {
    setShowCategoryDecks(!showCategoryDecks);
  };

  // Handler for selecting a category
  const handleSelectCategory = (category: string | null) => {
    // Only trigger animation if we're changing categories
    if (category !== selectedCategory) {
      triggerCardAnimation();
    }
    setSelectedCategory(category);
    setShowCategoryDecks(false); // Close the drawer after selection
  };

  // Toggle Pomodoro mode
  const togglePomodoro = () => {
    setPomodoroActive(prev => {
      const newActive = !prev;
      // If turning on the timer, set the end time
      if (newActive && !pomodoroEndTime) {
        setPomodoroEndTime(Date.now() + POMODORO_DURATION);
      }
      // If turning off the timer, clear the end time
      if (!newActive) {
        setPomodoroEndTime(null);
      }
      return newActive;
    });

    // If we're turning off Pomodoro while on break, hide the break modal
    if (showBreakModal) {
      setShowBreakModal(false);
    }
  };

  // Update the handlePomodoroComplete function
  const handlePomodoroComplete = () => {
    setShowBreakModal(true);
    setPomodoroEndTime(null); // Reset the timer end time
  };

  // Update the handleBreakComplete function
  const handleBreakComplete = () => {
    setShowBreakModal(false);
    // Start a new timer if Pomodoro is still active
    if (pomodoroActive) {
      setPomodoroEndTime(Date.now() + POMODORO_DURATION);
    }
  };

  // Update the handleSkipBreak function
  const handleSkipBreak = () => {
    setShowBreakModal(false);
    // Start a new timer if Pomodoro is still active
    if (pomodoroActive) {
      setPomodoroEndTime(Date.now() + POMODORO_DURATION);
    }
  };

  // Handle dismissing the update notification
  const handleDismissUpdate = () => {
    setUpdateDismissed(true);

    // Store dismissal in session storage - will show again on page refresh
    sessionStorage.setItem('updateDismissed', 'true');
  };

  // Check if app was just refreshed for an update
  useEffect(() => {
    const wasRefreshing = sessionStorage.getItem('app_refreshing') === 'true';
    if (wasRefreshing) {
      // Clear the flag
      sessionStorage.removeItem('app_refreshing');
      // Make sure update dismissed is also cleared so it doesn't immediately show again
      setUpdateDismissed(false);
      sessionStorage.removeItem('updateDismissed');
    }
  }, []);

  // Check if update was previously dismissed in this session
  useEffect(() => {
    const wasDismissed = sessionStorage.getItem('updateDismissed') === 'true';
    setUpdateDismissed(wasDismissed);
  }, []);

  // Hide splash screen after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, ANIMATION_DURATION.SPLASH_SCREEN);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContainer>
      {showSplash && <SplashScreen onAnimationComplete={() => setShowSplash(false)} />}

      <Header
        onShuffle={handleShuffle}
        taskCount={tasks.length}
        simplifyMode={simplifyMode}
        onToggleSimplifyMode={toggleSimplifyMode}
        pomodoroActive={pomodoroActive}
        onTogglePomodoro={togglePomodoro}
        onOpenInfo={() => setShowInfoModal(true)}
      />

      <MainContent>
        {selectedCategory && (
          <CategoryHeading>
            {getCategoryEmoji(selectedCategory as Category)} {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Deck
          </CategoryHeading>
        )}

        {isLoading ? (
          <Loading message="Loading your stack..." />
        ) : tasks.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              {hookCurrentTask && (
                <TaskCard
                  key={hookCurrentTask.id}
                  task={hookCurrentTask}
                  taskCount={tasks.length}
                  onComplete={completeTask}
                  onDismiss={dismissTask}
                  onSnooze={snoozeTask}
                  isShuffling={isShuffling}
                  simplifyMode={simplifyMode}
                  pomodoroActive={pomodoroActive}
                  pomodoroEndTime={pomodoroEndTime}
                  onPomodoroComplete={handlePomodoroComplete}
                />
              )}
            </AnimatePresence>

            {/* Show snoozed tasks info if any tasks are snoozed */}
            {snoozedTasksCount > 0 && !showSnoozedTasks && (
              <SnoozedTasksInfo onClick={() => setShowSnoozedTasks(true)}>
                {snoozedTasksCount} task{snoozedTasksCount !== 1 ? 's' : ''} snoozed
              </SnoozedTasksInfo>
            )}
          </>
        ) : snoozedTasksCount > 0 ? (
          // Show a special message when all tasks are snoozed
          <EmptyStateContainer>
            <EmptyStateTitle>All tasks are snoozed!</EmptyStateTitle>
            <EmptyStateText>
              You have {snoozedTasksCount} snoozed task{snoozedTasksCount !== 1 ? 's' : ''} that will return later.
            </EmptyStateText>
            <AddTaskButton onClick={() => setShowAddTask(true)}>
              Add a new task
            </AddTaskButton>
          </EmptyStateContainer>
        ) : (
          // Empty state when no tasks exist or all are filtered out
          <EmptyStateContainer>
            <EmptyStateTitle>
              {selectedCategory 
                ? `No tasks in the ${selectedCategory} deck!` 
                : 'Your stack is empty!'}
            </EmptyStateTitle>
            <EmptyStateText>
              {selectedCategory 
                ? `Try adding a task with the "${selectedCategory}" category or select a different deck.`
                : 'Add a new task to get started.'}
            </EmptyStateText>
            <AddTaskButton onClick={() => setShowAddTask(true)}>
              Add a task
            </AddTaskButton>
          </EmptyStateContainer>
        )}
      </MainContent>

      <Footer
        onAddTask={() => setShowAddTask(true)}
        onToggleCompletedTasks={() => setShowCompletedTasks(!showCompletedTasks)}
        showCompletedTasks={showCompletedTasks}
        snoozedTasksCount={snoozedTasksCount}
        onToggleSnoozedTasks={() => setShowSnoozedTasks(!showSnoozedTasks)}
        showSnoozedTasks={showSnoozedTasks}
        onToggleCategoryDecks={toggleCategoryDecks}
        showCategoryDecks={showCategoryDecks}
      />

      {/* Add PWA Install Prompt */}
      <PWAInstall />

      {/* Version Update Notification */}
      <AnimatePresence>
        {updateAvailable && !updateDismissed && (
          <UpdateNotification
            versionInfo={versionInfo}
            onUpdate={refreshApp}
            onDismiss={handleDismissUpdate}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showInfoModal && (
          <InfoModal onClose={() => setShowInfoModal(false)} />
        )}

        {showAddTask && (
          <AddTaskModal
            onClose={() => setShowAddTask(false)}
            onAddTask={addTask}
          />
        )}

        {showCompletedTasks && (
          <CompletedTasksDrawer
            completedTasks={completedTasks}
            onClose={() => setShowCompletedTasks(false)}
            onReturnToStack={returnToStack}
            onDeleteTask={deleteCompletedTask}
          />
        )}

        {showSnoozedTasks && (
          <SnoozedTasksDrawer
            snoozedTasks={snoozedTasks}
            onClose={() => setShowSnoozedTasks(false)}
            onUnsnoozeTasks={unsnoozeTask}
          />
        )}

        {showCategoryDecks && (
          <CategoryDecksDrawer
            tasks={allTasks.filter(task => !task.snoozedUntil || task.snoozedUntil <= new Date())}
            onClose={() => setShowCategoryDecks(false)}
            onSelectCategory={handleSelectCategory}
            selectedCategory={selectedCategory}
          />
        )}

        {/* Break Modal for Pomodoro */}
        {showBreakModal && (
          <BreakModal
            onBreakComplete={handleBreakComplete}
            onSkipBreak={handleSkipBreak}
          />
        )}
      </AnimatePresence>
    </AppContainer>
  );
};

export default App;