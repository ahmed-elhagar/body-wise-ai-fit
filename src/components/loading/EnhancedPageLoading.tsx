
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2, Activity, Users, Target, TrendingUp } from "lucide-react";

interface EnhancedPageLoadingProps {
  title?: string;
  subtitle?: string;
  estimatedTime?: number;
  steps?: string[];
}

const EnhancedPageLoading = ({ 
  title = "Loading",
  subtitle = "Please wait...",
  estimatedTime = 3,
  steps = [
    "Initializing dashboard",
    "Loading user profile", 
    "Fetching latest data",
    "Preparing interface"
  ]
}: EnhancedPageLoadingProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        const increment = Math.random() * 15 + 5;
        return Math.min(prev + increment, 95);
      });
    }, 150);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, estimatedTime * 250);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [estimatedTime, steps.length]);

  const icons = [Activity, Users, Target, TrendingUp];
  const IconComponent = icons[currentStep % icons.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-8">
          {/* Animated Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3 mb-6">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{Math.round(progress)}%</span>
              <span>~{estimatedTime}s</span>
            </div>
          </div>

          {/* Current Step */}
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">{steps[currentStep]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { EnhancedPageLoading };
