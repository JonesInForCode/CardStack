import { motion } from 'framer-motion';
import { type Task, getPriorityStyles, getCategoryEmoji } from '../../types/Task';

interface TaskCardProps {
  task: Task;
  taskCount: number;
  onComplete: () => void;
  onDismiss: () => void;
  onSnooze: (hours: number) => void;
}

const TaskCard = ({ 
  task, 
  taskCount, 
  onComplete, 
  onDismiss, 
  onSnooze 
}: TaskCardProps) => {
  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`w-full p-6 rounded-xl shadow-xl border-t-8 ${getPriorityStyles(task.priority)}`}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl">{getCategoryEmoji(task.category)}</span>
        <span className="text-sm font-semibold uppercase tracking-wider">
          {task.priority} priority
        </span>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
      <p className="mb-6 text-gray-700">{task.description}</p>
      
      {task.dueDate && (
        <p className="text-sm text-gray-600 mb-4">
          Due: {task.dueDate.toLocaleDateString()}
        </p>
      )}
      
      <div className="mt-4 grid grid-cols-2 gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-indigo-600 text-white font-semibold rounded-lg shadow"
          onClick={onComplete}
        >
          Complete
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow"
          onClick={onDismiss}
        >
          Dismiss
        </motion.button>
      </div>
      
      <div className="mt-2 grid grid-cols-3 gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-gray-200 text-gray-800 text-sm rounded-lg"
          onClick={() => onSnooze(1)}
        >
          +1 hour
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-gray-200 text-gray-800 text-sm rounded-lg"
          onClick={() => onSnooze(3)}
        >
          +3 hours
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-gray-200 text-gray-800 text-sm rounded-lg"
          onClick={() => onSnooze(24)}
        >
          Tomorrow
        </motion.button>
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-4">
        {taskCount} task{taskCount !== 1 ? 's' : ''} in your stack
      </div>
    </motion.div>
  );
};

export default TaskCard;