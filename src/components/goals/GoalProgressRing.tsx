
import { useI18n } from "@/hooks/useI18n";

interface GoalProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  color?: string;
}

const GoalProgressRing = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  children,
  color = "#3b82f6"
}: GoalProgressRingProps) => {
  const { t } = useI18n();
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const isGoldRing = progress >= 90;
  const ringColor = isGoldRing ? "#fbbf24" : color;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
        {/* Completion glow effect */}
        {isGoldRing && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#fbbf24"
            strokeWidth={strokeWidth / 2}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="opacity-50 animate-pulse"
          />
        )}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (
          <div className="text-center">
            <div className={`text-2xl font-bold ${isGoldRing ? 'text-yellow-600' : 'text-gray-800'}`}>
              {Math.round(progress)}%
            </div>
            {isGoldRing && (
              <div className="text-xs text-yellow-600 font-medium">
                {t('common:excellent') || 'Excellent!'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalProgressRing;
