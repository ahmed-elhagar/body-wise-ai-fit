
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ChefHat, Calendar, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmptyWeekStateProps {
  onGenerateAI: () => void;
  isGenerating: boolean;
}

export const EmptyWeekState = ({ onGenerateAI, isGenerating }: EmptyWeekStateProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="min-h-[500px] flex items-center justify-center">
      <Card className="max-w-2xl mx-auto bg-gradient-to-br from-white to-blue-50/50 border-blue-200/50 shadow-xl">
        <div className="p-12 text-center">
          {/* Hero Icon */}
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <ChefHat className="w-12 h-12 text-white" />
          </div>

          {/* Title and Description */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('mealPlan.noMealPlanYet') || 'No Meal Plan Yet'}
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            {t('mealPlan.startJourneyDescription') || 'Start your nutrition journey with an AI-powered meal plan tailored to your goals and preferences.'}
          </p>

          {/* Features List */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  {t('mealPlan.aiPowered') || 'AI-Powered'}
                </h4>
                <p className="text-xs text-gray-600">
                  {t('mealPlan.aiPoweredDescription') || 'Smart meal suggestions'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  {t('mealPlan.weeklyPlanning') || 'Weekly Planning'}
                </h4>
                <p className="text-xs text-gray-600">
                  {t('mealPlan.weeklyPlanningDescription') || '7-day meal schedules'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  {t('mealPlan.nutritionTracking') || 'Nutrition Tracking'}
                </h4>
                <p className="text-xs text-gray-600">
                  {t('mealPlan.nutritionTrackingDescription') || 'Track your goals'}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={onGenerateAI}
            disabled={isGenerating}
            size="lg"
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg px-8 py-3 text-lg font-semibold"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isGenerating 
              ? (t('mealPlan.generating') || 'Generating...') 
              : (t('mealPlan.generateMealPlan') || 'Generate My Meal Plan')
            }
          </Button>

          <p className="text-sm text-gray-500 mt-4">
            {t('mealPlan.freeToGenerate') || 'Free to generate • Takes 30-60 seconds'}
          </p>
        </div>
      </Card>
    </div>
  );
};
