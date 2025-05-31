
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface UseSnackGenerationProps {
  weeklyPlanId: string | null;
  selectedDay: number;
  remainingCalories: number;
  profile: any;
  onSnackAdded: () => void;
  onClose: () => void;
}

export const useSnackGeneration = ({
  weeklyPlanId,
  selectedDay,
  remainingCalories,
  profile,
  onSnackAdded,
  onClose
}: UseSnackGenerationProps) => {
  const { t, language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  const handleGenerateAISnack = async () => {
    if (!weeklyPlanId) {
      toast.error(t('mealPlan.addSnackDialog.error') || 'Error generating snack');
      return;
    }

    if (remainingCalories < 50) {
      toast.error(t('mealPlan.addSnackDialog.notEnoughCalories') || 'Not enough calories remaining for a snack');
      return;
    }

    setIsGenerating(true);
    
    try {
      setGenerationStep('analyzing');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setGenerationStep('creating');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data, error } = await supabase.functions.invoke('generate-ai-snack', {
        body: {
          userProfile: profile,
          day: selectedDay,
          calories: remainingCalories,
          weeklyPlanId,
          language
        }
      });

      if (error) {
        console.error('❌ Error generating AI snack:', error);
        toast.error(t('mealPlan.addSnackDialog.failed') || 'Failed to generate snack');
        return;
      }

      setGenerationStep('saving');
      await new Promise(resolve => setTimeout(resolve, 800));

      if (data?.success) {
        toast.success(data.message || t('mealPlan.snackAddedSuccess'));
        onClose();
        onSnackAdded();
      } else {
        console.error('❌ Generation failed:', data?.error);
        toast.error(data?.error || t('mealPlan.addSnackDialog.failed') || 'Failed to generate snack');
      }
      
    } catch (error) {
      console.error('❌ Error generating AI snack:', error);
      toast.error(t('mealPlan.addSnackDialog.failed') || 'Failed to generate snack');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return {
    isGenerating,
    generationStep,
    handleGenerateAISnack
  };
};
