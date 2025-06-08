
import React from "react";
import { Loader2, Sparkles, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimpleLoadingIndicatorProps {
  message?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SimpleLoadingIndicator: React.FC<SimpleLoadingIndicatorProps> = ({
  message = "Loading...",
  description,
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  if (size === 'lg') {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8", className)}>
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md mx-4">
          {/* App Icon with Animation */}
          <div className="relative w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <div className="relative">
              <Dumbbell className="w-10 h-10 text-white" />
              <Sparkles className="w-5 h-5 text-yellow-300 absolute -top-1 -right-1 animate-bounce" />
            </div>
          </div>

          {/* Animated Loader */}
          <div className="relative mb-6">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full animate-pulse" />
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="text-gray-800 font-bold text-xl">{message}</h3>
            {description && (
              <p className="text-gray-600 text-sm">{description}</p>
            )}
            
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
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center p-4", className)}>
      <Loader2 className={cn("animate-spin text-violet-600", sizeClasses[size])} />
      {message && (
        <p className="mt-2 text-sm font-medium text-gray-700">{message}</p>
      )}
      {description && (
        <p className="mt-1 text-xs text-gray-500 text-center">{description}</p>
      )}
    </div>
  );
};

export default SimpleLoadingIndicator;
