import { useState, useEffect } from 'react';
import { type Task, type PartialTask } from '../types/Task';
import { loadTasks, loadCompletedTasks, saveTasks, saveCompletedTasks } from '../utils/storage';

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
    title: 'Call mom',
    description: "It's her birthday next week, call to make plans",
    priority: 'medium',
    category: 'personal',
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Pick up prescription',
    description: 'At Walgreens on Main St.',
    priority: 'high',
    category: 'errands',
    isCompleted: false,
  },
  {
    id: '4',
    title: 'Schedule dentist appointment',
    description: 'Need cleaning and check-up',
    priority: 'low',
    category: 'personal',
    isCompleted: false,
  },
];

export const useTasks = () => {
  // State initialization with data from localStorage when available
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    setTasks(loadTasks(initialTasks));
    setCompletedTasks(loadCompletedTasks());
    setIsLoaded(true);
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
  const addTask = (newTask: PartialTask) => {
    if (!newTask.title) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title || '',
      description: newTask.description || '',
      priority: newTask.priority || 'medium',
      category: newTask.category || 'personal',
      isCompleted: false,
      dueDate: newTask.dueDate,
    };
    
    setTasks([...tasks, task]);
  };

  // Return a completed task to the stack
  const returnToStack = (taskId: string) => {
    const task = completedTasks.find(t => t.id === taskId);
    if (!task) return;
    
    const updatedTask = { ...task, isCompleted: false, completedDate: undefined };
    setTasks([...tasks, updatedTask]);
    setCompletedTasks(completedTasks.filter(t => t.id !== taskId));
  };

  return {
    tasks,
    completedTasks,
    currentTask,
    currentTaskIndex,
    setCurrentTaskIndex,
    completeTask,
    dismissTask,
    snoozeTask,
    addTask,
    returnToStack,
  };
};