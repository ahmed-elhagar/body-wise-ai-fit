
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
}

const EnhancedPageLoading = ({
  isLoading,
  type,
  title,
  description,
  customSteps
}: EnhancedPageLoadingProps) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const defaultSteps = {
    dashboard: [
      { id: 'auth', label: 'Verifying your account...', duration: 1000 },
      { id: 'profile', label: 'Loading your profile...', duration: 1500 },
      { id: 'stats', label: 'Calculating your progress...', duration: 1200 },
      { id: 'data', label: 'Fetching latest data...', duration: 800 },
      { id: 'ui', label: 'Preparing your dashboard...', duration: 500 }
    ],
    exercise: [
      { id: 'program', label: 'Loading your exercise program...', duration: 1200 },
      { id: 'progress', label: 'Calculating workout progress...', duration: 1000 },
      { id: 'schedule', label: 'Preparing workout schedule...', duration: 800 },
      { id: 'exercises', label: 'Loading exercise details...', duration: 700 },
      { id: 'ui', label: 'Setting up your workout view...', duration: 500 }
    ],
    'meal-plan': [
      { id: 'plan', label: 'Loading your meal plan...', duration: 1000 },
      { id: 'nutrition', label: 'Calculating nutrition data...', duration: 1200 },
      { id: 'preferences', label: 'Applying your preferences...', duration: 800 },
      { id: 'ui', label: 'Preparing meal view...', duration: 500 }
    ],
    profile: [
      { id: 'data', label: 'Loading your profile data...', duration: 1000 },
      { id: 'settings', label: 'Applying your settings...', duration: 800 },
      { id: 'ui', label: 'Preparing profile view...', duration: 500 }
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
      return;
    }

    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 100;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 95);
      setProgress(newProgress);

      let cumulativeDuration = 0;
      for (let i = 0; i < steps.length; i++) {
        cumulativeDuration += steps[i].duration;
        if (elapsed <= cumulativeDuration) {
          setCurrentStep(i);
          break;
        }
      }

      if (elapsed >= totalDuration) {
        setProgress(100);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isLoading, steps]);

  if (!isLoading) return null;

  const dialogSteps = steps.map((step, index) => ({
    id: step.id,
    label: step.label,
    status: index < currentStep ? 'completed' as const : 
            index === currentStep ? 'active' as const : 'pending' as const
  }));

  return (
    <AILoadingDialog
      open={true}
      status="loading"
      title={title || defaultTitles[type]}
      message={steps[currentStep]?.label || 'Loading...'}
      description={description || defaultDescriptions[type]}
      steps={dialogSteps}
      progress={progress}
      allowClose={false}
    />
  );
};

export default EnhancedPageLoading;
