
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Shuffle, Calendar } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { LifePhaseRibbon } from "./meal-plan/LifePhaseRibbon";
import { useLifePhaseProfile } from "@/hooks/useLifePhaseProfile";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

interface MealPlanHeaderProps {
  currentDate: string;
  currentDay: string;
  onShowAIDialog: () => void;
  onRegeneratePlan: () => void;
  isGenerating: boolean;
  isShuffling: boolean;
  dietType?: string;
  totalWeeklyCalories?: number;
}

const MealPlanHeader = ({
  currentDate,
  currentDay,
  onShowAIDialog,
  onRegeneratePlan,
  isGenerating,
  isShuffling,
  dietType,
  totalWeeklyCalories
}: MealPlanHeaderProps) => {
  const { t, isRTL } = useI18n();
  const { flags } = useFeatureFlags();
  const { getNutritionContext } = useLifePhaseProfile();
  
  const nutritionContext = getNutritionContext();

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border-0 shadow-lg">
      {/* Life Phase Ribbon - Only show if feature flag is enabled and user has life phase data */}
      {flags.life_phase_nutrition && (
        <LifePhaseRibbon
          pregnancyTrimester={nutritionContext.pregnancyTrimester}
          breastfeedingLevel={nutritionContext.breastfeedingLevel}
          fastingType={nutritionContext.fastingType}
          extraCalories={nutritionContext.extraCalories}
        />
      )}

      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Calendar className="w-5 h-5 text-fitness-primary-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {t('mealPlan.title')}
            </h1>
          </div>
          
          <div className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-600 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <span className="font-medium">{currentDay}</span>
            <span className="hidden sm:inline">•</span>
            <span>{currentDate}</span>
            {dietType && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="capitalize">{dietType} {t('mealPlan.personalizedPlan')}</span>
              </>
            )}
            {totalWeeklyCalories && (
              <>
                <span className="hidden sm:inline">•</span>
                <span>{Math.round(totalWeeklyCalories / 7)} {t('mealPlan.calPerDay')}</span>
              </>
            )}
          </div>
        </div>

        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            onClick={onRegeneratePlan}
            disabled={isGenerating || isShuffling}
            variant="outline"
            size="sm"
            className="whitespace-nowrap hover:bg-fitness-primary-50"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            {t('mealPlan.shuffleMeals')}
          </Button>
          
          <Button
            onClick={onShowAIDialog}
            disabled={isGenerating || isShuffling}
            className="bg-gradient-to-r from-fitness-primary-600 to-fitness-accent-600 hover:from-fitness-primary-700 hover:to-fitness-accent-700 text-white whitespace-nowrap"
            size="sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {t('mealPlan.generateAIMealPlan')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MealPlanHeader;
