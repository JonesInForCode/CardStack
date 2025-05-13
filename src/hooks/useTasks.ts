import { useState, useEffect, useCallback } from 'react';
import { type Task, type PartialTask, type Priority, type Category, Priorities, Categories } from '../types/Task';
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get current task
  const currentTask = tasks[currentTaskIndex];

  // Load tasks from localStorage on initial render
  useEffect(() => {
    try {
      setTasks(loadTasks(initialTasks));
      setCompletedTasks(loadCompletedTasks());
    } catch (error) {
      console.error("Error loading tasks:", error);
      // Fallback to initial tasks if loading fails
      setTasks(initialTasks);
      setCompletedTasks([]);
    } finally {
      setIsLoaded(true);
      setIsLoading(false);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveTasks(tasks);
    }
  }, [tasks, isLoaded]);

  // Save completed tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveCompletedTasks(completedTasks);
    }
  }, [completedTasks, isLoaded]);

  // Process snoozed tasks whenever tasks are loaded or changed
  useEffect(() => {
    if (tasks.length > 0) {
      const now = new Date();
      const updatedTasks = tasks.map(task => {
        if (task.snoozedUntil && task.snoozedUntil <= now) {
          // Remove the snoozedUntil property if the snooze time has passed
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Handle task completion - Memoized with useCallback
  const completeTask = useCallback(() => {
    if (!currentTask) return;
    
    // Add haptic feedback
    triggerHapticFeedback('complete');
    
    const updatedTask = { ...currentTask, isCompleted: true, completedDate: new Date() };
    setCompletedTasks(prevCompletedTasks => [updatedTask, ...prevCompletedTasks]);
    
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(task => task.id !== currentTask.id);
      return updatedTasks;
    });
    
    setCurrentTaskIndex(prevIndex => {
      const updatedTasks = tasks.filter(task => task.id !== currentTask.id);
      return Math.max(0, Math.min(prevIndex, updatedTasks.length - 1));
    });
  }, [currentTask, tasks]);

  // Handle task dismissal (send to bottom of stack) - Memoized with useCallback
  const dismissTask = useCallback(() => {
    if (!currentTask || tasks.length <= 1) return;
    
    // Add haptic feedback
    triggerHapticFeedback('dismiss');
    
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks];
      updatedTasks.push(updatedTasks.splice(currentTaskIndex, 1)[0]);
      return updatedTasks;
    });
    
    setCurrentTaskIndex(prevIndex => {
      if (prevIndex >= tasks.length - 1) {
        return 0;
      }
      return prevIndex;
    });
  }, [currentTask, currentTaskIndex, tasks.length]);

  // Handle task snoozing - Memoized with useCallback
  const snoozeTask = useCallback((hours: number) => {
    if (!currentTask) return;
    
    // Add haptic feedback
    triggerHapticFeedback('snooze');
    
    const snoozedUntil = new Date();
    snoozedUntil.setHours(snoozedUntil.getHours() + hours);
    
    const updatedTask = { ...currentTask, snoozedUntil };
    
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks];
      updatedTasks.splice(currentTaskIndex, 1);
      updatedTasks.push(updatedTask);
      return updatedTasks;
    });
    
    setCurrentTaskIndex(prevIndex => {
      if (prevIndex >= tasks.length - 1) {
        return 0;
      }
      return prevIndex;
    });
  }, [currentTask, currentTaskIndex, tasks.length]);

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
    
    setTasks(prevTasks => [...prevTasks, task]);
  }, []);

  // Return a completed task to the stack - Memoized with useCallback
  const returnToStack = useCallback((taskId: string) => {
    const task = completedTasks.find(t => t.id === taskId);
    if (!task) return;
    
    const updatedTask = { ...task, isCompleted: false, completedDate: undefined };
    
    setTasks(prevTasks => [...prevTasks, updatedTask]);
    setCompletedTasks(prevCompletedTasks => 
      prevCompletedTasks.filter(t => t.id !== taskId)
    );
  }, [completedTasks]);

  return {
    tasks,
    completedTasks,
    currentTask,
    currentTaskIndex,
    isLoading,
    setCurrentTaskIndex,
    completeTask,
    dismissTask,
    snoozeTask,
    addTask,
    returnToStack,
  };
};