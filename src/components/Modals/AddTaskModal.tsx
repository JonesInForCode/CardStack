import { useState } from 'react';
import { motion } from 'framer-motion';
import { type PartialTask, type Priority, type Category, Priorities, Categories } from '../../types/Task';

interface AddTaskModalProps {
  onClose: () => void;
  onAddTask: (task: PartialTask) => void;
}

const AddTaskModal = ({ onClose, onAddTask }: AddTaskModalProps) => {
  const [newTask, setNewTask] = useState<PartialTask>({
    title: '',
    description: '',
    priority: Priorities.MEDIUM,
    category: Categories.PERSONAL,
    isCompleted: false,
  });

  const handleSubmit = () => {
    if (!newTask.title) return;
    
    onAddTask(newTask);
    setNewTask({
      title: '',
      description: '',
      priority: Priorities.MEDIUM,
      category: Categories.PERSONAL,
      isCompleted: false,
    });
    onClose();
  };

  return (
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
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
              className="w-full p-2 border rounded-lg"
            >
              <option value={Priorities.LOW}>Low</option>
              <option value={Priorities.MEDIUM}>Medium</option>
              <option value={Priorities.HIGH}>High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value as Category })}
              className="w-full p-2 border rounded-lg"
            >
              <option value={Categories.WORK}>Work</option>
              <option value={Categories.PERSONAL}>Personal</option>
              <option value={Categories.ERRANDS}>Errands</option>
              <option value={Categories.OTHER}>Other</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-gray-300 text-gray-800 font-semibold rounded-lg"
            onClick={onClose}
          >
            Cancel
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-indigo-600 text-white font-semibold rounded-lg"
            onClick={handleSubmit}
          >
            Add Task
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddTaskModal;