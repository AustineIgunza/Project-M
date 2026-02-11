import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="mb-8"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full mx-auto"></div>
        </motion.div>
        
        <motion.h1
          className="text-4xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          LearnForge
        </motion.h1>
        
        <motion.p
          className="text-xl text-blue-200 animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Initializing your learning adventure...
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingScreen;
