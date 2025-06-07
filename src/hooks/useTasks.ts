import { useState, useEffect, useCallback, useRef } from 'react';
import { type Task, type PartialTask, Priorities, Categories } from '../types/Task';
import { loadTasks, loadCompletedTasks, saveTasks, saveCompletedTasks } from '../utils/storage';
import { triggerHapticFeedback } from '../utils/haptics';

// Sample tasks for demonstration
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Submit quarterly report',
    description: 'Finalize and email the Q1 progress report to the team',
    priority: Priorities.HIGH,
    category: Categories.WORK,
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Call mom',
    description: "It's her birthday next week, call to make plans",
    priority: Priorities.MEDIUM,
    category: Categories.PERSONAL,
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Pick up prescription',
    description: 'At Walgreens on Main St.',
    priority: Priorities.HIGH,
    category: Categories.ERRANDS,
    isCompleted: false,
  },
  {
    id: '4',
    title: 'Schedule dentist appointment',
    description: 'Need cleaning and check-up',
    priority: Priorities.LOW,
    category: Categories.PERSONAL,
    isCompleted: false,
  },
];

export const useTasks = () => {
  // State initialization with data from localStorage when available
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Timer for checking snoozed tasks
  const snoozeCheckTimerRef = useRef<number | null>(null);

  // Get visible tasks (tasks that aren't snoozed)
  const tasks = allTasks.filter(task => !task.snoozedUntil || task.snoozedUntil <= new Date());

  // Get current task
  const currentTask = tasks.length > 0 ? tasks[Math.min(currentTaskIndex, tasks.length - 1)] : null;

  // Load tasks from localStorage on initial render
  useEffect(() => {
    try {
      setAllTasks(loadTasks(initialTasks));
      setCompletedTasks(loadCompletedTasks());
    } catch (error) {
      console.error("Error loading tasks:", error);
      // Fallback to initial tasks if loading fails
      setAllTasks(initialTasks);
      setCompletedTasks([]);
    } finally {
      setIsLoaded(true);
      setIsLoading(false);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveTasks(allTasks);
    }
  }, [allTasks, isLoaded]);

  // Save completed tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveCompletedTasks(completedTasks);
    }
  }, [completedTasks, isLoaded]);

  // Setup interval to check for snoozed tasks that should return
  useEffect(() => {
    // Function to check for tasks that should return from being snoozed
    const checkSnoozedTasks = () => {
      const now = new Date();
      let taskReturned = false;

      setAllTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task => {
          if (task.snoozedUntil && task.snoozedUntil <= now) {
            // Task's snooze time has elapsed, remove the snoozedUntil property
            taskReturned = true;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { snoozedUntil, ...restTask } = task;
            return restTask as Task;
          }
          return task;
        });
        
        return taskReturned ? updatedTasks : prevTasks;
      });
    };

    // Set up an interval to check for snoozed tasks every minute
    snoozeCheckTimerRef.current = window.setInterval(checkSnoozedTasks, 60000);
    
    // Initial check on component mount
    checkSnoozedTasks();
    
    // Clean up timer on unmount
    return () => {
      if (snoozeCheckTimerRef.current !== null) {
        window.clearInterval(snoozeCheckTimerRef.current);
      }
    };
  }, []);

  // Handle task completion - Memoized with useCallback
  const completeTask = useCallback(() => {
    if (!currentTask) return;
    
    // Add haptic feedback
    triggerHapticFeedback('complete');
    
    const updatedTask = { ...currentTask, isCompleted: true, completedDate: new Date() };
    setCompletedTasks(prevCompletedTasks => [updatedTask, ...prevCompletedTasks]);
    
    setAllTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(task => task.id !== currentTask.id);
      return updatedTasks;
    });
    
    setCurrentTaskIndex(prevIndex => {
      return Math.max(0, Math.min(prevIndex, tasks.length - 2)); // -2 because we're removing a task
    });
  }, [currentTask, tasks.length]);

  // Handle task dismissal (send to bottom of stack) - Memoized with useCallback
  const dismissTask = useCallback(() => {
    if (!currentTask || tasks.length <= 1) return;
    
    // Add haptic feedback
    triggerHapticFeedback('dismiss');
    
    setAllTasks(prevTasks => {
      // Find the task in the original allTasks array
      const taskIndex = prevTasks.findIndex(task => task.id === currentTask.id);
      if (taskIndex === -1) return prevTasks;
      
      // Create a copy of the tasks array
      const updatedTasks = [...prevTasks];
      
      // Move the current task to the end of the array
      const [movedTask] = updatedTasks.splice(taskIndex, 1);
      updatedTasks.push(movedTask);
      
      return updatedTasks;
    });
    
    setCurrentTaskIndex(prevIndex => {
      // If we're at the last task, go back to the first one
      if (prevIndex >= tasks.length - 1) {
        return 0;
      }
      // Otherwise, stay at the same index (the next task will now be here)
      return prevIndex;
    });
  }, [currentTask, tasks.length]);

  // Handle task snoozing - Memoized with useCallback
  const snoozeTask = useCallback((hours: number) => {
    if (!currentTask) return;
    
    // Add haptic feedback
    triggerHapticFeedback('snooze');
    
    // Calculate snooze until time
    const snoozedUntil = new Date();
    snoozedUntil.setHours(snoozedUntil.getHours() + hours);
    
    setAllTasks(prevTasks => {
      return prevTasks.map(task => {
        // Find the current task and add snoozedUntil
        if (task.id === currentTask.id) {
          return { ...task, snoozedUntil };
        }
        return task;
      });
    });
    
    // After snoozing, make sure we show the next non-snoozed task
    setCurrentTaskIndex(prevIndex => {
      // Calculate how many visible tasks will remain after snoozing
      const visibleTasksAfterSnooze = tasks.filter(
        task => task.id !== currentTask.id && (!task.snoozedUntil || task.snoozedUntil <= new Date())
      );
      
      // If no tasks remain visible, return 0
      if (visibleTasksAfterSnooze.length === 0) {
        return 0;
      }
      
      // If we're at the last task, go back to the first one
      if (prevIndex >= visibleTasksAfterSnooze.length) {
        return 0;
      }
      
      // Otherwise, stay at the same index (the next visible task will now be here)
      return prevIndex;
    });
  }, [currentTask, tasks]);

  // Add a new task - Memoized with useCallback
  const addTask = useCallback((newTask: PartialTask) => {
    if (!newTask.title) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title || '',
      description: newTask.description || '',
      priority: newTask.priority || Priorities.MEDIUM,
      category: newTask.category || Categories.PERSONAL,
      isCompleted: false,
      dueDate: newTask.dueDate,
    };
    
    setAllTasks(prevTasks => [...prevTasks, task]);
  }, []);

  // Return a completed task to the stack - Memoized with useCallback
  const returnToStack = useCallback((taskId: string) => {
    const task = completedTasks.find(t => t.id === taskId);
    if (!task) return;
    
    const updatedTask = { ...task, isCompleted: false, completedDate: undefined };
    
    setAllTasks(prevTasks => [...prevTasks, updatedTask]);
    setCompletedTasks(prevCompletedTasks => 
      prevCompletedTasks.filter(t => t.id !== taskId)
    );
  }, [completedTasks]);

  // Delete a completed task - New function added for deleting completed tasks
  const deleteCompletedTask = useCallback((taskId: string) => {
    // Add haptic feedback for delete
    triggerHapticFeedback('dismiss');
    
    // Remove the task from completedTasks
    setCompletedTasks(prevCompletedTasks => 
      prevCompletedTasks.filter(task => task.id !== taskId)
    );
  }, []);

  // Shuffle the task deck - Fisher-Yates algorithm
  const shuffleDeck = useCallback(() => {
    if (tasks.length <= 1) return; // No need to shuffle 0 or 1 tasks
    
    // Add haptic feedback for shuffle
    triggerHapticFeedback('shuffle');
    
    setAllTasks(prevTasks => {
      // Make a copy of the array
      const shuffledTasks = [...prevTasks];
      
      // Fisher-Yates shuffle algorithm
      for (let i = shuffledTasks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledTasks[i], shuffledTasks[j]] = [shuffledTasks[j], shuffledTasks[i]];
      }
      
      return shuffledTasks;
    });
    
    // Reset to the first task in the newly shuffled deck
    setCurrentTaskIndex(0);
  }, [tasks.length]);

  // Get snoozed tasks
  const snoozedTasks = allTasks.filter(
    task => task.snoozedUntil && task.snoozedUntil > new Date()
  );
  
  const snoozedTasksCount = snoozedTasks.length;
  
  // Unsnooze a task (remove its snoozedUntil property)
  const unsnoozeTask = useCallback((taskId: string) => {
    setAllTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === taskId) {
          // Remove the snoozedUntil property
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { snoozedUntil, ...restTask } = task;
          return restTask as Task;
        }
        return task;
      });
    });
  }, []);

  // Add subtask to a main task
