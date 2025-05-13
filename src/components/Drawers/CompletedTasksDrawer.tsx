import { motion } from 'framer-motion';
import { type Task } from '../../types/Task';

interface CompletedTasksDrawerProps {
  completedTasks: Task[];
  onClose: () => void;
  onReturnToStack: (taskId: string) => void;
}

const CompletedTasksDrawer = ({ 
  completedTasks, 
  onClose, 
  onReturnToStack 
}: CompletedTasksDrawerProps) => {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 bg-white rounded-t-xl shadow-lg p-4 z-40"
      style={{ 
        maxHeight: '70vh', 
        overflowY: 'auto', 
        paddingBottom: 'env(safe-area-inset-bottom)' 
      }}
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
                onClick={() => onReturnToStack(task.id)}
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
          onClick={onClose}
        >
          Close
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CompletedTasksDrawer;