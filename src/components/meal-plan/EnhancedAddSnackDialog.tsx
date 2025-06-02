
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/hooks/useProfile";
import { useSnackGeneration } from "./add-snack/useSnackGeneration";
import { SnackGenerationCard } from "./add-snack/SnackGenerationCard";
import { SnackGenerationProgress } from "./add-snack/SnackGenerationProgress";

interface EnhancedAddSnackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number;
  currentDayCalories?: number;
  targetDayCalories?: number;
  weeklyPlanId?: string | null;
  onSnackAdded: () => void;
}

const EnhancedAddSnackDialog = ({
  isOpen,
  onClose,
  selectedDay,
  currentDayCalories = 0,
  targetDayCalories = 2000,
  weeklyPlanId,
  onSnackAdded
}: EnhancedAddSnackDialogProps) => {
  const { t, isRTL } = useLanguage();
  const { profile } = useProfile();

  const remainingCalories = Math.max(0, targetDayCalories - currentDayCalories);

  console.log('🥄 EnhancedAddSnackDialog rendered:', {
    selectedDay,
    currentDayCalories,
    targetDayCalories,
    remainingCalories,
    weeklyPlanId,
    profileId: profile?.id
  });

  const {
    isGenerating,
    generationStep,
    handleGenerateAISnack
  } = useSnackGeneration({
    weeklyPlanId,
    selectedDay,
    remainingCalories,
    profile,
    onSnackAdded,
    onClose
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`max-w-md bg-gradient-to-br from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200 ${isRTL ? 'text-right' : 'text-left'}`}
      >
        <DialogHeader>
          <DialogTitle className={`text-fitness-primary-700 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('mealPlan.addSnack') || 'Add Snack'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Day Information */}
          <div className={`bg-white p-4 rounded-lg border border-fitness-primary-200 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h3 className="font-medium text-fitness-primary-700 mb-2">
              {t('mealPlan.dayInfo') || 'Day Information'}
            </h3>
            <div className="space-y-1 text-sm">
              <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-fitness-primary-600">
                  {t('mealPlan.selectedDay') || 'Selected Day'}:
                </span>
                <span className="font-medium text-fitness-primary-700">
                  {t('mealPlan.day') || 'Day'} {selectedDay}
                </span>
              </div>
              <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-fitness-primary-600">
                  {t('mealPlan.currentCalories') || 'Current Calories'}:
                </span>
                <span className="font-medium text-fitness-primary-700">
                  {currentDayCalories} {t('mealPlan.kcal') || 'kcal'}
                </span>
              </div>
              <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-fitness-primary-600">
                  {t('mealPlan.targetCalories') || 'Target Calories'}:
                </span>
                <span className="font-medium text-fitness-primary-700">
                  {targetDayCalories} {t('mealPlan.kcal') || 'kcal'}
                </span>
              </div>
              <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-fitness-primary-600">
                  {t('mealPlan.remainingCalories') || 'Remaining Calories'}:
                </span>
                <span className={`font-medium ${remainingCalories > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {remainingCalories} {t('mealPlan.kcal') || 'kcal'}
                </span>
              </div>
            </div>
          </div>

          {/* Generation Progress or Card */}
          {isGenerating ? (
            <SnackGenerationProgress 
              generationStep={generationStep}
            />
          ) : (
            <SnackGenerationCard
              remainingCalories={remainingCalories}
              isGenerating={isGenerating}
              onGenerate={handleGenerateAISnack}
              onClose={onClose}
            />
          )}

          {/* Warning for low calories */}
          {remainingCalories < 50 && !isGenerating && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-sm text-yellow-800 text-center">
                {t('mealPlan.lowCaloriesWarning') || 'You have very few calories remaining. Consider a light snack or adjusting your other meals.'}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedAddSnackDialog;
