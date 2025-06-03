
import React, { useState, useEffect } from 'react';
import AILoadingDialog from './ai-loading-dialog';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoadingStep {
  id: string;
  label: string;
  duration: number;
}

interface EnhancedPageLoadingProps {
  isLoading: boolean;
  type: 'dashboard' | 'exercise' | 'meal-plan' | 'profile';
  title?: string;
  description?: string;
  customSteps?: LoadingStep[];
  timeout?: number;
}

const EnhancedPageLoading = ({
  isLoading,
  type,
  title,
  description,
  customSteps,
  timeout = 10000
}: EnhancedPageLoadingProps) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [startTime] = useState(Date.now());

  const defaultSteps = {
    dashboard: [
      { id: 'auth', label: 'Verifying your account...', duration: 1500 },
      { id: 'profile', label: 'Loading your profile...', duration: 1500 },
      { id: 'stats', label: 'Calculating your progress...', duration: 1200 },
      { id: 'data', label: 'Fetching latest data...', duration: 1200 },
      { id: 'ui', label: 'Preparing your dashboard...', duration: 800 }
    ],
    exercise: [
      { id: 'program', label: 'Loading your exercise program...', duration: 1500 },
      { id: 'progress', label: 'Calculating workout progress...', duration: 1200 },
      { id: 'schedule', label: 'Preparing workout schedule...', duration: 1000 },
      { id: 'exercises', label: 'Loading exercise details...', duration: 800 },
      { id: 'ui', label: 'Setting up your workout view...', duration: 500 }
    ],
    'meal-plan': [
      { id: 'plan', label: 'Loading your meal plan...', duration: 1200 },
      { id: 'nutrition', label: 'Calculating nutrition data...', duration: 1500 },
      { id: 'preferences', label: 'Applying your preferences...', duration: 1000 },
      { id: 'ui', label: 'Preparing meal view...', duration: 800 }
    ],
    profile: [
      { id: 'data', label: 'Loading your profile data...', duration: 1200 },
      { id: 'settings', label: 'Applying your settings...', duration: 1000 },
      { id: 'ui', label: 'Preparing profile view...', duration: 600 }
    ]
  };

  const steps = customSteps || defaultSteps[type];

  const defaultTitles = {
    dashboard: 'Loading Dashboard',
    exercise: 'Loading Exercise Program',
    'meal-plan': 'Loading Meal Plan',
    profile: 'Loading Profile'
  };

  const defaultDescriptions = {
    dashboard: 'Setting up your personalized dashboard with the latest data',
    exercise: 'Preparing your workout program and progress tracking',
    'meal-plan': 'Loading your personalized meal plan and nutrition data',
    profile: 'Fetching your profile information and preferences'
  };

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      setProgress(0);
      setHasTimedOut(false);
      return;
    }

    console.log('🔄 Enhanced loading started:', { type, timeout });

    let timeoutTriggered = false;
    
    // Timeout protection
    const timeoutHandler = setTimeout(() => {
      if (!timeoutTriggered) {
        timeoutTriggered = true;
        console.error('⏰ Loading timeout reached for', type);
        setHasTimedOut(true);
        setProgress(100);
      }
    }, timeout);

    // Simplified progress simulation
    const interval = setInterval(() => {
      if (timeoutTriggered) {
        clearInterval(interval);
        return;
      }

      const elapsed = Date.now() - startTime;
      const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);
      
      // Calculate which step we should be on
      let cumulativeTime = 0;
      let newStep = 0;
      
      for (let i = 0; i < steps.length; i++) {
        cumulativeTime += steps[i].duration;
        if (elapsed < cumulativeTime) {
          newStep = i;
          break;
        }
        newStep = Math.min(i + 1, steps.length - 1);
      }
      
      // Update step
      if (newStep !== currentStep && newStep < steps.length) {
        setCurrentStep(newStep);
        console.log('📈 Step progress:', newStep, steps[newStep]?.label);
      }

      // Update progress (cap at 90% to show it's still loading)
      const newProgress = Math.min((elapsed / totalDuration) * 90, 90);
      setProgress(newProgress);

      // Complete if we've gone through all steps
      if (elapsed >= totalDuration) {
        setProgress(90);
        clearInterval(interval);
      }
    }, 200); // More frequent updates for smoother progress

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutHandler);
      console.log('🔄 Loading cleanup for', type);
    };
  }, [isLoading, type, timeout, startTime, steps, currentStep]);

  if (!isLoading) return null;

  const dialogSteps = steps.map((step, index) => ({
    id: step.id,
    label: step.label,
    status: index < currentStep ? 'completed' as const : 
            index === currentStep ? 'active' as const : 'pending' as const
  }));

  const currentMessage = hasTimedOut 
    ? 'Loading is taking longer than expected...'
    : steps[currentStep]?.label || 'Loading...';

  const currentDescription = hasTimedOut
    ? 'The system is working to complete your request. Please wait a moment longer.'
    : description || defaultDescriptions[type];

  return (
    <AILoadingDialog
      open={true}
      status={hasTimedOut ? "error" : "loading"}
      title={title || defaultTitles[type]}
      message={currentMessage}
      description={currentDescription}
      steps={dialogSteps}
      progress={progress}
      allowClose={false}
    />
  );
};

export default EnhancedPageLoading;
