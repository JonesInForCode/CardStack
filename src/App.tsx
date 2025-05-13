
/* eslint-disable */
/** @jsx React.createElement */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Task type definition
type Task = {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'personal' | 'errands' | 'other';
  dueDate?: Date;
  completedDate?: Date;
  snoozedUntil?: Date;
  isCompleted: boolean;
};

// Sample tasks for demonstration
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Submit quarterly report',
    description: 'Finalize and email the Q1 progress report to the team',
    priority: 'high',
    category: 'work',
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Pick up prescription',
    description: 'At Walgreens on Main St.',
    priority: 'high',
    category: 'errands',
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Schedule dentist appointment',
    description: 'Need cleaning and check-up',
    priority: 'low',
    category: 'personal',
    isCompleted: false,
  },
];

// This function loads tasks from localStorage
const loadTasks = (): Task[] => {
  const savedTasks = localStorage.getItem('cardstack_tasks');
  if (savedTasks) {
    try {
      // Parse the saved tasks
      const parsed = JSON.parse(savedTasks);
      
      // Convert string dates back to Date objects
      return parsed.map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        completedDate: task.completedDate ? new Date(task.completedDate) : undefined,
        snoozedUntil: task.snoozedUntil ? new Date(task.snoozedUntil) : undefined,
      }));
    } catch (e) {
      console.error("Failed to parse tasks from localStorage", e);
      return initialTasks;
    }
  }
  return initialTasks;
};

// This function loads completed tasks from localStorage
const loadCompletedTasks = (): Task[] => {
  const savedTasks = localStorage.getItem('cardstack_completed_tasks');
  if (savedTasks) {
    try {
      // Parse the saved tasks
      const parsed = JSON.parse(savedTasks);
      
      // Convert string dates back to Date objects
      return parsed.map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        completedDate: task.completedDate ? new Date(task.completedDate) : undefined,
        snoozedUntil: task.snoozedUntil ? new Date(task.snoozedUntil) : undefined,
      }));
    } catch (e) {
      console.error("Failed to parse completed tasks from localStorage", e);
      return [];
    }
  }
  return [];
};

