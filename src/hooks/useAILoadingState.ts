
import { useState, useCallback } from 'react';
import { LoadingStatus } from '@/components/ui/loading-indicator';

interface AILoadingStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

interface AILoadingState {
  status: LoadingStatus;
  message: string;
  description: string;
  progress: number;
  steps: AILoadingStep[];
  dialogOpen: boolean;
}

const useAILoadingState = (initialSteps?: AILoadingStep[]) => {
  const [state, setState] = useState<AILoadingState>({
    status: 'idle',
    message: '',
    description: '',
    progress: 0,
    steps: initialSteps || [],
    dialogOpen: false
  });

  const updateState = useCallback((updates: Partial<AILoadingState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const startLoading = useCallback((message = 'Processing...', description = '') => {
    updateState({
      status: 'loading',
      message,
      description,
      progress: 0,
      dialogOpen: true,
      steps: state.steps.map(step => ({ ...step, status: 'pending' as const }))
    });
  }, [updateState, state.steps]);

  const updateProgress = useCallback((progress: number, message?: string) => {
    updateState({
      progress: Math.min(100, Math.max(0, progress)),
      ...(message && { message })
    });
  }, [updateState]);

  const updateStep = useCallback((stepId: string, status: AILoadingStep['status']) => {
    updateState({
      steps: state.steps.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    });
  }, [updateState, state.steps]);

  const nextStep = useCallback(() => {
    const activeIndex = state.steps.findIndex(step => step.status === 'active');
    const nextIndex = activeIndex + 1;
    
    updateState({
      steps: state.steps.map((step, index) => ({
        ...step,
        status: index < nextIndex ? 'completed' : 
               index === nextIndex ? 'active' : 'pending'
      })),
      progress: ((nextIndex + 1) / state.steps.length) * 100
    });
  }, [updateState, state.steps]);

  const setSuccess = useCallback((message = 'Success!', description = '') => {
    updateState({
      status: 'success',
      message,
      description,
      progress: 100,
      steps: state.steps.map(step => ({ ...step, status: 'completed' as const }))
    });
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      updateState({ dialogOpen: false });
    }, 2000);
  }, [updateState, state.steps]);

  const setError = useCallback((message = 'An error occurred', description = '') => {
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
    updateState({
      status: 'idle',
      message: '',
      description: '',
      progress: 0,
      dialogOpen: false,
      steps: state.steps.map(step => ({ ...step, status: 'pending' as const }))
    });
  }, [updateState, state.steps]);

  const closeDialog = useCallback(() => {
    updateState({ dialogOpen: false });
  }, [updateState]);

  return {
    ...state,
    startLoading,
    updateProgress,
    updateStep,
    nextStep,
    setSuccess,
    setError,
    reset,
    closeDialog
  };
};

export default useAILoadingState;
