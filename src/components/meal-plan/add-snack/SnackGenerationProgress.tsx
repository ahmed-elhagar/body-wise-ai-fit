
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Search, ChefHat, Save } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SnackGenerationProgressProps {
  generationStep: string;
}

export const SnackGenerationProgress = ({ generationStep }: SnackGenerationProgressProps) => {
  const { t, isRTL } = useLanguage();

  const getStepInfo = () => {
    switch (generationStep) {
      case 'analyzing':
        return {
          icon: <Search className="w-8 h-8 text-blue-500" />,
          title: t('mealPlan.analyzingPreferences') || 'Analyzing Your Preferences',
          description: t('mealPlan.analyzingDescription') || 'Reviewing your dietary preferences, allergies, and nutrition goals...',
          color: 'blue'
        };
      case 'creating':
        return {
          icon: <ChefHat className="w-8 h-8 text-orange-500" />,
          title: t('mealPlan.creatingSnack') || 'Creating Perfect Snack',
          description: t('mealPlan.creatingDescription') || 'Crafting a personalized snack that fits your remaining calories...',
          color: 'orange'
        };
      case 'saving':
        return {
          icon: <Save className="w-8 h-8 text-green-500" />,
          title: t('mealPlan.savingToMealPlan') || 'Saving to Meal Plan',
          description: t('mealPlan.savingDescription') || 'Adding your new snack to your daily meal plan...',
          color: 'green'
        };
      default:
        return {
          icon: <Sparkles className="w-8 h-8 text-purple-500" />,
          title: t('mealPlan.generatingSnack') || 'Generating Snack',
          description: t('mealPlan.generatingDescription') || 'Creating your personalized snack...',
          color: 'purple'
        };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <Card className="bg-white border-fitness-primary-200 shadow-md">
      <CardContent className="p-6">
        <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="animate-pulse">
              {stepInfo.icon}
            </div>
          </div>

          {/* Progress Steps */}
          <div className={`flex justify-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center space-x-2">
              <Badge 
                className={`${
                  ['analyzing', 'creating', 'saving'].includes(generationStep) 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                1
              </Badge>
              <div className="w-8 h-1 bg-gray-200 rounded">
                <div 
                  className={`h-full rounded transition-all duration-500 ${
                    ['creating', 'saving'].includes(generationStep) 
                      ? 'bg-blue-500 w-full' 
                      : 'bg-blue-500 w-0'
                  }`}
                />
              </div>
              <Badge 
                className={`${
                  ['creating', 'saving'].includes(generationStep) 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                2
              </Badge>
              <div className="w-8 h-1 bg-gray-200 rounded">
                <div 
                  className={`h-full rounded transition-all duration-500 ${
                    generationStep === 'saving' 
                      ? 'bg-blue-500 w-full' 
                      : 'bg-blue-500 w-0'
                  }`}
                />
              </div>
              <Badge 
                className={`${
                  generationStep === 'saving' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                3
              </Badge>
            </div>
          </div>

          {/* Step Title */}
          <h3 className="text-lg font-semibold text-fitness-primary-800 mb-2">
            {stepInfo.title}
          </h3>

          {/* Step Description */}
          <p className="text-fitness-primary-600 mb-4">
            {stepInfo.description}
          </p>

          {/* Loading Animation */}
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-fitness-primary-500"></div>
            <span className="text-sm text-fitness-primary-500">
              {t('mealPlan.pleaseWait') || 'Please wait...'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
