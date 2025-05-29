
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
      
      const { data, error } = await supabase
        .from('health_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .maybeSingle();

      if (error) throw error;
      return data as HealthAssessment | null;
    },
    enabled: !!user?.id,
  });

  const saveAssessmentMutation = useMutation({
    mutationFn: async (assessmentData: Partial<HealthAssessment>) => {
      if (!user?.id) throw new Error('No user ID');

      const dataToSave = {
        ...assessmentData,
        user_id: user.id,
        completed_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('health_assessments')
        .upsert(dataToSave)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-assessment'] });
      toast.success('Health assessment saved successfully!');
    },
    onError: (error) => {
      console.error('Error saving health assessment:', error);
      toast.error('Failed to save health assessment');
    },
  });

  return {
    assessment,
    isLoading,
    saveAssessment: saveAssessmentMutation.mutate,
    isSaving: saveAssessmentMutation.isPending,
  };
};
