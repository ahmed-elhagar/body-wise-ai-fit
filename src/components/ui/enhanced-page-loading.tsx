
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

  const defaultSteps = {
    dashboard: [
      { id: 'auth', label: 'Verifying your account...', duration: 800 },
      { id: 'profile', label: 'Loading your profile...', duration: 800 },
      { id: 'stats', label: 'Calculating your progress...', duration: 600 },
      { id: 'data', label: 'Fetching latest data...', duration: 600 },
      { id: 'ui', label: 'Preparing your dashboard...', duration: 400 }
    ],
    exercise: [
      { id: 'program', label: 'Loading your exercise program...', duration: 1000 },
      { id: 'progress', label: 'Calculating workout progress...', duration: 800 },
      { id: 'schedule', label: 'Preparing workout schedule...', duration: 600 },
      { id: 'exercises', label: 'Loading exercise details...', duration: 600 },
      { id: 'ui', label: 'Setting up your workout view...', duration: 400 }
    ],
    'meal-plan': [
      { id: 'plan', label: 'Loading your meal plan...', duration: 800 },
      { id: 'nutrition', label: 'Calculating nutrition data...', duration: 1000 },
      { id: 'preferences', label: 'Applying your preferences...', duration: 600 },
      { id: 'ui', label: 'Preparing meal view...', duration: 400 }
    ],
    profile: [
      { id: 'data', label: 'Loading your profile data...', duration: 800 },
      { id: 'settings', label: 'Applying your settings...', duration: 600 },
      { id: 'ui', label: 'Preparing profile view...', duration: 400 }
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
    let stepIndex = 0;
    
    // Timeout protection
    const timeoutHandler = setTimeout(() => {
      if (!timeoutTriggered) {
        timeoutTriggered = true;
        console.error('⏰ Loading timeout reached for', type);
        setHasTimedOut(true);
        setProgress(100);
      }
    }, timeout);

    // Step progression logic
    const progressSteps = () => {
      if (timeoutTriggered || stepIndex >= steps.length) {
        return;
      }

      const currentStepData = steps[stepIndex];
      console.log('📈 Step progress:', stepIndex, currentStepData?.label);
      
      setCurrentStep(stepIndex);
      setProgress(((stepIndex + 1) / steps.length) * 90); // Cap at 90% to show it's still loading
      
      stepIndex++;
      
      // Schedule next step
      if (stepIndex < steps.length) {
        setTimeout(progressSteps, currentStepData.duration);
      }
    };

    // Start step progression
    progressSteps();

    return () => {
      clearTimeout(timeoutHandler);
      console.log('🔄 Loading cleanup for', type);
    };
  }, [isLoading, type, timeout, steps]);

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
