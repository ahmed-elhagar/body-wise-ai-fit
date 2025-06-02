
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ChefHat } from "lucide-react";
import { useMealPlanTranslations } from '@/utils/mealPlanTranslations';

interface EmptyWeekStateProps {
  onGenerateClick: () => void;
}

export const EmptyWeekState = ({ onGenerateClick }: EmptyWeekStateProps) => {
  const { smartMealPlanning, personalizedNutrition, generateAIMealPlan } = useMealPlanTranslations();

  return (
    <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
          <ChefHat className="w-8 h-8 text-white" />
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {smartMealPlanning}
          </h3>
          <p className="text-gray-600 mb-6">
            {personalizedNutrition}
          </p>
        </div>

        <Button 
          onClick={onGenerateClick}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {generateAIMealPlan}
        </Button>
      </div>
    </Card>
  );
};
