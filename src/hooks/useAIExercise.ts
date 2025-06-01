
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';
import { useI18n } from "@/hooks/useI18n";

interface AIExerciseOptions {
  focus: string;
  equipment: string;
  duration: number;
  intensity: string;
  workoutType?: string;
}

export const useAIExercise = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { profile } = useProfile();
  const { t } = useI18n();

  const generateAIExercise = async (options: AIExerciseOptions) => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-exercise', {
        body: {
          userProfile: profile,
          focus: options.focus,
          equipment: options.equipment,
          duration: options.duration,
          intensity: options.intensity,
          workoutType: options.workoutType || 'home',
          language: 'en' // TODO: use language from i18n
        }
      });

      if (error) {
        console.error('AI Exercise generation error:', error);
        toast.error(t('exercise.aiGenerationFailed') || 'Failed to generate exercise program');
        return null;
      }

      if (!data?.success) {
        toast.error(data?.error || t('exercise.aiGenerationFailed') || 'Failed to generate exercise program');
        return null;
      }

      toast.success(t('exercise.aiGenerationSuccess') || 'Exercise program generated successfully!');
      return data.exercises;
    } catch (error: any) {
      console.error('Error generating AI Exercise:', error);
      toast.error(t('exercise.aiGenerationFailed') || 'Failed to generate exercise program');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateAIExercise,
    isGenerating
  };
};
