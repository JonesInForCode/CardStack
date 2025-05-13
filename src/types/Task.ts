// Enhanced type definitions with enums instead of string literals
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum Category {
  WORK = 'work',
  PERSONAL = 'personal',
  ERRANDS = 'errands',
  OTHER = 'other'
}

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
}

export type PartialTask = Partial<Task>;

// Utility functions for Task priority styling
export const getPriorityStyles = (priority: Priority): string => {
  switch (priority) {
    case Priority.HIGH:
      return 'bg-red-100 border-red-500 text-red-700';
    case Priority.MEDIUM:
      return 'bg-yellow-100 border-yellow-500 text-yellow-700';
    case Priority.LOW:
      return 'bg-green-100 border-green-500 text-green-700';
    default:
      return 'bg-blue-100 border-blue-500 text-blue-700';
  }
};

// Utility functions for Task category emoji
export const getCategoryEmoji = (category: Category): string => {
  switch (category) {
    case Category.WORK:
      return '💼';
    case Category.PERSONAL:
      return '🏠';
    case Category.ERRANDS:
      return '🛒';
    case Category.OTHER:
      return '📌';
    default:
      return '📝';
  }
};