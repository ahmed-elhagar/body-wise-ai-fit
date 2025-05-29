
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

  const { data: assessment, isLoading } = useQuery({
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

      if (error) {
        console.error('useHealthAssessment - Error fetching assessment:', error);
        throw error;
      }
      
      console.log('useHealthAssessment - Fetched assessment:', data);
      return data as HealthAssessment | null;
    },
    enabled: !!user?.id,
  });

  const saveAssessmentMutation = useMutation({
    mutationFn: async (assessmentData: Partial<HealthAssessment>) => {
      if (!user?.id) throw new Error('No user ID');

      console.log('useHealthAssessment - Saving assessment data:', assessmentData);

      const dataToSave = {
        ...assessmentData,
        user_id: user.id,
        completed_at: new Date().toISOString(),
      };

      // Check if assessment exists
      const { data: existing } = await supabase
        .from('health_assessments')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let result;
      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('health_assessments')
          .update(dataToSave)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
        console.log('useHealthAssessment - Updated existing assessment:', result);
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('health_assessments')
          .insert(dataToSave)
          .select()
          .single();

        if (error) throw error;
        result = data;
        console.log('useHealthAssessment - Created new assessment:', result);
      }

      return result;
    },
    onSuccess: (data) => {
      console.log('useHealthAssessment - Assessment saved successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['health-assessment'] });
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Health assessment saved successfully!');
    },
    onError: (error) => {
      console.error('useHealthAssessment - Error saving assessment:', error);
      toast.error('Failed to save health assessment');
    },
  });

  return {
    assessment,
    isLoading,
    saveAssessment: saveAssessmentMutation.mutateAsync,
    isSaving: saveAssessmentMutation.isPending,
  };
};
