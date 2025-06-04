
import React, { useState, useEffect, useRef } from 'react';
import AILoadingDialog from './ai-loading-dialog';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoadingStep {
  id: string;
  label: string;
  duration: number;
}

interface EnhancedPageLoadingProps {
  isLoading: boolean;
  type: 'dashboard' | 'exercise' | 'meal-plan' | 'profile' | 'general';
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const defaultSteps = {
    dashboard: [
      { id: 'auth', label: 'Verifying your account...', duration: 1000 },
      { id: 'profile', label: 'Loading your profile...', duration: 1000 },
      { id: 'stats', label: 'Calculating your progress...', duration: 800 },
      { id: 'ui', label: 'Preparing your dashboard...', duration: 600 }
    ],
    exercise: [
      { id: 'program', label: 'Loading your exercise program...', duration: 1200 },
      { id: 'progress', label: 'Calculating workout progress...', duration: 1000 },
      { id: 'ui', label: 'Setting up your workout view...', duration: 800 }
    ],
    'meal-plan': [
      { id: 'plan', label: 'Loading your meal plan...', duration: 1000 },
      { id: 'nutrition', label: 'Calculating nutrition data...', duration: 1200 },
      { id: 'ui', label: 'Preparing meal view...', duration: 800 }
    ],
    profile: [
      { id: 'data', label: 'Loading your profile data...', duration: 1000 },
      { id: 'settings', label: 'Applying your settings...', duration: 800 },
      { id: 'ui', label: 'Preparing profile view...', duration: 600 }
    ],
    general: [
      { id: 'loading', label: 'Loading...', duration: 1000 },
      { id: 'processing', label: 'Processing...', duration: 1000 },
      { id: 'finalizing', label: 'Finalizing...', duration: 800 }
    ]
  };

  const steps = customSteps || defaultSteps[type];

  const defaultTitles = {
    dashboard: 'Loading Dashboard',
    exercise: 'Loading Exercise Program',
    'meal-plan': 'Loading Meal Plan',
    profile: 'Loading Profile',
    general: 'Loading'
  };

  const defaultDescriptions = {
    dashboard: 'Setting up your personalized dashboard with the latest data',
    exercise: 'Preparing your workout program and progress tracking',
    'meal-plan': 'Loading your personalized meal plan and nutrition data',
    profile: 'Fetching your profile information and preferences',
    general: 'Please wait while we process your request'
  };

  const clearTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (!isLoading) {
      clearTimers();
      setCurrentStep(0);
      setProgress(0);
      setHasTimedOut(false);
      return;
    }

    console.log('🔄 Enhanced loading started:', { type, timeout });

    // Clear any existing timers
    clearTimers();
    
    // Reset state
    setCurrentStep(0);
    setProgress(0);
    setHasTimedOut(false);
    startTimeRef.current = Date.now();

    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);

    // Timeout protection
    timeoutRef.current = setTimeout(() => {
      console.error('⏰ Loading timeout reached for', type);
      setHasTimedOut(true);
      setProgress(100);
      clearTimers();
    }, timeout);

    // Step progression
    let elapsed = 0;
    let stepIndex = 0;

    const progressStep = () => {
      if (stepIndex >= steps.length) {
        clearTimers();
        return;
      }

      const currentStepData = steps[stepIndex];
      console.log('📈 Step progress:', stepIndex, currentStepData?.label);
      
      setCurrentStep(stepIndex);
      
      elapsed += currentStepData.duration;
      const progressValue = Math.min((elapsed / totalDuration) * 90, 90);
      setProgress(progressValue);
      
      stepIndex++;
      
      if (stepIndex < steps.length) {
        intervalRef.current = setTimeout(progressStep, currentStepData.duration);
      }
    };

    // Start progression
    progressStep();

    return () => {
      console.log('🔄 Loading cleanup for', type);
      clearTimers();
    };
  }, [isLoading, type, timeout]);

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
