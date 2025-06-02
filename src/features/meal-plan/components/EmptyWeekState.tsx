
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Target, Utensils } from "lucide-react";
import { useMealPlanTranslations } from '@/utils/mealPlanTranslations';

interface EmptyWeekStateProps {
  onGenerateAI: () => void;
  isGenerating: boolean;
}

export const EmptyWeekState = ({ onGenerateAI, isGenerating }: EmptyWeekStateProps) => {
  const {
    noMealPlan,
    generateFirstPlan,
    generateAIMealPlan,
    aiPowered,
    personalizedNutrition
  } = useMealPlanTranslations();

  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <div className="space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-fitness-primary-100 to-fitness-accent-100 rounded-full flex items-center justify-center">
                <Utensils className="w-12 h-12 text-fitness-primary-600" />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                {noMealPlan}
              </h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                {generateFirstPlan}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <Sparkles className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">{aiPowered}</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium text-green-900">{personalizedNutrition}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <Button
                onClick={onGenerateAI}
                disabled={isGenerating}
                size="lg"
                className="bg-gradient-to-r from-fitness-primary-600 to-fitness-accent-600 hover:from-fitness-primary-700 hover:to-fitness-accent-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {isGenerating ? 'Generating...' : generateAIMealPlan}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
