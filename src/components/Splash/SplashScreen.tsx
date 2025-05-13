import { motion } from 'framer-motion';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

const SplashScreen = ({ onAnimationComplete }: SplashScreenProps) => (
  <motion.div 
    className="fixed inset-0 bg-indigo-600 flex items-center justify-center z-50"
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    transition={{ duration: 1.5, delay: 1 }}
    onAnimationComplete={onAnimationComplete}
  >
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <div className="text-white text-center">
        <motion.div 
          className="flex justify-center mb-6 relative h-32"
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <motion.div 
            className="absolute w-20 h-28 bg-white rounded-xl shadow-xl flex items-center justify-center transform"
            initial={{ rotate: -15, x: -30 }}
            animate={{ rotate: -8, x: -40 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <span className="text-indigo-600 text-4xl">🛒</span>
          </motion.div>
          <motion.div 
            className="absolute w-20 h-28 bg-white rounded-xl shadow-xl flex items-center justify-center transform"
            initial={{ rotate: 0, y: 10 }}
            animate={{ rotate: 5, y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
          >
            <span className="text-indigo-600 text-4xl">📝</span>
          </motion.div>
          <motion.div 
            className="absolute w-20 h-28 bg-white rounded-xl shadow-xl flex items-center justify-center transform"
            initial={{ rotate: 10, x: 30 }}
            animate={{ rotate: -3, x: 40 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          >
            <span className="text-indigo-600 text-4xl">💼</span>
          </motion.div>
        </motion.div>
        <motion.h1 
          className="text-4xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          CardStack
        </motion.h1>
        <motion.p 
          className="mt-2 text-indigo-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          One task at a time
        </motion.p>
      </div>
    </motion.div>
  </motion.div>
);

export default SplashScreen;