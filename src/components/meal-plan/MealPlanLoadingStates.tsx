
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Chef, Brain, Target, Calendar, CheckCircle, Loader2, Utensils } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

interface MealPlanLoadingStatesProps {
  isGenerating: boolean;
  isLoading: boolean;
  isShuffling?: boolean;
}

export const MealPlanLoadingStates = ({ 
  isGenerating, 
  isLoading,
  isShuffling = false
}: MealPlanLoadingStatesProps) => {
  const { t, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const generationSteps = [
    {
      icon: Brain,
      title: t('mealPlan.analyzingProfile'),
      description: t('mealPlan.analyzingProfileDesc'),
      duration: 2000
    },
    {
      icon: Target,
      title: t('mealPlan.calculatingNutrition'),
      description: t('mealPlan.calculatingNutritionDesc'),
      duration: 2500
    },
    {
      icon: Chef,
      title: t('mealPlan.selectingMeals'),
      description: t('mealPlan.selectingMealsDesc'),
      duration: 3000
    },
    {
      icon: Calendar,
      title: t('mealPlan.creatingWeeklyPlan'),
      description: t('mealPlan.creatingWeeklyPlanDesc'),
      duration: 2000
    },
    {
      icon: Utensils,
      title: t('mealPlan.finalizingMealPlan'),
      description: t('mealPlan.finalizingMealPlanDesc'),
      duration: 1500
    }
  ];

  const shuffleSteps = [
    {
      icon: Target,
      title: t('mealPlan.analyzingCurrentPlan'),
      description: t('mealPlan.analyzingCurrentPlanDesc'),
      duration: 1500
    },
    {
      icon: Chef,
      title: t('mealPlan.selectingAlternatives'),
      description: t('mealPlan.selectingAlternativesDesc'),
      duration: 2000
    },
    {
      icon: Calendar,
      title: t('mealPlan.reorganizingWeek'),
      description: t('mealPlan.reorganizingWeekDesc'),
      duration: 1500
    }
  ];

  const steps = isShuffling ? shuffleSteps : generationSteps;

  useEffect(() => {
    if (!isGenerating && !isShuffling) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    let stepIndex = 0;
    let progressValue = 0;
    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 100;
      progressValue = Math.min((elapsed / totalDuration) * 100, 95);
      setProgress(progressValue);

      // Update current step based on elapsed time
      let cumulativeDuration = 0;
      for (let i = 0; i < steps.length; i++) {
        cumulativeDuration += steps[i].duration;
        if (elapsed <= cumulativeDuration) {
          setCurrentStep(i);
          break;
        }
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isGenerating, isShuffling, steps]);

  if (isGenerating || isShuffling) {
    const mainTitle = isShuffling ? t('mealPlan.shufflingMeals') : t('mealPlan.generatingMealPlan');
    const mainDescription = isShuffling ? t('mealPlan.shufflingMealsDesc') : t('mealPlan.generatingMealPlanDesc');
    const mainIcon = isShuffling ? Utensils : Chef;

    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-2xl text-center max-w-lg w-full mx-4">
          {/* Header */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              {React.createElement(mainIcon, { className: "w-10 h-10 text-white animate-pulse" })}
            </div>
            <h3 className={`text-2xl font-bold text-gray-800 mb-2 ${isRTL ? 'font-arabic' : ''}`}>
              {mainTitle}
            </h3>
            <p className="text-gray-600 text-sm">
              {mainDescription}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className={`flex justify-between items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-sm font-medium text-gray-700">
                {t('mealPlan.progress')}
              </span>
              <span className="text-sm font-bold text-green-600">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </Progress>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div 
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 scale-105' 
                      : isCompleted 
                        ? 'bg-emerald-50 border-l-4 border-emerald-500' 
                        : 'bg-gray-50 opacity-60'
                  } ${isRTL ? 'flex-row-reverse border-r-4 border-l-0' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-emerald-500 text-white' 
                      : isActive 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : isActive ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </div>
                  <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h4 className={`font-semibold text-gray-800 ${isActive ? 'text-green-700' : ''}`}>
                      {step.title}
                    </h4>
                    <p className={`text-sm text-gray-600 ${isActive ? 'text-green-600' : ''}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 font-medium">
              {isShuffling ? t('mealPlan.pleaseWaitShuffle') : t('mealPlan.pleaseWaitGenerate')}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
          <div className="w-12 h-12 animate-spin border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">{t('mealPlan.loadingMealPlan')}</p>
        </Card>
      </div>
    );
  }

  return null;
};

export default MealPlanLoadingStates;
