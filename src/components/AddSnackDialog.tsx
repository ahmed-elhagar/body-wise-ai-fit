
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import AddSnackHeader from "./add-snack/AddSnackHeader";
import CalorieProgressCard from "./add-snack/CalorieProgressCard";
import TargetReachedState from "./add-snack/TargetReachedState";
import SnackGenerationSection from "./add-snack/SnackGenerationSection";
import SnackGenerationProgress from "./add-snack/SnackGenerationProgress";

interface AddSnackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number;
  weeklyPlanId: string | null;
  onSnackAdded: () => void;
  currentDayCalories: number;
  targetDayCalories: number;
}

const AddSnackDialog = ({ 
  isOpen, 
  onClose, 
  selectedDay, 
  weeklyPlanId, 
  onSnackAdded,
  currentDayCalories,
  targetDayCalories
}: AddSnackDialogProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { t, isRTL, language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  const getDynamicTargetCalories = () => {
    if (profile?.weight && profile?.height && profile?.age) {
      const weight = Number(profile.weight);
      const height = Number(profile.height);
      const age = Number(profile.age);
      
      let bmr = 0;
      if (profile.gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
      
      const activityMultipliers = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725,
        'extremely_active': 1.9
      };
      
      const multiplier = activityMultipliers[profile.activity_level as keyof typeof activityMultipliers] || 1.375;
      
      let calorieAdjustment = 1;
      if (profile.fitness_goal === 'lose_weight') {
        calorieAdjustment = 0.85;
      } else if (profile.fitness_goal === 'gain_weight') {
        calorieAdjustment = 1.15;
      }
      
      return Math.round(bmr * multiplier * calorieAdjustment);
    }
    
    return targetDayCalories || 2000;
  };

  const dynamicTargetCalories = getDynamicTargetCalories();
  const remainingCalories = Math.max(0, dynamicTargetCalories - currentDayCalories);

  const handleGenerateAISnack = async () => {
    if (!user || !weeklyPlanId) {
      toast.error(t('mealPlan.addSnackDialog.error') || 'Error generating snack');
      return;
    }

    if (remainingCalories < 50) {
      toast.error('Not enough calories remaining for a snack');
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
        toast.error('Failed to generate snack');
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
        toast.error(data?.error || 'Failed to generate snack');
      }
      
    } catch (error) {
      console.error('❌ Error generating AI snack:', error);
      toast.error('Failed to generate snack');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-4 sm:mx-auto bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-2xl rounded-2xl">
        <div className="p-6 space-y-6">
          <AddSnackHeader selectedDay={selectedDay} />
          
          <CalorieProgressCard 
            currentDayCalories={currentDayCalories}
            targetDayCalories={dynamicTargetCalories}
          />

          {isGenerating ? (
            <SnackGenerationProgress step={generationStep} />
          ) : remainingCalories < 50 ? (
            <TargetReachedState onClose={onClose} />
          ) : (
            <SnackGenerationSection
              remainingCalories={remainingCalories}
              isGenerating={isGenerating}
              onGenerate={handleGenerateAISnack}
              onCancel={onClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSnackDialog;
