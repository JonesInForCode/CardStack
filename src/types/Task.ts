export type Priority = 'low' | 'medium' | 'high';
export type Category = 'work' | 'personal' | 'errands' | 'other';

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

// Utility functions for Task category emoji
export const getCategoryEmoji = (category: Category): string => {
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