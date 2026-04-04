// Using string literal types instead of enums for erasableSyntaxOnly compatibility
export type Priority = 'low' | 'medium' | 'high';
export type Category = 'work' | 'personal' | 'errands' | 'other';

// Constants for type-safe usage
export const Priorities = {
  LOW: 'low' as Priority,
  MEDIUM: 'medium' as Priority,
  HIGH: 'high' as Priority
} as const;

export const Categories = {
  WORK: 'work' as Category,
  PERSONAL: 'personal' as Category,
  ERRANDS: 'errands' as Category,
  OTHER: 'other' as Category
} as const;

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  dueDate?: Date;
  completedDate?: Date;
  snoozedUntil?: Date;
  isCompleted: boolean;
  hasSubtasks?: boolean;
  subtasks?: Task[];
  parentTaskId?: string;
  isSubtask?: boolean;
}

export type PartialTask = Partial<Task>;

// Utility functions for Task priority styling
export const getPriorityStyles = (priority: Priority): string => {
  switch (priority) {
    case Priorities.HIGH:
      return 'bg-red-100 border-red-500 text-red-700';
    case Priorities.MEDIUM:
      return 'bg-yellow-100 border-yellow-500 text-yellow-700';
    case Priorities.LOW:
      return 'bg-green-100 border-green-500 text-green-700';
    default:
      return 'bg-blue-100 border-blue-500 text-blue-700';
  }
};

// Utility functions for Task category emoji
export const getCategoryEmoji = (category: Category): string => {
  switch (category) {
    case Categories.WORK:
      return '💼';
    case Categories.PERSONAL:
      return '🏠';
    case Categories.ERRANDS:
      return '🛒';
    case Categories.OTHER:
      return '📌';
    default:
      return '📝';
  }
};

/**
 * Checks if a task has any active (incomplete) subtasks.
 * Recursively checks subtasks if nested subtasks are implemented in the future.
 */
export const hasActiveSubtasks = (task: Task): boolean => {
  if (!task.hasSubtasks || !task.subtasks || task.subtasks.length === 0) {
    return false;
  }

  return task.subtasks.some((subtask) => {
    if (!subtask.isCompleted) return true;
    
    // Recursive check for nested subtasks
    if (subtask.hasSubtasks && subtask.subtasks) {
      return hasActiveSubtasks(subtask);
    }
    
    return false;
  });
};

/**
 * Recursively converts string dates in a task and its subtasks back to Date objects.
 * This is used when loading tasks from localStorage.
 */
export const hydrateTaskDates = (task: Task): Task => {
  const hydratedTask = {
    ...task,
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    completedDate: task.completedDate ? new Date(task.completedDate) : undefined,
    snoozedUntil: task.snoozedUntil ? new Date(task.snoozedUntil) : undefined,
  };

  if (hydratedTask.subtasks && hydratedTask.subtasks.length > 0) {
    hydratedTask.subtasks = hydratedTask.subtasks.map(hydrateTaskDates);
  }

  return hydratedTask;
};