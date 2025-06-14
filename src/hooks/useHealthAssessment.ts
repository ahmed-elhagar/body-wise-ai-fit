
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface HealthAssessment {
  id: string;
  user_id: string;
  assessment_type: string;
  completed_at: string;
  chronic_conditions: string[];
  medications: string[];
  injuries: string[];
  physical_limitations: string[];
  stress_level: number;
  sleep_quality: number;
  energy_level: number;
  work_schedule: string;
  exercise_history: string;
  nutrition_knowledge: string;
  cooking_skills: string;
  time_availability: string;
  primary_motivation: string[];
  specific_goals: string[];
  timeline_expectation: string;
  commitment_level: number;
  health_score?: number;
  readiness_score?: number;
  risk_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface HealthAssessmentInput {
  chronic_conditions?: string[];
  medications?: string[];
  injuries?: string[];
  physical_limitations?: string[];
  stress_level?: number;
  sleep_quality?: number;
  energy_level?: number;
  work_schedule?: string;
  exercise_history?: string;
  nutrition_knowledge?: string;
  cooking_skills?: string;
  time_availability?: string;
  primary_motivation?: string[];
  specific_goals?: string[];
  timeline_expectation?: string;
  commitment_level?: number;
  health_score?: number;
  readiness_score?: number;
  risk_score?: number;
}

const REQUIRED_FIELDS = [
  'work_schedule',
  'exercise_history',
  'nutrition_knowledge',
  'cooking_skills',
  'time_availability',
  'timeline_expectation'
] as const;

const validateAssessmentData = (data: HealthAssessmentInput): string[] => {
  const errors: string[] = [];
  
  REQUIRED_FIELDS.forEach(field => {
    const value = data[field];
    if (!value || value === '') {
      errors.push(`${field.replace('_', ' ')} is required`);
    }
  });

  // Validate numeric ranges
  if (data.stress_level !== undefined && (data.stress_level < 1 || data.stress_level > 10)) {
    errors.push('Stress level must be between 1 and 10');
  }
  
  if (data.sleep_quality !== undefined && (data.sleep_quality < 1 || data.sleep_quality > 10)) {
    errors.push('Sleep quality must be between 1 and 10');
  }
  
  if (data.energy_level !== undefined && (data.energy_level < 1 || data.energy_level > 10)) {
    errors.push('Energy level must be between 1 and 10');
  }
  
  if (data.commitment_level !== undefined && (data.commitment_level < 1 || data.commitment_level > 10)) {
    errors.push('Commitment level must be between 1 and 10');
  }

  return errors;
};

const normalizeArrayField = (value: any): string[] => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') return value.split(',').map(s => s.trim()).filter(Boolean);
  return [];
};

const normalizeAssessmentData = (data: HealthAssessmentInput): HealthAssessmentInput => {
  return {
    ...data,
    chronic_conditions: normalizeArrayField(data.chronic_conditions),
    medications: normalizeArrayField(data.medications),
    injuries: normalizeArrayField(data.injuries),
    physical_limitations: normalizeArrayField(data.physical_limitations),
    primary_motivation: normalizeArrayField(data.primary_motivation),
    specific_goals: normalizeArrayField(data.specific_goals),
    stress_level: data.stress_level || 5,
    sleep_quality: data.sleep_quality || 7,
    energy_level: data.energy_level || 7,
    commitment_level: data.commitment_level || 7,
  };
};

export const useHealthAssessment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: assessment, isLoading, error, refetch } = useQuery({
    queryKey: ['health-assessment', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('useHealthAssessment - No user ID available');
        return null;
      }
      
      console.log('useHealthAssessment - Fetching assessment for user:', user.id);
      
      const { data, error } = await supabase
        .from('health_assessments')
        .select('*')
        .eq('user_id', user.id)
        .eq('assessment_type', 'enhanced_profile')
        .maybeSingle();

      if (error) {
        console.error('useHealthAssessment - Fetch error:', error);
        throw error;
      }
      
      console.log('useHealthAssessment - Fetched assessment:', data);
      return data as HealthAssessment | null;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  const saveAssessmentMutation = useMutation({
    mutationFn: async (assessmentData: HealthAssessmentInput) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      console.log('useHealthAssessment - Starting save operation for user:', user.id);
      console.log('useHealthAssessment - Raw input data:', assessmentData);

      // Validate the input data
      const validationErrors = validateAssessmentData(assessmentData);
      if (validationErrors.length > 0) {
        console.error('useHealthAssessment - Validation errors:', validationErrors);
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Normalize the data
      const normalizedData = normalizeAssessmentData(assessmentData);
      console.log('useHealthAssessment - Normalized data:', normalizedData);

      // Prepare the final data object
      const finalData = {
        user_id: user.id,
        assessment_type: 'enhanced_profile',
        completed_at: new Date().toISOString(),
        ...normalizedData,
      };

      console.log('useHealthAssessment - Final data to save:', finalData);

      // Use upsert with the proper unique constraint
      const { data, error } = await supabase
        .from('health_assessments')
        .upsert(finalData, {
          onConflict: 'user_id,assessment_type',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error('useHealthAssessment - Database error:', error);
        throw error;
      }

      console.log('useHealthAssessment - Assessment saved successfully:', data);
      return data as HealthAssessment;
    },
    onSuccess: (data) => {
      console.log('useHealthAssessment - Save successful, invalidating cache');
      
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['health-assessment'] });
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      toast.success('Health assessment saved successfully!');
    },
    onError: (error: Error) => {
      console.error('useHealthAssessment - Save failed:', error);
      
      let errorMessage = 'Failed to save health assessment. Please try again.';
      
      if (error.message.includes('Validation failed')) {
        errorMessage = error.message;
      } else if (error.message.includes('User not authenticated')) {
        errorMessage = 'Please log in to save your health assessment.';
      }
      
      toast.error(errorMessage);
    },
  });

  const isAssessmentComplete = (assessment: HealthAssessment | null): boolean => {
    if (!assessment) return false;
    
    return REQUIRED_FIELDS.every(field => {
      const value = assessment[field];
      return value !== null && value !== undefined && value !== '';
    });
  };

  return {
    assessment,
    isLoading,
    error,
    saveAssessment: saveAssessmentMutation.mutateAsync,
    isSaving: saveAssessmentMutation.isPending,
    isAssessmentComplete: isAssessmentComplete(assessment),
    refetch,
  };
};
