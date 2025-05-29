
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
}

export const useHealthAssessment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: assessment, isLoading, refetch } = useQuery({
    queryKey: ['health-assessment', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log('useHealthAssessment - Fetching assessment for user:', user.id);
      
      const { data, error } = await supabase
        .from('health_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('useHealthAssessment - Error fetching assessment:', error);
        throw error;
      }
      
      console.log('useHealthAssessment - Fetched assessment data:', data);
      return data as HealthAssessment | null;
    },
    enabled: !!user?.id,
  });

  const saveAssessmentMutation = useMutation({
    mutationFn: async (assessmentData: Partial<HealthAssessment>) => {
      if (!user?.id) throw new Error('No user ID');

      console.log('useHealthAssessment - Saving assessment data:', assessmentData);

      const cleanedData = {
        ...assessmentData,
        user_id: user.id,
        completed_at: new Date().toISOString(),
        assessment_type: 'enhanced_profile',
        chronic_conditions: Array.isArray(assessmentData.chronic_conditions) ? assessmentData.chronic_conditions : [],
        medications: Array.isArray(assessmentData.medications) ? assessmentData.medications : [],
        injuries: Array.isArray(assessmentData.injuries) ? assessmentData.injuries : [],
        physical_limitations: Array.isArray(assessmentData.physical_limitations) ? assessmentData.physical_limitations : [],
        primary_motivation: Array.isArray(assessmentData.primary_motivation) ? assessmentData.primary_motivation : [],
        specific_goals: Array.isArray(assessmentData.specific_goals) ? assessmentData.specific_goals : [],
      };

      // Remove undefined values
      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key as keyof typeof cleanedData] === undefined) {
          delete cleanedData[key as keyof typeof cleanedData];
        }
      });

      console.log('useHealthAssessment - Final cleaned data:', cleanedData);

      // Always use upsert to handle both insert and update
      const { data, error } = await supabase
        .from('health_assessments')
        .upsert(cleanedData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error('useHealthAssessment - Upsert error:', error);
        throw error;
      }
      
      console.log('useHealthAssessment - Assessment saved successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('useHealthAssessment - Assessment saved, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['health-assessment'] });
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Health assessment saved successfully!');
    },
    onError: (error) => {
      console.error('useHealthAssessment - Save error:', error);
      toast.error('Failed to save health assessment. Please try again.');
    },
  });

  return {
    assessment,
    isLoading,
    saveAssessment: saveAssessmentMutation.mutateAsync,
    isSaving: saveAssessmentMutation.isPending,
    refetch,
  };
};
