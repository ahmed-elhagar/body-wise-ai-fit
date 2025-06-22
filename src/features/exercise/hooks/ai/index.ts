export { useAIWorkoutGeneration } from './useAIWorkoutGeneration';
export { useFormAnalysis } from './useFormAnalysis';
export { useRecoveryOptimization } from './useRecoveryOptimization';

export type {
  AIWorkoutRequest,
  WorkoutGenerationResponse,
  FormAnalysisRequest,
  FormAnalysisResult,
  RecoveryMetrics,
  RecoveryRecommendation
} from './useAIWorkoutGeneration';

export type {
  FormAnalysisResult as FormAnalysis,
  FormAnalysisRequest as FormRequest
} from './useFormAnalysis';

export type {
  RecoveryMetrics as Recovery,
  RecoveryRecommendation as RecoveryRec
} from './useRecoveryOptimization'; 