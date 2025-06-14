
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Sparkles } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface EmptyDailyStateProps {
  date: Date;
  onGenerate?: () => void;
}

const EmptyDailyState = ({ date, onGenerate }: EmptyDailyStateProps) => {
  const { tFrom } = useI18n();
  const tMealPlan = tFrom('mealPlan');

  return (
    <Card className="p-8 text-center bg-gradient-to-br from-white via-blue-50/30 to-green-50/50 border-0 shadow-xl">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center">
        <ChefHat className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {String(tMealPlan('noMealsForDay'))}
      </h3>
      
      <p className="text-gray-600 mb-4">
        {String(tMealPlan('generateMealsForDay'))}
      </p>
      
      {onGenerate && (
        <Button onClick={onGenerate} className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
          <Sparkles className="w-4 h-4 mr-2" />
          {String(tMealPlan('generateMeals'))}
        </Button>
      )}
    </Card>
  );
};

export default EmptyDailyState;