const addSubtask = useCallback((parentTaskId: string, subtask: PartialTask) => {
  if (!subtask.title) return;
  
  const newSubtask: Task = {
    id: `${parentTaskId}-sub-${Date.now()}`,
    title: subtask.title || '',
    description: subtask.description || '',
    priority: subtask.priority || Priorities.MEDIUM,
    category: subtask.category || Categories.PERSONAL,
    isCompleted: false,
    isSubtask: true,
    parentTaskId: parentTaskId,
  };
  
  setAllTasks(prevTasks => 
    prevTasks.map(task => {
      if (task.id === parentTaskId) {
        const updatedSubtasks = [...(task.subtasks || []), newSubtask];
        return {
          ...task,
          hasSubtasks: true,
          subtasks: updatedSubtasks
        };
      }
      return task;
    })
  );
}, []);

// Complete a subtask
const completeSubtask = useCallback((parentTaskId: string, subtaskId: string) => {
  triggerHapticFeedback('complete');
  
  setAllTasks(prevTasks =>
    prevTasks.map(task => {
      if (task.id === parentTaskId && task.subtasks) {
        const updatedSubtasks = task.subtasks.map(st =>
          st.id === subtaskId ? { ...st, isCompleted: true } : st
        );
        return {
          ...task,
          subtasks: updatedSubtasks
        };
      }
      return task;
    })
  );
}, []);

