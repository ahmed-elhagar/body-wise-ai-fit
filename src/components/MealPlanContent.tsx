import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import MealCard from "./MealCard";
import type { Meal } from "@/types/meal";

interface MealPlanContentProps {
  meals: Meal[];
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal) => void;
}

const MealPlanContent = ({ meals, onShowRecipe, onExchangeMeal }: MealPlanContentProps) => {
  const { t } = useI18n();

  const mealsByType = meals.reduce((acc, meal) => {
    const type = meal.meal_type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(meal);
    return acc;
  }, {} as Record<string, Meal[]>);

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="space-y-6">
      {mealTypes.map(type => {
        const typeMeals = mealsByType[type] || [];
        if (typeMeals.length === 0) return null;

        return (
          <Card key={type} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold capitalize">{t(`mealType.${type}`)}</h3>
              <Badge variant="outline">
                {typeMeals.length} {typeMeals.length === 1 ? 'meal' : 'meals'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {typeMeals.map((meal, index) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  index={index}
                  onShowRecipe={onShowRecipe}
                  onExchangeMeal={onExchangeMeal}
                />
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default MealPlanContent;
