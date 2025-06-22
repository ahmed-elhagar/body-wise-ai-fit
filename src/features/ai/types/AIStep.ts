
// Unified AIStep interface for all AI loading components
export interface AIStep {
  id: string;
  title: string;
  label: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  estimatedDuration?: number;
}

export interface UseAILoadingStepsOptions {
  autoProgress?: boolean;
  stepDuration?: number;
  completionDelay?: number;
}
