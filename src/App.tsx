import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

// Components
import SplashScreen from './components/Splash';
import Header from './components/Header';
import Footer from './components/Footer';
import TaskCard from './components/Card';
import AddTaskModal from './components/Modals';
import { CompletedTasksDrawer, SnoozedTasksDrawer } from './components/Drawers';
import Loading from './components/Loading';
import PWAInstall from './components/PWAInstall';

// Hooks
import { useTasks } from './hooks/useTasks';

// Constants
import { ANIMATION_DURATION } from './constants';

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
    deleteCompletedTask, // New function from useTasks hook
    shuffleDeck,
  } = useTasks();

  // UI state
  const [showAddTask, setShowAddTask] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showSnoozedTasks, setShowSnoozedTasks] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false); // Track shuffle animation state
  const [simplifyMode, setSimplifyMode] = useState(false); // New state for "Don't Prioritize" feature

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
      
      {/* Updated Header with shuffle functionality and simplify mode toggle */}
      <Header 
        onShuffle={handleShuffle}
        taskCount={tasks.length}
        simplifyMode={simplifyMode}
        onToggleSimplifyMode={toggleSimplifyMode}
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

      {/* Modals */}
      <AnimatePresence>
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
            onDeleteTask={deleteCompletedTask} // Pass the new delete function
          />
        )}
        
        {showSnoozedTasks && (
          <SnoozedTasksDrawer 
            snoozedTasks={snoozedTasks}
            onClose={() => setShowSnoozedTasks(false)}
            onUnsnoozeTasks={unsnoozeTask}
          />
        )}
      </AnimatePresence>
    </AppContainer>
  );
};

export default App;