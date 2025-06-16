
import { motion } from "framer-motion";

interface AnimatedProgressRingProps {
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  size?: number;
  strokeWidth?: number;
}

export const AnimatedProgressRing = ({ 
  completedExercises, 
  totalExercises, 
  progressPercentage,
  size = 80,
  strokeWidth = 8
}: AnimatedProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className={`relative`} style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-blue-600"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Center Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="text-sm font-bold text-blue-600"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {Math.round(progressPercentage)}%
          </motion.div>
          <div className="text-xs text-gray-500">
            {completedExercises}/{totalExercises}
          </div>
        </div>
      </div>
    </div>
  );
};
