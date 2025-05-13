import type { Task } from '../types/Task';

// Keys for localStorage
const TASKS_STORAGE_KEY = 'cardstack_tasks';
const COMPLETED_TASKS_STORAGE_KEY = 'cardstack_completed_tasks';

/**
 * Loads tasks from localStorage
 * @param initialTasks Default tasks to use if none are found
 * @returns Array of tasks
 */
export const loadTasks = (initialTasks: Task[] = []): Task[] => {
  const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
  
  if (savedTasks) {
    try {
      // Parse the saved tasks
      const parsed = JSON.parse(savedTasks);
      
      // Convert string dates back to Date objects
      return parsed.map((task: Task) => ({
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

/**
 * Loads completed tasks from localStorage
 * @returns Array of completed tasks
 */
export const loadCompletedTasks = (): Task[] => {
  const savedTasks = localStorage.getItem(COMPLETED_TASKS_STORAGE_KEY);
  
  if (savedTasks) {
    try {
      // Parse the saved tasks
      const parsed = JSON.parse(savedTasks);
      
      // Convert string dates back to Date objects
      return parsed.map((task: Task) => ({
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

/**
 * Saves tasks to localStorage
 * @param tasks Tasks to save
 */
export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

/**
 * Saves completed tasks to localStorage
 * @param tasks Completed tasks to save
 */
export const saveCompletedTasks = (tasks: Task[]): void => {
  localStorage.setItem(COMPLETED_TASKS_STORAGE_KEY, JSON.stringify(tasks));
};