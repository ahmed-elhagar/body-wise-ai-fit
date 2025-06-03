
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
  timeout = 15000
}: EnhancedPageLoadingProps) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  const defaultSteps = {
    dashboard: [
      { id: 'auth', label: 'Verifying your account...', duration: 1500 },
      { id: 'profile', label: 'Loading your profile...', duration: 1800 },
      { id: 'stats', label: 'Calculating your progress...', duration: 1500 },
      { id: 'data', label: 'Fetching latest data...', duration: 1200 },
      { id: 'ui', label: 'Preparing your dashboard...', duration: 800 }
    ],
    exercise: [
      { id: 'program', label: 'Loading your exercise program...', duration: 1500 },
      { id: 'progress', label: 'Calculating workout progress...', duration: 1200 },
      { id: 'schedule', label: 'Preparing workout schedule...', duration: 1000 },
      { id: 'exercises', label: 'Loading exercise details...', duration: 900 },
      { id: 'ui', label: 'Setting up your workout view...', duration: 600 }
    ],
    'meal-plan': [
      { id: 'plan', label: 'Loading your meal plan...', duration: 1200 },
      { id: 'nutrition', label: 'Calculating nutrition data...', duration: 1500 },
      { id: 'preferences', label: 'Applying your preferences...', duration: 1000 },
      { id: 'ui', label: 'Preparing meal view...', duration: 700 }
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

    console.log('🔄 Starting enhanced loading progress:', { 
      type, 
      totalSteps: steps.length, 
      timeout 
    });

    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);
    let stepStartTime = Date.now();
    let currentStepIndex = 0;
    let timeoutTriggered = false;

    // Timeout handler to prevent infinite loading
    const timeoutHandler = setTimeout(() => {
      if (!timeoutTriggered) {
        timeoutTriggered = true;
        console.error('⏰ Loading timeout reached, this may indicate an auth/profile loading issue');
        setHasTimedOut(true);
        setProgress(95);
        
        // Try to recover by forcing a page reload after showing timeout
        setTimeout(() => {
          console.log('🔄 Attempting recovery after timeout...');
          window.location.reload();
        }, 3000);
      }
    }, timeout);

    const interval = setInterval(() => {
      if (timeoutTriggered) {
        clearInterval(interval);
        return;
      }

      const elapsed = Date.now() - stepStartTime;
      const currentStepDuration = steps[currentStepIndex]?.duration || 1000;

      // Calculate overall progress (0-95% to leave room for completion)
      let cumulativeDuration = 0;
      for (let i = 0; i < currentStepIndex; i++) {
        cumulativeDuration += steps[i]?.duration || 0;
      }
      const stepProgress = Math.min(elapsed / currentStepDuration, 1);
      const overallProgress = Math.min(((cumulativeDuration + (elapsed * stepProgress)) / totalDuration) * 95, 95);
      
      setProgress(overallProgress);

      // Check if current step is complete
      if (elapsed >= currentStepDuration) {
        if (currentStepIndex < steps.length - 1) {
          currentStepIndex++;
          setCurrentStep(currentStepIndex);
          stepStartTime = Date.now(); // Reset timer for next step
          console.log('📈 Advanced to step:', currentStepIndex, steps[currentStepIndex]?.label);
        } else {
          // All steps completed
          setProgress(95);
          clearInterval(interval);
          clearTimeout(timeoutHandler);
          console.log('✅ All loading steps completed');
        }
      }
    }, 100);

    // Initialize
    setCurrentStep(0);
    setProgress(0);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutHandler);
      console.log('🔄 Loading progress cleanup');
    };
  }, [isLoading, steps, timeout]);

  if (!isLoading) return null;

  const dialogSteps = steps.map((step, index) => ({
    id: step.id,
    label: step.label,
    status: index < currentStep ? 'completed' as const : 
            index === currentStep ? 'active' as const : 'pending' as const
  }));

  // Show timeout message if needed
  const currentMessage = hasTimedOut 
    ? 'Loading is taking longer than expected. Attempting to recover...'
    : steps[currentStep]?.label || 'Loading...';

  const currentDescription = hasTimedOut
    ? 'Please wait while we try to resolve the loading issue. If this persists, please refresh the page.'
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
