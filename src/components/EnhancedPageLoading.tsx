
import { useEffect, useState } from "react";
import MotivationalContent from "./loading/MotivationalContent";
import MealPlanMotivationalContent from "@/features/meal-plan/components/loading/MealPlanMotivationalContent";

interface EnhancedPageLoadingProps {
  title?: string;
  description?: string;
  estimatedTime?: number;
  className?: string;
}

const EnhancedPageLoading = ({ 
  estimatedTime = 5,
  className = ""
}: EnhancedPageLoadingProps) => {
  const [progress, setProgress] = useState(0);
  const [pageTheme, setPageTheme] = useState<'default' | 'meal-plan'>('default');

  useEffect(() => {
    if (window.location.pathname.includes('/meal-plan')) {
      setPageTheme('meal-plan');
    } else {
      setPageTheme('default');
    }
  }, []);

  useEffect(() => {
    if (progress >= 100) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          // Slow down progress at the end
          return Math.min(prev + 0.5, 100);
        }
        return Math.min(prev + (100 / (estimatedTime * 10)), 95);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [estimatedTime, progress]);
  
  const renderMotivationalContent = () => {
    if (pageTheme === 'meal-plan') {
      return <MealPlanMotivationalContent />;
    }
    return <MotivationalContent />;
  };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 ${className}`}>
      <div className="w-full max-w-md text-center">
        {renderMotivationalContent()}

        <div className="mt-12 w-full space-y-4">
          <div className="bg-white/10 rounded-full h-2 w-full">
            <div
              className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-300 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm font-medium text-white/80">
            {progress < 100 ? `Loading... ${Math.round(progress)}%` : "All set!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPageLoading;
