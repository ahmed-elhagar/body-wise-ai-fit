
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dumbbell, Sparkles } from 'lucide-react';

interface EnhancedPageLoadingProps {
  title?: string;
  description?: string;
  estimatedTime?: number; // in seconds
}

const EnhancedPageLoading: React.FC<EnhancedPageLoadingProps> = ({
  title = "Loading FitFatta",
  description = "Preparing your fitness experience...",
  estimatedTime = 3
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Initializing application...",
    "Loading your profile...",
    "Preparing dashboard...",
    "Almost ready!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + (100 / (estimatedTime * 10)), 100);
        const stepIndex = Math.floor((newProgress / 100) * steps.length);
        setCurrentStep(Math.min(stepIndex, steps.length - 1));
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [estimatedTime, steps.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <div className="p-8 text-center">
          {/* Animated Logo */}
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <Dumbbell className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-bounce" />
            </div>
          </div>

          {/* Title and Description */}
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {title}
          </h2>
          <p className="text-gray-600 mb-8">
            {description}
          </p>

          {/* Progress Bar */}
          <div className="space-y-4">
            <Progress 
              value={progress} 
              className="h-3 bg-gray-200"
            />
            
            {/* Current Step */}
            <p className="text-sm text-gray-500 animate-pulse">
              {steps[currentStep]}
            </p>
            
            {/* Progress Percentage */}
            <p className="text-xs text-gray-400">
              {Math.round(progress)}% complete
            </p>
          </div>

          {/* Loading Animation */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedPageLoading;
