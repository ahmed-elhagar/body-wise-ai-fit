import { useState, useCallback, useEffect, useRef } from 'react';

export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  estimatedDuration?: number; // seconds
}

export interface UnifiedLoadingOptions {
  autoProgress?: boolean;
  stepDuration?: number;
  completionDelay?: number;
  autoCloseSuccess?: boolean;
  autoCloseDelay?: number;
  enableDialog?: boolean;
}

export interface UnifiedLoadingState {
  status: LoadingStatus;
  message: string;
  description: string;
  progress: number;
  steps: LoadingStep[];
  currentStepIndex: number;
  isComplete: boolean;
  dialogOpen: boolean;
}

const defaultOptions: UnifiedLoadingOptions = {
  autoProgress: false,
  stepDuration: 2000,
  completionDelay: 1000,
  autoCloseSuccess: true,
  autoCloseDelay: 2000,
  enableDialog: false
};

export const useUnifiedLoading = (
  initialSteps: LoadingStep[] = [],
  options: UnifiedLoadingOptions = {}
) => {
  const opts = { ...defaultOptions, ...options };
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [state, setState] = useState<UnifiedLoadingState>({
    status: 'idle',
    message: '',
    description: '',
    progress: 0,
    steps: initialSteps,
    currentStepIndex: -1,
    isComplete: false,
    dialogOpen: false
  });

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Auto progress through steps
  useEffect(() => {
    if (!opts.autoProgress || state.status !== 'loading' || state.isComplete) {
      return;
    }

    const nextIndex = state.currentStepIndex + 1;
    
    if (nextIndex >= state.steps.length) {
      // All steps completed, mark as complete
      timerRef.current = setTimeout(() => {
        setState(prev => ({
          ...prev,
          isComplete: true,
          progress: 100,
          steps: prev.steps.map(step => ({ ...step, status: 'completed' as const }))
        }));
      }, opts.completionDelay);
      return;
    }

    // Calculate step duration
    const currentStep = state.steps[nextIndex];
    const duration = currentStep?.estimatedDuration 
      ? Math.max(currentStep.estimatedDuration * 800, 1200)
      : opts.stepDuration;

    timerRef.current = setTimeout(() => {
      setState(prev => {
        const newSteps = prev.steps.map((step, index) => ({
          ...step,
          status: index < nextIndex ? 'completed' as const :
                  index === nextIndex ? 'active' as const : 'pending' as const
        }));

        return {
          ...prev,
          currentStepIndex: nextIndex,
          steps: newSteps,
          progress: ((nextIndex + 1) / prev.steps.length) * 100,
          message: currentStep?.label || prev.message
        };
      });
    }, duration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [state.currentStepIndex, state.status, state.isComplete, opts.autoProgress, opts.stepDuration, opts.completionDelay, state.steps]);

  // Auto close success state
  useEffect(() => {
    if (state.status === 'success' && opts.autoCloseSuccess) {
      timerRef.current = setTimeout(() => {
        setState(prev => ({ ...prev, dialogOpen: false }));
      }, opts.autoCloseDelay);
    }
  }, [state.status, opts.autoCloseSuccess, opts.autoCloseDelay]);

  const updateState = useCallback((updates: Partial<UnifiedLoadingState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const startLoading = useCallback((message = 'Processing...', description = '') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    updateState({
      status: 'loading',
      message,
      description,
      progress: 0,
      currentStepIndex: state.steps.length > 0 ? 0 : -1,
      isComplete: false,
      dialogOpen: opts.enableDialog,
      steps: state.steps.map((step, index) => ({
        ...step,
        status: index === 0 ? 'active' as const : 'pending' as const
      }))
    });
  }, [updateState, state.steps, opts.enableDialog]);

  const updateProgress = useCallback((progress: number, message?: string) => {
    updateState({
      progress: Math.min(100, Math.max(0, progress)),
      ...(message && { message })
    });
  }, [updateState]);

  const nextStep = useCallback(() => {
    const nextIndex = state.currentStepIndex + 1;
    
    if (nextIndex >= state.steps.length) {
      updateState({ isComplete: true, progress: 100 });
      return;
    }

    updateState({
      currentStepIndex: nextIndex,
      steps: state.steps.map((step, index) => ({
        ...step,
        status: index < nextIndex ? 'completed' as const :
                index === nextIndex ? 'active' as const : 'pending' as const
      })),
      progress: ((nextIndex + 1) / state.steps.length) * 100,
      message: state.steps[nextIndex]?.label || state.message
    });
  }, [state.currentStepIndex, state.steps, state.message, updateState]);

  const updateStep = useCallback((stepId: string, status: LoadingStep['status']) => {
    updateState({
      steps: state.steps.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    });
  }, [state.steps, updateState]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < state.steps.length) {
      updateState({
        currentStepIndex: stepIndex,
        isComplete: stepIndex >= state.steps.length - 1,
        steps: state.steps.map((step, index) => ({
          ...step,
          status: index < stepIndex ? 'completed' as const :
                  index === stepIndex ? 'active' as const : 'pending' as const
        })),
        progress: ((stepIndex + 1) / state.steps.length) * 100
      });
    }
  }, [state.steps, updateState]);

  const setSuccess = useCallback((message = 'Success!', description = '') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    updateState({
      status: 'success',
      message,
      description,
      progress: 100,
      isComplete: true,
      steps: state.steps.map(step => ({ ...step, status: 'completed' as const }))
    });
  }, [updateState, state.steps]);

  const setError = useCallback((message = 'An error occurred', description = '') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    updateState({
      status: 'error',
      message,
      description,
      steps: state.steps.map(step => 
        step.status === 'active' ? { ...step, status: 'error' as const } : step
      )
    });
  }, [updateState, state.steps]);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    updateState({
      status: 'idle',
      message: '',
      description: '',
      progress: 0,
      currentStepIndex: -1,
      isComplete: false,
      dialogOpen: false,
      steps: state.steps.map(step => ({ ...step, status: 'pending' as const }))
    });
  }, [updateState, state.steps]);

  const complete = useCallback(() => {
    updateState({
      currentStepIndex: state.steps.length - 1,
      isComplete: true,
      progress: 100,
      steps: state.steps.map(step => ({ ...step, status: 'completed' as const }))
    });
  }, [state.steps, updateState]);

  const closeDialog = useCallback(() => {
    updateState({ dialogOpen: false });
  }, [updateState]);

  const openDialog = useCallback(() => {
    updateState({ dialogOpen: true });
  }, [updateState]);

  return {
    // State
    ...state,
    
    // Actions
    startLoading,
    updateProgress,
    updateStep,
    nextStep,
    goToStep,
    setSuccess,
    setError,
    reset,
    complete,
    closeDialog,
    openDialog,
    
    // Computed
    isLoading: state.status === 'loading',
    hasSteps: state.steps.length > 0,
    currentStep: state.currentStepIndex >= 0 ? state.steps[state.currentStepIndex] : null
  };
}; 