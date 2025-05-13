import { motion } from 'framer-motion';

interface LoadingProps {
  message?: string;
}

/**
 * Loading indicator component with animation
 */
const Loading = ({ message = 'Loading your tasks...' }: LoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-40 p-6">
      <motion.div 
        className="flex space-x-2 mb-4"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, repeat: Infinity, repeatType: 'reverse' }}
      >
        <motion.div 
          className="w-4 h-16 bg-indigo-500 rounded-md"
          animate={{ 
            height: [16, 32, 16],
            y: [0, -8, 0]
          }}
          transition={{ 
            duration: 0.6,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 0
          }}
        />
        <motion.div 
          className="w-4 h-16 bg-indigo-400 rounded-md"
          animate={{ 
            height: [16, 32, 16],
            y: [0, -8, 0]
          }}
          transition={{ 
            duration: 0.6,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 0.2
          }}
        />
        <motion.div 
          className="w-4 h-16 bg-indigo-300 rounded-md"
          animate={{ 
            height: [16, 32, 16],
            y: [0, -8, 0]
          }}
          transition={{ 
            duration: 0.6,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 0.4
          }}
        />
      </motion.div>
      <span className="text-gray-500">{message}</span>
    </div>
  );
};

export default Loading;