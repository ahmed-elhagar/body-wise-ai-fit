
import { useState } from 'react';
import { useRateLimitedAI } from './useRateLimitedAI';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export const useEnhancedAIExercise = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { executeAIAction } = useRateLimitedAI();
  const { t } = useLanguage();

  const generateExerciseProgram = async (preferences: any) => {
    try {
      setIsGenerating(true);
      console.log('🤖 Starting AI exercise program generation:', preferences);
      
      await executeAIAction('generate-exercise-program', preferences);
      
      toast.success(t('Exercise program generated successfully!'));
      console.log('✅ Exercise program generation completed');
    } catch (error) {
      console.error('❌ Error generating exercise program:', error);
      toast.error(t('Failed to generate exercise program. Please try again.'));
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateProgram = async (weekStartDate: string) => {
    try {
      setIsGenerating(true);
      console.log('🔄 Regenerating exercise program for week:', weekStartDate);
      
      await executeAIAction('regenerate-exercise-program', { weekStartDate });
      
      toast.success(t('Exercise program regenerated successfully!'));
      console.log('✅ Exercise program regeneration completed');
    } catch (error) {
      console.error('❌ Error regenerating exercise program:', error);
      toast.error(t('Failed to regenerate exercise program. Please try again.'));
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateExerciseProgram,
    regenerateProgram,
  };
};
