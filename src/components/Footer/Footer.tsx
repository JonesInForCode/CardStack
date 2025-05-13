import { motion } from 'framer-motion';

interface FooterProps {
  onAddTask: () => void;
  onToggleCompletedTasks: () => void;
  showCompletedTasks: boolean;
}

const Footer = ({ 
  onAddTask, 
  onToggleCompletedTasks, 
  showCompletedTasks 
}: FooterProps) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-between shadow-inner">
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="p-3 bg-indigo-100 text-indigo-700 font-semibold rounded-lg"
        onClick={onAddTask}
      >
        + Add Task
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="p-3 bg-gray-100 text-gray-700 font-semibold rounded-lg"
        onClick={onToggleCompletedTasks}
      >
        {showCompletedTasks ? 'Hide Completed' : 'Show Completed'}
      </motion.button>
    </footer>
  );
};

export default Footer;