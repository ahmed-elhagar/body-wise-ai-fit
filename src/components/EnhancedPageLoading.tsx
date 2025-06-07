
import { Loader2, Sparkles, Dumbbell } from "lucide-react";
import { useState, useEffect } from "react";

interface EnhancedPageLoadingProps {
  title?: string;
  description?: string;
  estimatedTime?: number;
  className?: string;
}

const EnhancedPageLoading = ({ 
  title = "Loading...", 
  description = "Please wait while we fetch your data",
  estimatedTime = 3,
  className = ""
}: EnhancedPageLoadingProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing");

  const loadingSteps = [
    "Initializing",
    "Loading your data",
    "Preparing interface",
    "Almost ready"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + (100 / (estimatedTime * 10)), 95);
        
        // Update loading text based on progress
        if (newProgress < 25) setLoadingText(loadingSteps[0]);
        else if (newProgress < 50) setLoadingText(loadingSteps[1]);
        else if (newProgress < 75) setLoadingText(loadingSteps[2]);
        else setLoadingText(loadingSteps[3]);
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [estimatedTime]);

  return (
    <div className={`flex items-center justify-center min-h-[400px] w-full ${className}`}>
      <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 max-w-md mx-4">
        {/* App Icon */}
        <div className="relative w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
          <div className="relative">
            <Dumbbell className="w-8 h-8 text-white" />
            <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-bounce" />
          </div>
        </div>

        {/* Animated Loader */}
        <div className="relative mb-6">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full animate-pulse" />
        </div>

        {/* Title and Description */}
        <h3 className="text-gray-800 font-bold text-xl mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse" />
          </div>
        </div>

        {/* Dynamic Loading Text */}
        <p className="text-sm text-blue-600 font-medium mb-2">{loadingText}...</p>
        
        {/* Estimated Time */}
        <p className="text-xs text-gray-400">
          {progress < 95 ? `Estimated time: ${Math.max(1, Math.ceil((estimatedTime * (100 - progress)) / 100))}s` : "Almost done!"}
        </p>

        {/* Loading Dots Animation */}
        <div className="flex justify-center space-x-1 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedPageLoading;
