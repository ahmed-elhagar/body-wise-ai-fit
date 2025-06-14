
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMealPlanTranslations } from '@/utils/mealPlanTranslations';

interface AddMealCardProps {
  mealType?: string;
  onAddMeal: () => void;
}

export const AddMealCard = ({ mealType, onAddMeal }: AddMealCardProps) => {
  const { addSnack } = useMealPlanTranslations();

  return (
    <Card className="border-2 border-dashed border-gray-300 hover:border-teal-400 transition-colors cursor-pointer">
      <CardContent className="p-0">
        <Button
          variant="ghost"
          className="w-full h-full min-h-[200px] flex flex-col items-center justify-center space-y-2 text-gray-500 hover:text-teal-600"
          onClick={onAddMeal}
        >
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium">
            {mealType === 'snack' ? addSnack : `Add ${mealType || 'meal'}`}
          </span>
        </Button>
      </CardContent>
    </Card>
  );
};