// Cancel (remove) a subtask
const cancelSubtask = useCallback((parentTaskId: string, subtaskId: string) => {
  triggerHapticFeedback('dismiss');
  
  setAllTasks(prevTasks =>
    prevTasks.map(task => {
      if (task.id === parentTaskId && task.subtasks) {
        const updatedSubtasks = task.subtasks.filter(st => st.id !== subtaskId);
        return {
          ...task,
          subtasks: updatedSubtasks,
          hasSubtasks: updatedSubtasks.length > 0
        };
      }
      return task;
    })
  );
}, []);

// Upgrade subtask to main task
const upgradeSubtaskToTask = useCallback((parentTaskId: string, subtaskId: string) => {
  const parentTask = allTasks.find(t => t.id === parentTaskId);
  const subtask = parentTask?.subtasks?.find(st => st.id === subtaskId);
  
  if (!subtask) return;
  
  // Remove from parent's subtasks
  cancelSubtask(parentTaskId, subtaskId);
  
  // Add as main task
  const upgradedTask: Task = {
    ...subtask,
    id: Date.now().toString(),
    isSubtask: false,
    parentTaskId: undefined,
  };
  
  setAllTasks(prevTasks => [...prevTasks, upgradedTask]);
}, [allTasks, cancelSubtask]);

// Navigation methods
const navigateToPrevious = useCallback(() => {
  setCurrentTaskIndex(prevIndex => {
    if (prevIndex > 0) {
      return prevIndex - 1;
    }
    return prevIndex;
  });
}, []);

const navigateToNext = useCallback(() => {
  setCurrentTaskIndex(prevIndex => {
    // Note: Don't use tasks.length here as it's the filtered list
    // The currentTaskIndex management should be handled by the component using this hook
    return prevIndex + 1;
  });
}, []);

  return {
    tasks,
    completedTasks,
    currentTask,
    currentTaskIndex,
    isLoading,
    snoozedTasks,
    snoozedTasksCount,
    setCurrentTaskIndex,
    completeTask,
    dismissTask,
    snoozeTask,
    unsnoozeTask,
    addTask,
    returnToStack,
    deleteCompletedTask,
    shuffleDeck,
    addSubtask,
    completeSubtask,
    cancelSubtask,
    upgradeSubtaskToTask,
    navigateToPrevious,
    navigateToNext
  };
};