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
import { CompletedTasksDrawer, SnoozedTasksDrawer } from './components/Drawers';
import Loading from './components/Loading';
import PWAInstall from './components/PWAInstall';
import UpdateNotification from './components/UpdateNotification';

// Hooks
import { useTasks } from './hooks/useTasks';
import { useAppVersionCheck } from './utils/version';

// Constants
import { ANIMATION_DURATION } from './constants';

// Get the app version from package.json
const APP_VERSION = '1.1.5'; // This should match your package.json version

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

const App = () => {
  // Task-related state and functions from custom hook
  const {
    tasks,
    completedTasks,
    currentTask,
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
  } = useTasks();

  // UI state
  const [showAddTask, setShowAddTask] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showSnoozedTasks, setShowSnoozedTasks] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false); // Track shuffle animation state
  const [simplifyMode, setSimplifyMode] = useState(false); // New state for "Don't Prioritize" feature
  const [showInfoModal, setShowInfoModal] = useState(false); // New state for info modal
  
  // Pomodoro state
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [showBreakModal, setShowBreakModal] = useState(false);
  
  // Version check state
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const { updateAvailable, versionInfo, refreshApp } = useAppVersionCheck(APP_VERSION);

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
  
  // Toggle Pomodoro mode
  const togglePomodoro = () => {
    setPomodoroActive(prev => !prev);
    // If we're turning off Pomodoro while on break, hide the break modal
    if (showBreakModal) {
      setShowBreakModal(false);
    }
  };
  
  // Handle Pomodoro timer completion (show break modal)
  const handlePomodoroComplete = () => {
    setShowBreakModal(true);
  };
  
  // Handle when the break is complete (restart the timer)
  const handleBreakComplete = () => {
    setShowBreakModal(false);
    // Timer will restart automatically when pomodoroActive is true
  };
  
  // Handle when the user wants to skip the break
  const handleSkipBreak = () => {
    setShowBreakModal(false);
    // Timer will restart automatically when pomodoroActive is true
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
        {isLoading ? (
          <Loading message="Loading your stack..." />
        ) : tasks.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              {currentTask && (
                <TaskCard 
                  key={currentTask.id}
                  task={currentTask}
                  taskCount={tasks.length}
                  onComplete={completeTask}
                  onDismiss={dismissTask}
                  onSnooze={snoozeTask}
                  isShuffling={isShuffling}
                  simplifyMode={simplifyMode}
                  pomodoroActive={pomodoroActive}
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
          // Empty state when no tasks exist
          <EmptyStateContainer>
            <EmptyStateTitle>Your stack is empty!</EmptyStateTitle>
            <EmptyStateText>Add a new task to get started.</EmptyStateText>
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