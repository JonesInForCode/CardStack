import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Components
import SplashScreen from './components/Splash';
import Header from './components/Header';
import Footer from './components/Footer';
import TaskCard from './components/Card';
import AddTaskModal from './components/Modals';
import CompletedTasksDrawer from './components/Drawers';

// Hooks
import { useTasks } from './hooks/useTasks';

// Constants
import { ANIMATION_DURATION } from './constants';

const App = () => {
  // Task-related state and functions from custom hook
  const {
    tasks,
    completedTasks,
    currentTask,
    currentTaskIndex,
    completeTask,
    dismissTask,
    snoozeTask,
    addTask,
    returnToStack,
  } = useTasks();

  // UI state
  const [showAddTask, setShowAddTask] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Hide splash screen after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, ANIMATION_DURATION.SPLASH_SCREEN);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
      {showSplash && <SplashScreen onAnimationComplete={() => setShowSplash(false)} />}
      
      <Header />

      <main className="max-w-md mx-auto p-4 min-h-[80vh] flex flex-col justify-center items-center">
        {tasks.length > 0 ? (
          <AnimatePresence mode="wait">
            {currentTask && (
              <TaskCard 
                key={currentTask.id}
                task={currentTask}
                taskCount={tasks.length}
                onComplete={completeTask}
                onDismiss={dismissTask}
                onSnooze={snoozeTask}
              />
            )}
          </AnimatePresence>
        ) : (
          <div className="text-center p-8 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-2">Your stack is empty!</h2>
            <p className="text-gray-600 mb-4">Add a new task to get started.</p>
            <button
              className="p-3 bg-indigo-600 text-white font-semibold rounded-lg shadow"
              onClick={() => setShowAddTask(true)}
            >
              Add a task
            </button>
          </div>
        )}
      </main>

      <Footer 
        onAddTask={() => setShowAddTask(true)}
        onToggleCompletedTasks={() => setShowCompletedTasks(!showCompletedTasks)}
        showCompletedTasks={showCompletedTasks}
      />

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
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;