const CardStack = () => {
  // State initialization with data from localStorage when available
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'medium',
    category: 'personal',
    isCompleted: false,
  });
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    setTasks(loadTasks());
    setCompletedTasks(loadCompletedTasks());
    setIsLoaded(true);
    
    // Hide splash screen after a delay
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cardstack_tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  // Save completed tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cardstack_completed_tasks', JSON.stringify(completedTasks));
    }
  }, [completedTasks, isLoaded]);

  // Process snoozed tasks whenever tasks are loaded or changed
  useEffect(() => {
    if (tasks.length > 0) {
      const now = new Date();
      const updatedTasks = tasks.map(task => {
        if (task.snoozedUntil && task.snoozedUntil <= now) {
          // Remove the snoozedUntil property if the snooze time has passed
          const { snoozedUntil, ...restTask } = task;
          return restTask as Task;
        }
        return task;
      });
      
      if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
        setTasks(updatedTasks);
      }
    }
  }, [tasks]);

  // Get current task
  const currentTask = tasks[currentTaskIndex];

  // Handle task completion
  const completeTask = () => {
    if (!currentTask) return;
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    
    const updatedTask = { ...currentTask, isCompleted: true, completedDate: new Date() };
    setCompletedTasks([updatedTask, ...completedTasks]);
    
    const updatedTasks = tasks.filter(task => task.id !== currentTask.id);
    setTasks(updatedTasks);
    
    if (currentTaskIndex >= updatedTasks.length) {
      setCurrentTaskIndex(Math.max(0, updatedTasks.length - 1));
    }
  };

  // Handle task dismissal (send to bottom of stack)
  const dismissTask = () => {
    if (!currentTask || tasks.length <= 1) return;
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    const updatedTasks = [...tasks];
    updatedTasks.push(updatedTasks.splice(currentTaskIndex, 1)[0]);
    setTasks(updatedTasks);
    
    if (currentTaskIndex >= updatedTasks.length - 1) {
      setCurrentTaskIndex(0);
    }
  };

  // Handle task snoozing
  const snoozeTask = (hours: number) => {
    if (!currentTask) return;
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    
    const snoozedUntil = new Date();
    snoozedUntil.setHours(snoozedUntil.getHours() + hours);
    
    const updatedTask = { ...currentTask, snoozedUntil };
    
    const updatedTasks = [...tasks];
    updatedTasks.splice(currentTaskIndex, 1);
    updatedTasks.push(updatedTask);
    
    setTasks(updatedTasks);
    
    if (currentTaskIndex >= updatedTasks.length - 1) {
      setCurrentTaskIndex(0);
    }
  };

  // Add a new task
  const addTask = () => {
    if (!newTask.title) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title || '',
      description: newTask.description || '',
      priority: newTask.priority as 'low' | 'medium' | 'high' || 'medium',
      category: newTask.category as 'work' | 'personal' | 'errands' | 'other' || 'personal',
      isCompleted: false,
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: 'personal',
      isCompleted: false,
    });
    setShowAddTask(false);
  };

  // Return a completed task to the stack
  const returnToStack = (taskId: string) => {
    const task = completedTasks.find(t => t.id === taskId);
    if (!task) return;
    
    const updatedTask = { ...task, isCompleted: false, completedDate: undefined };
    setTasks([...tasks, updatedTask]);
    setCompletedTasks(completedTasks.filter(t => t.id !== taskId));
  };

  // Get priority-based styling
  const getPriorityStyles = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'low':
        return 'bg-green-100 border-green-500 text-green-700';
      default:
        return 'bg-blue-100 border-blue-500 text-blue-700';
    }
  };

  // Get category emoji
  const getCategoryEmoji = (category: string) => {
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

  // Splash screen component
  const SplashScreen = () => (
    <motion.div 
      className="fixed inset-0 bg-indigo-600 flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.5, delay: 1 }}
      onAnimationComplete={() => setShowSplash(false)}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <div className="text-white text-center">
          <motion.div 
            className="flex justify-center mb-6 relative h-32"
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.div 
              className="absolute w-20 h-28 bg-white rounded-xl shadow-xl flex items-center justify-center transform"
              initial={{ rotate: -15, x: -30 }}
              animate={{ rotate: -8, x: -40 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <span className="text-indigo-600 text-4xl">🛒</span>
            </motion.div>
            <motion.div 
              className="absolute w-20 h-28 bg-white rounded-xl shadow-xl flex items-center justify-center transform"
              initial={{ rotate: 0, y: 10 }}
              animate={{ rotate: 5, y: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            >
              <span className="text-indigo-600 text-4xl">📝</span>
            </motion.div>
            <motion.div 
              className="absolute w-20 h-28 bg-white rounded-xl shadow-xl flex items-center justify-center transform"
              initial={{ rotate: 10, x: 30 }}
              animate={{ rotate: -3, x: 40 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            >
              <span className="text-indigo-600 text-4xl">💼</span>
            </motion.div>
          </motion.div>
          <motion.h1 
            className="text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            CardStack
          </motion.h1>
          <motion.p 
            className="mt-2 text-indigo-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            One task at a time
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
      {showSplash && <SplashScreen />}
      
      <header className="bg-indigo-600 p-4 text-white text-center shadow-lg">
        <h1 className="text-2xl font-bold">CardStack</h1>
        <p className="text-sm">Focus on one task at a time</p>
      </header>

      <main className="max-w-md mx-auto p-4 min-h-[80vh] flex flex-col justify-center items-center">
        {tasks.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTask?.id}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`w-full p-6 rounded-xl shadow-xl border-t-8 ${getPriorityStyles(currentTask?.priority || 'medium')}`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl">{getCategoryEmoji(currentTask?.category || '')}</span>
                <span className="text-sm font-semibold uppercase tracking-wider">
                  {currentTask?.priority} priority
                </span>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">{currentTask?.title}</h2>
              <p className="mb-6 text-gray-700">{currentTask?.description}</p>
              
              {currentTask?.dueDate && (
                <p className="text-sm text-gray-600 mb-4">
                  Due: {currentTask.dueDate.toLocaleDateString()}
                </p>
              )}
              
              <div className="mt-4 grid grid-cols-2 gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-indigo-600 text-white font-semibold rounded-lg shadow"
                  onClick={completeTask}
                >
                  Complete
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow"
                  onClick={dismissTask}
                >
                  Dismiss
                </motion.button>
              </div>
              
              <div className="mt-2 grid grid-cols-3 gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-200 text-gray-800 text-sm rounded-lg"
                  onClick={() => snoozeTask(1)}
                >
                  +1 hour
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-200 text-gray-800 text-sm rounded-lg"
                  onClick={() => snoozeTask(3)}
                >
                  +3 hours
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-200 text-gray-800 text-sm rounded-lg"
                  onClick={() => snoozeTask(24)}
                >
                  Tomorrow
                </motion.button>
              </div>
              
              <div className="text-center text-sm text-gray-500 mt-4">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''} in your stack
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center p-8 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-2">Your stack is empty!</h2>
            <p className="text-gray-600 mb-4">Add a new task to get started.</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-indigo-600 text-white font-semibold rounded-lg shadow"
              onClick={() => setShowAddTask(true)}
            >
              Add a task
            </motion.button>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-between shadow-inner">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-indigo-100 text-indigo-700 font-semibold rounded-lg"
          onClick={() => setShowAddTask(true)}
        >
          + Add Task
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-gray-100 text-gray-700 font-semibold rounded-lg"
          onClick={() => setShowCompletedTasks(!showCompletedTasks)}
        >
          {showCompletedTasks ? 'Hide Completed' : 'Show Completed'}
        </motion.button>
      </footer>

      {/* Add Task Modal */}
      {showAddTask && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newTask.title || ''}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="Task title"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newTask.description || ''}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="Task description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value as 'work' | 'personal' | 'errands' | 'other' })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="errands">Errands</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-gray-300 text-gray-800 font-semibold rounded-lg"
                onClick={() => setShowAddTask(false)}
              >
                Cancel
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-indigo-600 text-white font-semibold rounded-lg"
                onClick={addTask}
              >
                Add Task
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Completed Tasks Drawer */}
      <AnimatePresence>
        {showCompletedTasks && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-xl shadow-lg p-4 z-40"
            style={{ maxHeight: '70vh', overflowY: 'auto', paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <h2 className="text-xl font-bold mb-4">Completed Tasks</h2>
            
            {completedTasks.length === 0 ? (
              <p className="text-gray-500 text-center p-4">No completed tasks yet</p>
            ) : (
              <div className="space-y-2">
                {completedTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="p-3 bg-gray-100 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold line-through">{task.title}</h3>
                      <p className="text-xs text-gray-500">
                        Completed: {task.completedDate?.toLocaleDateString()}
                      </p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="text-sm bg-indigo-100 text-indigo-700 p-2 rounded-lg"
                      onClick={() => returnToStack(task.id)}
                    >
                      Return to Stack
                    </motion.button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-center mt-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gray-200 text-gray-800 rounded-lg"
                onClick={() => setShowCompletedTasks(false)}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardStack;
/* eslint-enable */