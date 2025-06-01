
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
    console.log('🚀 Starting AI snack generation with params:', {
      weeklyPlanId,
      selectedDay,
      remainingCalories,
      profileId: profile?.id,
      language
    });

    // Validation checks
    if (!weeklyPlanId) {
      console.error('❌ No weekly plan ID provided');
      toast.error(t('mealPlan.addSnackDialog.error') || 'Error: No meal plan found');
      return;
    }

    if (!profile) {
      console.error('❌ No user profile available');
      toast.error(t('mealPlan.addSnackDialog.error') || 'Error: User profile not found');
      return;
    }

    if (remainingCalories < 50) {
      console.warn('⚠️ Not enough calories remaining for snack');
      toast.error(t('mealPlan.addSnackDialog.notEnoughCalories') || 'Not enough calories remaining for a snack');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Step 1: Analyzing user preferences
      setGenerationStep('analyzing');
      console.log('🔍 Step 1: Analyzing user preferences and nutrition needs...');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Step 2: Creating perfect snack
      setGenerationStep('creating');
      console.log('🥄 Step 2: Creating perfect snack with AI...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Calculate optimal calories for snack (not more than remaining, reasonable portion)
      const targetCalories = Math.min(remainingCalories, 250);

      console.log('📡 Calling generate-ai-snack edge function with data:', {
        userProfile: {
          id: profile.id,
          age: profile.age,
          gender: profile.gender,
          fitness_goal: profile.fitness_goal,
          allergies: profile.allergies,
          dietary_restrictions: profile.dietary_restrictions,
          nationality: profile.nationality
        },
        day: selectedDay,
        calories: targetCalories,
        weeklyPlanId,
        language
      });

      const { data, error } = await supabase.functions.invoke('generate-ai-snack', {
        body: {
          userProfile: profile,
          day: selectedDay,
          calories: targetCalories,
          weeklyPlanId,
          language
        }
      });

      if (error) {
        console.error('❌ Error from generate-ai-snack function:', error);
        toast.error(t('mealPlan.addSnackDialog.failed') || 'Failed to generate snack');
        return;
      }

      // Step 3: Saving to meal plan
      setGenerationStep('saving');
      console.log('💾 Step 3: Saving snack to meal plan...');
      await new Promise(resolve => setTimeout(resolve, 800));

      if (data?.success) {
        console.log('✅ AI snack generated successfully:', data);
        toast.success(data.message || t('mealPlan.snackAddedSuccess') || 'Snack added successfully!');
        
        // Close dialog and refresh data
        onClose();
        onSnackAdded();
      } else {
        console.error('❌ Generation failed with response:', data);
        toast.error(data?.error || t('mealPlan.addSnackDialog.failed') || 'Failed to generate snack');
      }
      
    } catch (error) {
      console.error('❌ Exception during AI snack generation:', error);
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
